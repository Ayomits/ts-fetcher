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
