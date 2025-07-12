import { RedisOptions } from 'ioredis';
import { RedisCache, LocalCache } from './strategies';
import { type LiteralEnum, type CacheServiceImplementation } from '@ts-fetcher/types';

export const CacheStrategies = {
  Local: 'local',
  Redis: 'redis',
} as const;

export type CacheStrategies = LiteralEnum<typeof CacheStrategies>;

export type CacheOptions<T extends CacheStrategies> = T extends typeof CacheStrategies.Redis
  ? RedisOptions
  : undefined;

export function createCache<T extends CacheStrategies = CacheStrategies>(
  type: T,
  options?: CacheOptions<T>
): CacheServiceImplementation {
  switch (type) {
    case 'redis':
      return new RedisCache(options!);
    default:
      return new LocalCache();
  }
}
