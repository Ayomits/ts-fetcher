# @ts-fetcher/redis

1. Installation

```bash
npm install ioredis @ts-fetcher/redis
# or
yarn add ioredis @ts-fetcher/redis
# or
bun add ioredis @ts-fetcher/redis
# or
pnpm add ioredis @ts-fetcher/redis
```

2. Usage

```ts
import { RedisCache, LocalCache } from '@ts-fetcher/cache';

const local = new LocalCache();

const redis = new RedisCache({
  host: 'localhost',
  password: 'redis',
  port: 6379,
});

await redis.get<string>('key');
await redis.set<string>('key', 'value', 500);
await redis.del('key');
```
