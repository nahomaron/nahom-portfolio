# Nahom portfolio frontend

React 18 frontend built with Vite. Use Node.js 22.x.

```bash
npm ci
npm start
npm test
npm run test:api
npm run build
```

Copy `.env.example` to an untracked `.env` file for local configuration. Vite exposes only `VITE_*` values to the browser; keep server tokens in server-only variables. Existing deployments must rename their `REACT_APP_SANITY_*` browser configuration to `VITE_SANITY_*` during migration.

`npm start` runs the frontend. Use `vercel dev` to run the contact API locally. See [production deployment instructions](../DEPLOYMENT.md) for private contact storage, shared rate limiting, Studio inbox access, and hosting setup.
