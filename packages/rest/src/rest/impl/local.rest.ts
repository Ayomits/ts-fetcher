import { Rest } from '@/rest/rest';
import { createCache } from '@/cache/create-cache';

export class LocalCacheRest extends Rest {
  constructor(origin: string) {
    super(origin, {
      cache: createCache('local'),
    });
  }
}
