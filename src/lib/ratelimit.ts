import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const ratelimit = redisUrl && redisToken
  ? new Ratelimit({
      redis: new Redis({
        url: redisUrl,
        token: redisToken,
      }),
      limiter: Ratelimit.slidingWindow(30, '1 m'),
      analytics: true,
      prefix: 'wangyue:ratelimit:',
    })
  : null;

export const IP_RATE_LIMIT = 60;
export const USER_RATE_LIMIT = 30;
export const GLOBAL_CONCURRENCY = 100;
