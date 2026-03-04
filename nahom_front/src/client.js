import imageUrlBuilder from '@sanity/image-url';
import { createClient } from '@sanity/client';

const projectId = process.env.REACT_APP_SANITY_PROJECT_ID || 'ea9jltyb';
const dataset = process.env.REACT_APP_SANITY_DATASET || 'production';
const apiVersion = process.env.REACT_APP_SANITY_API_VERSION || '2023-10-01';
const useCdnEnv = process.env.REACT_APP_SANITY_USE_CDN;
const useCdn = useCdnEnv ? useCdnEnv !== 'false' : process.env.NODE_ENV === 'production';

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
