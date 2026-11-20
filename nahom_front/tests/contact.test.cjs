const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require.resolve('../api/contact'), 'utf8');

function fixture(options = {}) {
  const writes = [];
  const configs = [];
  const commands = [];
  const env = {
    SANITY_API_TOKEN: 'test-only',
    SANITY_CONTACT_DATASET: 'contacts',
    UPSTASH_REDIS_REST_URL: 'https://redis.example',
    UPSTASH_REDIS_REST_TOKEN: 'test-only',
    ...options.env,
  };
  const context = {
    module: { exports: {} },
    process: { env },
    Buffer,
    AbortSignal,
    console: { error() {} },
    require: (name) =>
      name === '@sanity/client'
        ? {
            createClient: (config) => {
              configs.push(config);
              return {
                datasets: {
                  list: async () => [
                    {
                      name: 'contacts',
                      aclMode: options.publicDataset ? 'public' : 'private',
                    },
                  ],
                },
                create: async (doc) => {
                  if (options.writeFailure) throw Error('provider');
                  writes.push(doc);
                },
              };
            },
          }
        : require(name),
    fetch: async (_url, request) => {
      commands.push(JSON.parse(request.body));
      if (options.redisFailure) throw Error('redis');
      return {
        ok: true,
        json: async () => ({ result: [options.count || 1, 300] }),
      };
    },
  };
  vm.runInNewContext(source, context);
  async function request(
    body = {
      name: 'Nahom',
      email: 'test@example.com',
      message: 'A sufficiently long contact message.',
    },
    overrides = {},
  ) {
    const response = {
      headers: {},
      setHeader(k, v) {
        this.headers[k] = v;
      },
      status(s) {
        this.statusCode = s;
        return this;
      },
      json(b) {
        this.body = b;
        return this;
      },
    };
    await context.module.exports(
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        socket: { remoteAddress: '127.0.0.1' },
        body,
        ...overrides,
      },
      response,
    );
    return response;
  }
  return { request, writes, configs, commands };
}

test('valid submission writes trimmed content only to private dataset', async () => {
  const f = fixture();
  assert.equal(
    (
      await f.request({
        name: ' Nahom ',
        email: ' test@example.com ',
        message: ' This is a sufficiently long message. ',
      })
    ).statusCode,
    200,
  );
  assert.equal(f.writes[0].name, 'Nahom');
  assert.equal(f.configs[0].dataset, 'contacts');
  assert.equal(f.commands[0][0], 'EVAL');
  assert.ok(!JSON.stringify(f.commands).includes('127.0.0.1'));
});
test('malformed bodies and field types return 400 without writes', async () => {
  for (const body of [
    '{',
    null,
    [],
    { name: 123 },
    { name: {}, email: 'test@example.com', message: 'hello' },
  ]) {
    const f = fixture();
    assert.equal((await f.request(body)).statusCode, 400);
    assert.equal(f.writes.length, 0);
  }
});
test('field limits and invalid email are rejected', async () => {
  for (const patch of [
    { name: ' ' },
    { name: 'x'.repeat(121) },
    { email: 'bad' },
    { email: 'x'.repeat(250) + '@a.com' },
    { message: 'short' },
    { message: 'x'.repeat(2001) },
  ]) {
    const f = fixture();
    assert.equal(
      (
        await f.request({
          name: 'Test',
          email: 'test@example.com',
          message: 'x'.repeat(20),
          ...patch,
        })
      ).statusCode,
      400,
    );
    assert.equal(f.writes.length, 0);
  }
});
test('rate limit returns retry header and does not write', async () => {
  const f = fixture({ count: 6 });
  const r = await f.request();
  assert.equal(r.statusCode, 429);
  assert.equal(r.headers['Retry-After'], '300');
  assert.equal(f.writes.length, 0);
});
test('configuration and provider failures fail closed', async () => {
  for (const options of [
    { env: { SANITY_API_TOKEN: '' } },
    { env: { SANITY_CONTACT_DATASET: 'production' } },
    { env: { UPSTASH_REDIS_REST_TOKEN: '' } },
    { publicDataset: true },
    { redisFailure: true },
    { writeFailure: true },
  ]) {
    const f = fixture(options);
    assert.equal((await f.request()).statusCode, 503);
    assert.equal(f.writes.length, 0);
  }
});
test('honeypot never writes', async () => {
  const f = fixture();
  assert.equal(
    (
      await f.request({
        name: 'Bot',
        email: 'bot@example.com',
        message: 'x'.repeat(20),
        website: 'spam',
      })
    ).statusCode,
    200,
  );
  assert.equal(f.writes.length, 0);
});
test('method, content type, and raw payload size are checked', async () => {
  const f = fixture();
  assert.equal((await f.request(undefined, { method: 'GET' })).statusCode, 405);
  assert.equal(
    (await f.request(undefined, { headers: { 'content-type': 'text/plain' } }))
      .statusCode,
    415,
  );
  assert.equal((await f.request('x'.repeat(17000))).statusCode, 413);
});
