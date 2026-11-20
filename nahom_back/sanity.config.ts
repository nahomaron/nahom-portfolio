import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

const portfolio = {
  name: 'default',
  title: 'nahom profile',
  projectId: 'ea9jltyb',
  dataset: 'production',
  plugins: [
    structureTool(),
    ...(process.env.NODE_ENV === 'development' ? [visionTool()] : []),
  ],
  schema: {
    types: schemaTypes.filter((schema) => schema.name !== 'contact'),
  },
};

// Set this to the private dataset used by the contact API to enable the inbox workspace.
const contactDataset = process.env.SANITY_STUDIO_CONTACT_DATASET;
export default defineConfig([
  { ...portfolio, basePath: '/portfolio' },
  ...(contactDataset && contactDataset !== portfolio.dataset
    ? [
        {
          ...portfolio,
          name: 'contacts',
          title: 'Private contact inbox',
          basePath: '/contacts',
          dataset: contactDataset,
          schema: {
            types: schemaTypes.filter((schema) => schema.name === 'contact'),
          },
        },
      ]
    : []),
]);
