import { NextFunction, Request, Response } from 'express'
import httpError from '../utils/httpError'
import { verifyAccessToken } from '../utils/jwt'
import userService from '../services/userService'
import { User } from '../types/user.types'
import { AppError } from '../utils/appError'

interface IAuthenticatedRequest extends Request {
    authenticatedUser?: User
    cookies: {
        accessToken?: string
        [key: string]: string | undefined
    }
}
export default {
    authenticate: async (reqest: Request, _res: Response, next: NextFunction) => {
        try {
            const req = reqest as IAuthenticatedRequest
            const cookieToken = req.cookies?.accessToken
            const headerToken = req.headers.authorization?.split(' ')[1]
            const accessToken: string | undefined =
                (typeof cookieToken === 'string' ? cookieToken : undefined) || (typeof headerToken === 'string' ? headerToken : undefined)

            if (accessToken) {
                const { userId } = verifyAccessToken(accessToken)
                if (userId) {
                    const user = await userService.getUserById(userId)
                    if (user) {
                        req.authenticatedUser = user
                        return next()
                    }
                }
            }

            return httpError(next, new AppError('You are not authorized to perform this action', 401, 'UNAUTHORIZED'), req, 401)
        } catch (error) {
            httpError(next, error, reqest, 500)
        }
    },
    authorize: (roles: string[]) => (reqest: Request, _res: Response, next: NextFunction) => {
        const req = reqest as IAuthenticatedRequest
        if (!req.authenticatedUser) {
            return httpError(next, new AppError('Forbidden', 403, 'FORBIDDEN'), req, 403)
        }
        try {
            const { role } = req.authenticatedUser
            if (roles.includes(role)) {
                next()
            } else {
                return httpError(next, new AppError('Forbidden', 403, 'FORBIDDEN'), req, 403)
            }
        } catch (error) {
            httpError(next, error, req, 500)
        }
    }
}
