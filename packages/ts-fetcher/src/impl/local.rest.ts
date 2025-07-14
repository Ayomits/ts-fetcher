import { LocalCache } from '@ts-fetcher/cache';
import { createRest } from '@ts-fetcher/rest';

export const {
  createCustomRestInstance: createLocalCacheRestInstance,
  CustomRest: LocalCacheRest,
} = createRest({
  cache: new LocalCache(),
});
