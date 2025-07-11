import { LocalCacheService } from '@/cache/types';
import { GetCacheValueOptions, GetCacheValueReturn, LocalCacheValues } from './local-cache.types';

export class LocalCache implements LocalCacheService {
  private cache: Map<string, LocalCacheValues>;

  constructor() {
    this.cache = new Map();
  }

  get<T = unknown, R extends boolean = false>(
    key: string,
    options?: GetCacheValueOptions<R>
  ): GetCacheValueReturn<R, T> | null {
    const value = this.cache.get(key);
    if (!value) return null;

    if (value.expiresAt && value.expiresAt < Date.now()) {
      this.del(key);
      return null;
    }

    return (options?.raw ? value : value.data) as GetCacheValueReturn<R, T>;
  }

  set<T = unknown>(key: string, value: T, ttl: number): void {
    const now = Date.now();
    const expiresAt = Number.isFinite(ttl) && ttl !== Infinity ? now + ttl : null;

    const existing = this.cache.get(key);
    if (existing?.timeout) {
      clearTimeout(existing.timeout);
    }

    this.cache.set(key, {
      createdAt: now,
      data: value,
      timeout: expiresAt ? setTimeout(() => this.del(key), ttl) : null,
      expiresAt,
    });
  }

  del(key: string): boolean {
    const value = this.cache.get(key);
    if (!value) return false;

    if (value.timeout) {
      clearTimeout(value.timeout);
    }

    return this.cache.delete(key);
  }
}
