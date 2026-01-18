import { Redis } from '@upstash/redis';

// Parse REDIS_URL to extract URL and token
// Format: redis://default:TOKEN@HOST:PORT
function parseRedisUrl() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error('REDIS_URL not found');
  }

  // Parse URL
  const url = new URL(redisUrl);
  const token = url.password;
  const restUrl = `https://${url.hostname}`;

  return { url: restUrl, token };
}

// Create Redis client
const { url, token } = parseRedisUrl();
export const kv = new Redis({ url, token });
