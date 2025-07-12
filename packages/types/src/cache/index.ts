import { Timestamp } from '@/utility';

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
  includeMetadata: IncludeMetadata; // Более описательное название
}

// ==================== Core Cache Interfaces ====================
export interface BaseCacheService {
  get<T>(key: string): Promise<T | null> | T | null;
  set<T>(key: string, value: T, ttl: number): Promise<void> | void;
  delete(key: string): Promise<boolean> | boolean;
}

export interface ExtendedCacheService extends BaseCacheService {
  get<T = unknown, IncludeMetadata extends boolean = false>(
    key: string,
    options?: CacheRetrievalOptions<IncludeMetadata>
  ): CacheRetrievalResult<IncludeMetadata, T> | null;

  get<T = unknown>(key: string): T | null;
}

// ==================== Type Utilities ====================
export type CacheServiceImplementation<T extends BaseCacheService = ExtendedCacheService> =
  | BaseCacheService
  | ExtendedCacheService
  | T;
