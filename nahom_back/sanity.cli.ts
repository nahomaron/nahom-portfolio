import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'ea9jltyb',
    dataset: 'production',
  },
  deployment: {
    // Deploy the version verified by CI and package-lock.json.
    autoUpdates: false,
  },
});
