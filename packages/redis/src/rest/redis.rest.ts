import { RedisCache } from '@/strategies/redis';
import { createRest } from '@ts-fetcher/rest';
import { RestClientConfiguration } from '@ts-fetcher/types';
import { RedisOptions } from 'ioredis';

export function createRedisRest(redisConnect: RedisOptions, restOptions?: RestClientConfiguration) {
  return createRest({
    ...restOptions,
    cache: new RedisCache(redisConnect),
  });
}
