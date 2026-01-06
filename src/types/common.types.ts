import { Request, Response, NextFunction } from 'express'

// ==================== ENUMS ====================
export enum EmailStatus {
    QUEUED = 'queued',
    PROCESSING = 'processing',
    SENT = 'sent',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    DELIVERED = 'delivered',
    OPENED = 'opened',
    CLICKED = 'clicked',
    BOUNCED = 'bounced'
}

export enum EmailPriority {
    LOWEST = 1,
    LOW = 3,
    NORMAL = 5,
    HIGH = 7,
    HIGHEST = 10
}

export enum Environment {
    DEVELOPMENT = 'dev',
    STAGING = 'staging',
    PRODUCTION = 'production'
}

export enum EmailProvider {
    RESEND = 'resend',
    SENDGRID = 'sendgrid',
    AWS_SES = 'ses',
    BREVO = 'brevo'
}

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

// ==================== PAGINATION ====================
export interface PaginationParams {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    }
}

// ==================== COMMON TYPES ====================
export interface Timestamps {
    createdAt: Date
    updatedAt: Date
}

export type TAsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>
