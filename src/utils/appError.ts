export class AppError extends Error {
    statusCode: number
    errorCode?: string
    details?: unknown

    constructor(message: string, statusCode = 400, errorCode?: string, details?: unknown) {
        super(message)
        this.statusCode = statusCode
        this.errorCode = errorCode
        this.name = 'AppError'
        this.details = details

        Error.captureStackTrace(this, this.constructor)
    }
}
