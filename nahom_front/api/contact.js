const { createClient } = require('@sanity/client');
const { createHmac } = require('node:crypto');

const WINDOW_SECONDS = 600;
const MAX_REQUESTS = 5;
const RATE_SCRIPT =
  "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end; return {n, redis.call('TTL', KEYS[1])}";

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) {
    return res.status(415).json({ message: 'Please send JSON.' });
  }

  let payload = req.body;
  if (typeof payload === 'string') {
    if (Buffer.byteLength(payload) > 16384) {
      return res.status(413).json({ message: 'Message is too large.' });
    }
    try {
      payload = JSON.parse(payload);
    } catch {
      return res.status(400).json({ message: 'Invalid JSON payload.' });
    }
  }
  if (
    !payload ||
    Array.isArray(payload) ||
    !['name', 'email', 'message'].every(
      (key) => typeof payload[key] === 'string',
    )
  ) {
    return res
      .status(400)
      .json({ message: 'Name, email, and message must be text.' });
  }
  const name = payload.name.trim();
  const email = payload.email.trim();
  const message = payload.message.trim();
  if (
    !name ||
    name.length > 120 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    message.length < 20 ||
    message.length > 2000
  ) {
    return res
      .status(400)
      .json({
        message:
          'Enter a name (1–120 characters), valid email, and message (20–2000 characters).',
      });
  }
  // Silently discard submissions that fill the hidden bot field.
  if (payload.website)
    return res.status(200).json({ message: 'Message sent successfully.' });

  const token = process.env.SANITY_API_TOKEN;
  const dataset = process.env.SANITY_CONTACT_DATASET;
  const publicDataset =
    process.env.SANITY_DATASET ||
    process.env.VITE_SANITY_DATASET ||
    'production';
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (
    !token ||
    !dataset ||
    dataset === publicDataset ||
    !redisUrl ||
    !redisToken
  ) {
    return res
      .status(503)
      .json({
        message:
          'Contact form is temporarily unavailable. Please use the email link.',
      });
  }

  try {
    // Vercel replaces this header at its trusted edge. Other hosts use the socket address.
    const forwarded = process.env.VERCEL
      ? req.headers['x-forwarded-for']
      : null;
    const ip =
      (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null) ||
      req.socket?.remoteAddress;
    if (!ip) throw new Error('Client address unavailable');
    const key = `portfolio:contact:${createHmac('sha256', redisToken).update(ip).digest('hex')}`;
    const rateResponse = await fetch(redisUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        'EVAL',
        RATE_SCRIPT,
        '1',
        key,
        String(WINDOW_SECONDS),
      ]),
      signal: AbortSignal.timeout(5000),
    });
    if (!rateResponse.ok) throw new Error('Rate limit service unavailable');
    const rate = await rateResponse.json();
    if (
      rate.error ||
      !Array.isArray(rate.result) ||
      !Number.isFinite(Number(rate.result[0]))
    ) {
      throw new Error('Invalid rate limit response');
    }
    if (Number(rate.result[0]) > MAX_REQUESTS) {
      res.setHeader(
        'Retry-After',
        String(Math.max(1, Number(rate.result[1]) || WINDOW_SECONDS)),
      );
      return res
        .status(429)
        .json({ message: 'Too many messages. Please try again later.' });
    }

    const sanityClient = createClient({
      projectId:
        process.env.SANITY_PROJECT_ID ||
        process.env.VITE_SANITY_PROJECT_ID ||
        'ea9jltyb',
      dataset,
      apiVersion: '2023-10-01',
      token,
      useCdn: false,
      timeout: 10000,
      maxRetries: 0,
    });
    // Refuse writes unless Sanity confirms that the destination dataset is private.
    const datasets = await sanityClient.datasets.list();
    if (
      !datasets.some(
        (entry) => entry.name === dataset && entry.aclMode === 'private',
      )
    ) {
      throw new Error('Contact dataset must be private');
    }
    await sanityClient.create({
      _type: 'contact',
      name,
      email,
      message,
      submittedAt: new Date().toISOString(),
    });
    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch {
    // Do not log message contents, credentials, or provider errors containing request data.
    console.error(
      'Contact submission failed; check private dataset and rate limit configuration.',
    );
    return res
      .status(503)
      .json({
        message:
          'Unable to send right now. Please try again or use the email link.',
      });
  }
};
