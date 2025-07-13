import { describe, expect, test, vi } from 'vitest';
import { LocalCache } from '../src';

describe('Caching tests', () => {
  test('TTL expiration', async () => {
    vi.useFakeTimers();

    const cache = new LocalCache();
    const key = 'temp';
    const value = { data: 'temporary' };
    const ttl = 1000;

    cache.set(key, value, ttl);

    expect(cache.get(key)).toEqual(value);

    vi.advanceTimersByTime(ttl / 2);
    expect(cache.get(key)).toEqual(value);

    vi.advanceTimersByTime(ttl / 2 + 1);
    expect(cache.get(key)).toBeNull();

    vi.useRealTimers();
  });

  test('TTL with metadata', async () => {
    vi.useFakeTimers();

    const cache = new LocalCache();
    const key = 'with_metadata';
    const value = { data: 'test' };
    const ttl = 2000;

    cache.set(key, value, ttl);

    const withMetadata = cache.get(key, { includeMetadata: true });
    expect(withMetadata).toHaveProperty('data', value);
    expect(withMetadata).toHaveProperty('createdAt');
    expect(withMetadata).toHaveProperty('expiresAt');
    expect(withMetadata?.expiresAt).toBeGreaterThan(Date.now());

    vi.advanceTimersByTime(ttl + 1);
    expect(cache.get(key)).toBeNull();

    vi.useRealTimers();
  });
});
