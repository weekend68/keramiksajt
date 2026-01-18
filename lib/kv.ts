import { Redis } from '@upstash/redis';

// Use Redis client with REDIS_URL from Vercel
export const kv = Redis.fromEnv();
