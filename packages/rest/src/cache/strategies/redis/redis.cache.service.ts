import { CacheService } from '@/cache/types';
import { Redis, RedisOptions } from 'ioredis';

export class RedisCache implements CacheService {
  private client: Redis;
  private isReady: boolean = false;

  constructor(options: RedisOptions) {
    this.client = new Redis({
      ...options,
      retryStrategy: (times) => {
        return Math.min(times * 1000, 5000);
      },
      reconnectOnError: () => {
        return true;
      },
    });

    this.client.on('ready', () => {
      this.isReady = true;
    });

    this.client.on('error', () => {
      this.isReady = false;
    });

    this.client.on('end', () => {
      this.isReady = false;
    });
  }

  private async ensureConnection(): Promise<void> {
    if (!this.isReady) {
      await new Promise<void>((resolve) => {
        const check = () => {
          if (this.isReady) {
            resolve();
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      });
    }
  }

  public async get<T = unknown>(key: string): Promise<T | null> {
    try {
      await this.ensureConnection();
      const redisValue = await this.client.get(key);
      if (!redisValue) return null;

      try {
        return JSON.parse(redisValue) as T;
      } catch {
        return redisValue as T;
      }
    } catch (err) {
      throw new Error(`Redis error \n ${err}`);
    }
  }

  public async set<T>(key: string, value: T, ttl: number): Promise<void> {
    try {
      await this.ensureConnection();
      const valueToSet = typeof value === 'string' ? value : JSON.stringify(value);

      if (Number.isFinite(ttl) && ttl !== Infinity) {
        await this.client.set(key, valueToSet, 'PX', ttl);
      } else {
        await this.client.set(key, valueToSet);
      }
    } catch (err) {
      throw new Error(`Redis set error\n${err}`);
    }
  }

  public async del(key: string): Promise<boolean> {
    try {
      await this.ensureConnection();
      const result = await this.client.del(key);
      return result > 0;
    } catch (err) {
      throw new Error(`Redis delete error\n${err}`);
    }
  }
}
