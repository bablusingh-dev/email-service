import { Request, Response, NextFunction } from 'express'

export type THttpResponse = {
    success: boolean
    statusCode: number
    request: {
        ip?: string | null
        method: string
        url: string
    }
    message: string
    data: unknown
}

export type THttpError = {
    success: boolean
    statusCode: number
    request: {
        ip?: string | null
        method: string
        url: string
    }
    message: string
    data: unknown
    errorCode?: string
    trace?: object | null
}

export type TAsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

