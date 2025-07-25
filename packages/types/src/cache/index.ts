/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Timestamp } from '@/utility';

// ==================== Cache Value Types ====================
export interface CachedValue<T = unknown> {
  data: T;
  createdAt: Timestamp;
  expiresAt: Timestamp | null;
  evictionTimeout: NodeJS.Timeout | null;
}

export type CacheRetrievalResult<
  IncludeMetadata extends boolean,
  T = unknown,
> = IncludeMetadata extends true ? CachedValue<T> : T;

// ==================== Cache Options ====================
export interface CacheRetrievalOptions<IncludeMetadata extends boolean = boolean> {
  includeMetadata: IncludeMetadata;
}

// ==================== Core Cache Interfaces ====================
export interface BaseCacheService {
  get<T = any>(key: string): Promise<T | null> | T | null;
  set<T = any>(
    key: string,
    value: T,
    ttl: number,
    onExpire?: (key: string, value: T, raw: Omit<CachedValue<T>, 'evictionTimeout'>) => void
  ): Promise<void> | void;
  delete(key: string): Promise<boolean> | boolean;
}

export interface ExtendedCacheService extends BaseCacheService {
  get<T = any, IncludeMetadata extends boolean = false>(
    key: string,
    options?: CacheRetrievalOptions<IncludeMetadata>
  ):
    | Promise<CacheRetrievalResult<IncludeMetadata, T> | null>
    | CacheRetrievalResult<IncludeMetadata, T>
    | null;
}
