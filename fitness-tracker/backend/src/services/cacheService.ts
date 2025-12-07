import redisClient from '../config/redis';

const CACHE_TTL = 60 * 60; // 1 hour default TTL

const setCache = async (key: string, value: any, ttl: number = CACHE_TTL): Promise<void> => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await redisClient.setex(key, ttl, stringValue);
  } catch (error) {
    console.error('Error setting cache:', error);
    throw error;
  }
};

const getCache = async (key: string): Promise<any> => {
  try {
    const value = await redisClient.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error('Error getting cache:', error);
    throw error;
  }
};

const delCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error('Error deleting cache:', error);
    throw error;
  }
};

const delCacheByPattern = async (pattern: string): Promise<void> => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } catch (error) {
    console.error('Error deleting cache by pattern:', error);
    throw error;
  }
};

export { setCache, getCache, delCache, delCacheByPattern };