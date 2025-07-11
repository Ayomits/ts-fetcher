import { GetCacheValueOptions, GetCacheValueReturn } from './strategies/local/local-cache.types';

export type Timestamp = number;

export interface CacheService {
  get<T>(key: string): Promise<T | null> | T | null;
  set<T>(key: string, value: T, ttl: number): Promise<void> | void;
  del(key: string): Promise<boolean> | boolean;
}

export interface LocalCacheService extends CacheService {
  get<T = unknown, R extends boolean = false>(
    key: string,
    options?: GetCacheValueOptions<R>
  ): GetCacheValueReturn<R, T> | null;

  get<T = unknown>(key: string): T | null;
}
