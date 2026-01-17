import Redis from 'ioredis'
import config from './config'
import { red } from 'colorette'
import logger from '../utils/logger'

const REDIS_URL = config.REDIS_URL

if (!REDIS_URL) {
    throw new Error('REDIS_URL is not defined in the configuration.')
}

let redis: Redis | null = null

/**
 * Connects to Redis
 * @returns Redis instance
 */
export const connectRedis = (): Redis => {
    if (redis) {
        logger.warn('Redis is already connected.')
        return redis
    }

    redis = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            if (times >= 5) {
                return null
            }
            const delay = Math.min(times * 50, 2000)
            return delay
        },
        reconnectOnError(err) {
            const targetError = 'READONLY'
            if (err.message.includes(targetError)) {
                return true
            }
            return false
        }
    })

    redis.on('connect', () => {
        logger.info('Connected to Redis successfully.')
    })

    redis.on('error', (error) => {
        logger.error(red(`Redis connection error: ${error}`))
    })

    redis.on('reconnecting', () => {
        logger.warn('Reconnecting to Redis...')
    })

    redis.on('close', () => {
        logger.warn('Redis connection closed.')
    })

    return redis
}

/**
 * Gets the Redis instance
 * @throws Error if Redis is not connected
 */
export const getRedis = (): Redis => {
    if (!redis) {
        throw new Error('Redis is not connected. Call connectRedis() first.')
    }
    return redis
}

/**
 * Rate limiting using sliding window
 * Returns true if request is allowed, false if rate limit exceeded
 */
export async function checkRateLimit(
    key: string,
    limit: number,
    windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const redisClient = getRedis()
    const now = Date.now()
    const windowStart = now - windowSeconds * 1000
    const rateLimitKey = `ratelimit:${key}`

    // Remove old entries
    await redisClient.zremrangebyscore(rateLimitKey, 0, windowStart)

    // Count current requests
    const currentCount = await redisClient.zcard(rateLimitKey)

    if (currentCount >= limit) {
        // Get the oldest timestamp to calculate reset time
        const oldestTimestamps = await redisClient.zrange(rateLimitKey, 0, 0, 'WITHSCORES')
        const resetAt = oldestTimestamps[1] ? parseInt(oldestTimestamps[1]) + windowSeconds * 1000 : now + windowSeconds * 1000

        return {
            allowed: false,
            remaining: 0,
            resetAt
        }
    }

    // Add current request
    await redisClient.zadd(rateLimitKey, now, `${now}-${Math.random()}`)
    await redisClient.expire(rateLimitKey, windowSeconds)

    return {
        allowed: true,
        remaining: limit - currentCount - 1,
        resetAt: now + windowSeconds * 1000
    }
}

/**
 * Cache API key validation result
 */
export async function cacheApiKey(keyHash: string, data: string, ttl: number = 300): Promise<void> {
    const redisClient = getRedis()
    await redisClient.set(`apikey:${keyHash}`, data, 'EX', ttl)
}

/**
 * Get cached API key validation result
 */
export async function getCachedApiKey(keyHash: string): Promise<string | null> {
    const redisClient = getRedis()
    return await redisClient.get(`apikey:${keyHash}`)
}

/**
 * Invalidate API key cache
 */
export async function invalidateApiKeyCache(keyHash: string): Promise<void> {
    const redisClient = getRedis()
    await redisClient.del(`apikey:${keyHash}`)
}

export const closeRedisConnection = async () => {
    if (!redis) {
        logger.warn('Redis is not connected.')
        return
    }

    try {
        await redis.quit()
        redis = null
        logger.info('Redis connection closed successfully.')
    } catch (error) {
        logger.error('Error closing Redis connection:', error)
    }
}

export { redis }
export default redis
