import Redis from 'ioredis'
import config from './config'
import { red } from 'colorette'
import logger from '../utils/logger'

const REDIS_URL = config.REDIS_URL

if (!REDIS_URL) {
    throw new Error('REDIS_URL is not defined in the configuration.')
}
export const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        if(times >= 5) {
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

/**
 * Rate limiting using sliding window
 * Returns true if request is allowed, false if rate limit exceeded
 */
export async function checkRateLimit(
    key: string,
    limit: number,
    windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const now = Date.now()
    const windowStart = now - windowSeconds * 1000
    const rateLimitKey = `ratelimit:${key}`

    // Remove old entries
    await redis.zremrangebyscore(rateLimitKey, 0, windowStart)

    // Count current requests
    const currentCount = await redis.zcard(rateLimitKey)

    if (currentCount >= limit) {
        // Get the oldest timestamp to calculate reset time
        const oldestTimestamps = await redis.zrange(rateLimitKey, 0, 0, 'WITHSCORES')
        const resetAt = oldestTimestamps[1] ? parseInt(oldestTimestamps[1]) + windowSeconds * 1000 : now + windowSeconds * 1000

        return {
            allowed: false,
            remaining: 0,
            resetAt
        }
    }

    // Add current request
    await redis.zadd(rateLimitKey, now, `${now}-${Math.random()}`)
    await redis.expire(rateLimitKey, windowSeconds)

    return {
        allowed: true,
        remaining: limit - currentCount - 1,
        resetAt: now + windowSeconds * 1000
    }
}
export const closeRedisConnection = async () => {
    try {
        await redis.quit()
        logger.info('Redis connection closed successfully.')
    } catch (error) {
        logger.error('Error closing Redis connection:', error)
    }
}

export default redis
