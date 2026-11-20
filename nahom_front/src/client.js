import imageUrlBuilder from '@sanity/image-url';
import { createClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'ea9jltyb';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2023-10-01';
const useCdnEnv = import.meta.env.VITE_SANITY_USE_CDN;
const useCdn = useCdnEnv ? useCdnEnv !== 'false' : import.meta.env.PROD;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);

export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
};
