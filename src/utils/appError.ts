export class AppError extends Error {
    statusCode: number
    errorCode?: string

    constructor(message: string, statusCode = 400, errorCode?: string) {
        super(message)
        this.statusCode = statusCode
        this.errorCode = errorCode
        this.name = 'AppError'

        Error.captureStackTrace(this, this.constructor)
    }
}

