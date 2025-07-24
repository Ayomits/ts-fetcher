import {
  CachedValue,
  CacheRetrievalOptions,
  CacheRetrievalResult,
  ExtendedCacheService,
} from '@ts-fetcher/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class LocalCache<K extends string = string, V = any> implements ExtendedCacheService {
  protected cache: Map<K, CachedValue<V>>;

  constructor() {
    this.cache = new Map();
  }

  entries() {
    return this.cache.entries();
  }

  keys() {
    return this.cache.keys();
  }

  values() {
    return this.cache.values();
  }

  toObject() {
    return Object.fromEntries(this.entries());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get<T = any, R extends boolean = false>(
    key: K,
    options?: CacheRetrievalOptions<R>
  ): CacheRetrievalResult<R, T> | null {
    const value = this.cache.get(key);
    if (!value) return null;

    if (value.expiresAt && value.expiresAt < Date.now()) {
      this.delete(key);
      return null;
    }

    return (options?.includeMetadata ? value : value.data) as CacheRetrievalResult<R, T>;
  }

  // @ts-expect-error I hate ts
  set<T extends V = V>(
    key: K,
    value: T,
    ttl: number,
    onExpire?: (key: string, value: T, raw: Omit<CachedValue<T>, 'evictionTimeout'>) => void
  ): void {
    const now = Date.now();
    const expiresAt = Number.isFinite(ttl) && ttl !== Infinity ? now + ttl : null;

    const existing = this.cache.get(key);
    if (existing?.evictionTimeout) {
      clearTimeout(existing.evictionTimeout);
    }

    const raw: Partial<CachedValue<V>> = {
      createdAt: now,
      data: value as unknown as V,
      expiresAt,
    };

    raw.evictionTimeout = expiresAt
      ? setTimeout(() => {
          this.delete(key);
          // @ts-expect-error idk
          onExpire?.(key, value, raw);
        }, ttl)
      : null;

    // @ts-expect-error idk
    this.cache.set(key, raw);
  }

  delete(key: K): boolean {
    const value = this.cache.get(key);
    if (!value) return false;

    if (value.evictionTimeout) {
      clearTimeout(value.evictionTimeout);
    }

    return this.cache.delete(key);
  }

  clearAll() {
    try {
      Object.values(this.cache).forEach(
        (item) => item.evictionTimeout && clearTimeout(item.evictionTimeout)
      );
      this.cache.clear();
      return true;
    } catch (err) {
      throw new Error(`Error while clearing cache\n ${err}`);
    }
  }
}
