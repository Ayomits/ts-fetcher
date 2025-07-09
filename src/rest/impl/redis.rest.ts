import { Rest } from '@/rest/rest';
import { createCache } from '@/cache/create-cache';
import { RedisOptions } from 'ioredis';

export class RedisCacheRest extends Rest {
  constructor(origin: string, options: RedisOptions) {
    super(origin, {
      cache: createCache('redis', options),
    });
  }
}

export function createRedisCacheRest(origin: string, options: RedisOptions) {
  return new RedisCacheRest(origin, options);
}
