import { LiteralEnum } from '@/lib/literal-enum';
import { LocalCache } from './strategies/local/local.cache.service';
import { RedisOptions } from 'ioredis';
import { RedisCache } from './strategies/redis/redis.cache.service';
import { RestCache } from '@/rest/types';

export const CacheStrategies = {
  Local: 'local',
  Redis: 'redis',
} as const;

export type CacheStrategies = LiteralEnum<typeof CacheStrategies>;

type CacheOptions<T extends CacheStrategies> = T extends typeof CacheStrategies.Redis
  ? RedisOptions
  : undefined;

export function createCache<T extends CacheStrategies = CacheStrategies>(
  type: T,
  options?: CacheOptions<T>
): RestCache {
  switch (type) {
    case 'redis':
      return new RedisCache(options!);
    default:
      return new LocalCache();
  }
}
