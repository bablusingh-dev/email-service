import { NextFunction, Request, Response } from 'express'
import httpResponse from '../utils/httpResponse'
import responseMessage from '../constants/responseMessage'
import quicker from '../utils/quicker'
import { asyncHandler } from '../utils/asyncHandler'

export default {
    // eslint-disable-next-line @typescript-eslint/require-await
    self: asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        return httpResponse(req, res, 200, responseMessage.SUCCESS)
    }),
    // eslint-disable-next-line @typescript-eslint/require-await
    health: asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const healthData = {
            application: quicker.getApplicationHealth(),
            system: quicker.getSystemHealth(),
            timestamp: Date.now()
        }

        return httpResponse(req, res, 200, responseMessage.SUCCESS, healthData)
    })
}

