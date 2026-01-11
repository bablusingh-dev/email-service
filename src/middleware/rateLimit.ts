import { NextFunction, Request, Response } from 'express'
import config from '../configs/config'
import { checkRateLimit } from '../configs/redis'
import logger from '../utils/logger'
import httpError from '../utils/httpError'
import { AppError } from '../utils/appError'
const GLOBAL_RATE_LIMIT = parseInt(config.GLOBAL_RATE_LIMIT || '100')

/**
 * Global rate limiting middleware
 */
export async function globalRateLimit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const ip = req.ip || req.socket.remoteAddress || 'unknown'
        const key = `global:${ip}`

        const result = await checkRateLimit(key, GLOBAL_RATE_LIMIT, 60)

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', GLOBAL_RATE_LIMIT.toString())
        res.setHeader('X-RateLimit-Remaining', result.remaining.toString())
        res.setHeader('X-RateLimit-Reset', new Date(result.resetAt).toISOString())

        if (!result.allowed) {
            return httpError(
                next,
                new AppError('Too many requests. Please try again later.', 429, 'RATE_LIMIT_EXCEEDED', {
                    limit: GLOBAL_RATE_LIMIT,
                    resetAt: new Date(result.resetAt).toISOString()
                }),
                req,
                429
            )
        }

        next()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        logger.error(`Rate limiting error: ${error}`)
        next()
    }
}
