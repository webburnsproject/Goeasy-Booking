const Redis = require('ioredis');

let redisClient = null;
let isRedisAvailable = false;

// Memory cache fallback for when Redis is disconnected or during local tests
const memoryCache = new Map();

const initRedis = () => {
  try {
    let rawUri = process.env.REDIS_URI || '';
    if (!rawUri) {
      console.log('[Redis]: REDIS_URI not configured, using in-memory cache.');
      return;
    }

    // Extract URL if prefixed with 'redis-cli -u'
    let cleanUrl = rawUri;
    const match = rawUri.match(/redis:\/\/[^\s'"]+/);
    if (match) {
      cleanUrl = match[0];
    }

    redisClient = new Redis(cleanUrl, {
      maxRetriesPerRequest: 2,
      retryStrategy(times) {
        if (times > 3) {
          console.warn('[Redis]: Max reconnection attempts reached, switching to in-memory fallback.');
          return null; // stop reconnecting
        }
        return Math.min(times * 1000, 3000);
      },
      connectTimeout: 5000,
    });

    redisClient.on('connect', () => {
      isRedisAvailable = true;
      console.log('[Redis]: Connected successfully to Redis Cloud');
    });

    redisClient.on('error', (err) => {
      isRedisAvailable = false;
      console.warn(`[Redis Notice]: Redis unavailable (${err.message}). Using fast in-memory cache fallback.`);
    });
  } catch (error) {
    isRedisAvailable = false;
    console.warn(`[Redis Initialization Notice]: ${error.message}. Using fast in-memory cache fallback.`);
  }
};

const getCache = async (key) => {
  try {
    if (isRedisAvailable && redisClient) {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    }
  } catch (err) {
    // fallback
  }
  const item = memoryCache.get(key);
  if (item && item.expiry > Date.now()) {
    return item.value;
  }
  return null;
};

const setCache = async (key, value, ttlSeconds = 120) => {
  try {
    if (isRedisAvailable && redisClient) {
      await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      return;
    }
  } catch (err) {
    // fallback
  }
  memoryCache.set(key, {
    value,
    expiry: Date.now() + ttlSeconds * 1000,
  });
};

const deleteCache = async (patternOrKey) => {
  try {
    if (isRedisAvailable && redisClient) {
      if (patternOrKey.includes('*')) {
        const keys = await redisClient.keys(patternOrKey);
        if (keys.length > 0) {
          await redisClient.del(...keys);
        }
      } else {
        await redisClient.del(patternOrKey);
      }
    }
  } catch (err) {
    // fallback
  }
  for (const k of memoryCache.keys()) {
    if (patternOrKey.includes('*')) {
      const regex = new RegExp('^' + patternOrKey.replace('*', '.*') + '$');
      if (regex.test(k)) memoryCache.delete(k);
    } else if (k === patternOrKey) {
      memoryCache.delete(k);
    }
  }
};

module.exports = {
  initRedis,
  getCache,
  setCache,
  deleteCache,
  isRedisAvailable: () => isRedisAvailable,
};
