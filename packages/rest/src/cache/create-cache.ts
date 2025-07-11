import { LiteralEnum } from '@/lib';
import { RestCache } from '@/rest';
import { RedisOptions } from 'ioredis';
import { RedisCache, LocalCache } from './strategies';

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
