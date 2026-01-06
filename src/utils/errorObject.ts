import { Request } from 'express'
import { EApplicationEnvironment, THttpError } from '../types/common.types'
import responseMessage from '../constants/responseMessage'
import config from '../configs/config'
import logger from './logger'
import { AppError } from './appError'

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (err: Error | unknown, req: Request, errorStatusCode: number = 500): THttpError => {
    const errorObj: THttpError = {
        success: false,
        statusCode: errorStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl
        },
        message: err instanceof Error ? err.message || responseMessage.SOMETHING_WENT_WRONG : responseMessage.SOMETHING_WENT_WRONG,
        data: null,
        errorCode: err instanceof AppError ? err.errorCode : undefined,
        trace: err instanceof Error ? { error: err.stack } : null
    }
    // Log the complete error object
    try {
        logger.error(`CONTROLLER_ERROR`, {
            meta: JSON.parse(JSON.stringify(errorObj)) as THttpError
        })
    } catch {
        logger.error(`CONTROLLER_ERROR`, {
            meta: {
                message: errorObj.message,
                statusCode: errorObj.statusCode,
                errorCode: errorObj.errorCode
            }
        })
    }

    if (config.ENV === EApplicationEnvironment.PRODUCTION) {
        delete errorObj.request.ip
        delete errorObj.trace
    }

    return errorObj
}
