import { describe, expect, test } from 'vitest';
import { LocalCache } from '../src';

describe('Create cache', () => {
  test('Local cache instances', () => {
    const localCache = new LocalCache();
    expect(localCache.get).toBeDefined();
    expect(localCache.set).toBeDefined();
    expect(localCache.delete).toBeDefined();
  });

  test('Base cache operations', async () => {
    const cache = new LocalCache();
    const key = 'cache';
    const value = { msg: 'hello world' };

    cache.set(key, value, Infinity);
    expect(cache.get(key)).toEqual(value);
    expect(cache.delete(key)).toBe(true);
    expect(cache.get(key)).toBeNull();
  });
});
