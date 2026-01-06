import { NextFunction, Request, Response } from 'express'
import { TAsyncHandler } from '../types/common.types'
import httpError from './httpError'
import { AppError } from './appError'

export function asyncHandler(fn: TAsyncHandler) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next)
        } catch (err) {
            // Check if headers already sent to prevent crash
            if (res.headersSent) {
                return next(err)
            }

            if (err instanceof AppError) {
                return httpError(next, err, req, err.statusCode)
            }
            return httpError(next, err, req, 500)
        }
    }
}
