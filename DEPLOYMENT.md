# Production deployment

## Vercel frontend and API

1. Import this repository in Vercel. Set **Root Directory** to `nahom_front`, framework to Vite, and Node.js to **22.x**. The committed `vercel.json` preserves direct links to resume/project pages and adds security headers.
2. Existing deployments must rename browser `REACT_APP_SANITY_*` settings to `VITE_SANITY_*` and use `dist` as the build output directory. Use `nahom_front/.env.example` as the environment variable checklist. Set variables separately for Preview and Production. Only `VITE_*` values are public. Never prefix a Sanity write token or Redis token with `VITE_`.
3. In Sanity, create a **private** dataset named `contacts` (or another name distinct from the public portfolio dataset). Set `SANITY_CONTACT_DATASET` to that name. The API checks dataset visibility before writing and refuses public destinations. Give the server token the minimum permissions needed to create contact documents and list dataset metadata; keep it server-only. Public portfolio content can remain in `production`.
4. Create an Upstash Redis database and set its REST URL and REST token. The API uses an atomic Redis script to allow five submissions per client IP per ten minutes across serverless instances. Redis stores an HMAC of the client address, not the raw address. If Redis or private storage is missing/unavailable, submissions return 503 and visitors can use the email link. Do not replace the shared limiter with an in-memory counter. The proxy-header trust assumes Vercel; other hosts require their own trusted proxy integration.
5. Add the preview and production frontend origins to Sanity CORS for public reads. Enable credentials only if explicitly needed; the public frontend does not need write access.
6. Deploy a preview first. Verify home content, direct navigation/refresh at `/resume` and `/projects/<published-slug>`, PDF download, light/dark themes, mobile navigation with keyboard, and the contact success/error flow. Submit one synthetic contact and confirm it appears only in the private inbox. Confirm unauthenticated queries cannot read the contacts dataset; delete the synthetic message afterward.
7. Configure the production domain in Vercel, verify HTTPS, then promote the validated deployment. CI checks must pass before merge.

## Sanity Studio / private inbox

The Studio is upgraded to Sanity 6 and React 19 (independent of the React 18 frontend). Use Node 22.12 or newer within the 22.x release line. Set `SANITY_STUDIO_CONTACT_DATASET=contacts` when running or building `nahom_back`. The Studio provides a portfolio workspace at `/portfolio` and a contact inbox at `/contacts`; inbox access requires Sanity authentication and dataset permissions. No inbox workspace is added when that variable is absent. Run `npm ci` and `npm run build` in `nahom_back` before deploying Studio.

**Existing messages:** the previous handler wrote contacts into `production`. If that dataset is public, review existing `contact` documents with an authenticated Sanity administrator. Move any messages that must be retained into the private dataset, verify the copy, then remove their public copies. This PR deliberately does not migrate or delete production data.

## Local verification

Use Node 22. In `nahom_front`, run:

```bash
npm ci
npm run test:api
npm test
npm run build
```

`npm start` serves the frontend only. Use `vercel dev` from `nahom_front` to exercise the API with local server environment variables; keep `.env` untracked. The tests mock Sanity/Redis and do not send real messages.

## Maintenance

The frontend uses Vite and Vitest. Review dependency audit findings regularly and test updates before release. Contact delivery is storage in Sanity, not email notification. Configure retention and review the private inbox regularly. The phone link now matches the displayed US number; verify that this is the desired business contact before release.
