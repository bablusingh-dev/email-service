import { NextFunction, Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { loginSchema } from '../validators/schema'
import userService from '../services/userService'
import httpResponse from '../utils/httpResponse'
import quicker from '../utils/quicker'
import config from '../configs/config'

export default {
    login: asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const value = await loginSchema.validateAsync(req.body)
        const result = await userService.login(value)
        const DOMAIN = quicker.getDomainFromUrl(config.SERVER_URL!)
        res.cookie('accessToken', result.accessToken, {
            path: '/api/v1',
            domain: DOMAIN,
            sameSite: 'none',
            maxAge: 1000 * parseInt(config.JWT_EXPIRY),
            httpOnly: true,
            secure: true
        }).cookie('refreshToken', result.refreshToken, {
            path: '/api/v1',
            domain: DOMAIN,
            sameSite: 'none',
            maxAge: 1000 * parseInt(config.JWT_REFRESH_EXPIRY),
            httpOnly: true,
            secure: true
        })
        return httpResponse(req, res, 200, result.message, {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        })
    })
}

