import { NextFunction, Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { loginSchema } from '../validators/schema'
import userService from '../services/userService'
import httpResponse from '../utils/httpResponse'

export default {
    login: asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const value = await loginSchema.validateAsync(req.body)
        const result = await userService.login(value)
        return httpResponse(req, res, 200, result.message, {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        })
    })
}

