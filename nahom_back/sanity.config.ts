import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: "default",
  title: "nahom profile",
  projectId: "ea9jltyb",
  dataset: "production",
  plugins: [
    deskTool(),
    ...(process.env.NODE_ENV === "development" ? [visionTool()] : []),
  ],
  schema: {
    types: schemaTypes,
  },
});
