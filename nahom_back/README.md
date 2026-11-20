# Portfolio content Studio

Sanity Studio 6 with React 19, built on Node.js 22. The public frontend remains independently on React 18.

```bash
npm ci
npm start
npm run build
```

Use npm and the committed package-lock.json. Set `SANITY_STUDIO_CONTACT_DATASET=contacts` to enable the separate private inbox workspace. See [DEPLOYMENT.md](../DEPLOYMENT.md) for dataset permissions, deployment, and the existing-message privacy review.

Automatic Studio upgrades are disabled so production uses the version verified by CI. Targeted dependency overrides patch the CLI's YAML/TOML parsers and minimatch; review and remove them when upstream dependencies incorporate these fixes. Recheck CLI startup and Studio builds when updating them.
