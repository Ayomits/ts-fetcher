import { createCache } from '@/cache/create-cache';
import { RestOptions } from './types';

export const DEFAULT_REST_OPTIONS: RestOptions = {
  cache: createCache('local'),
};
