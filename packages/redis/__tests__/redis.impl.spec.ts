import { describe, expect } from 'vitest';
import { createRedisRest } from '../src';

const fakeConnect = {
  host: 'redis',
  port: 6379,
  password: 'redis',
};

const API_URL = 'https://api.example.com/';

describe('Test createRedisRest factory', () => {
  const { CustomRest: RedisRest, createCustomRestInstance: createRedisRestInstance } =
    createRedisRest(fakeConnect);

  const instance = createRedisRestInstance(API_URL);

  expect(instance).toBeInstanceOf(RedisRest);

  expect(instance.get).toBeDefined();
  expect(instance.post).toBeDefined();
  expect(instance.patch).toBeDefined();
  expect(instance.put).toBeDefined();
  expect(instance.delete).toBeDefined();
});
