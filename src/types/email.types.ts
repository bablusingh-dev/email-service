import { EmailStatus, EmailPriority, Timestamps } from './common.types.js'

// ==================== EMAIL QUEUE TYPES ====================
export interface EmailQueue extends Timestamps {
    id: number
    emailId: string // UUID
    projectId: number
    status: EmailStatus
    priority: EmailPriority

    // Recipients
    toEmail: string
    toName: string | null
    ccEmails: string[] | null
    bccEmails: string[] | null

    // Sender
    fromEmail: string | null
    fromName: string | null
    replyTo: string | null

    // Content
    subject: string
    htmlBody: string | null
    textBody: string | null

    // Template
    templateId: number | null
    templateVariables: Record<string, unknown> | null

    // Attachments and headers
    attachments: EmailAttachment[] | null
    customHeaders: Record<string, string> | null

    // Scheduling and retry
    scheduledAt: Date | null
    attempts: number
    maxAttempts: number
    lastAttemptAt: Date | null
    errorMessage: string | null

    // Provider
    providerMessageId: string | null
}

export interface EmailAttachment {
    filename: string
    content: string // Base64 encoded
    contentType: string
}

export interface SendEmailDto {
    toEmail: string
    toName?: string
    ccEmails?: string[]
    bccEmails?: string[]
    fromEmail?: string
    fromName?: string
    replyTo?: string
    subject: string
    htmlBody?: string
    textBody?: string
    templateId?: number
    templateVariables?: Record<string, unknown>
    attachments?: EmailAttachment[]
    customHeaders?: Record<string, string>
    scheduledAt?: Date
    priority?: EmailPriority
    maxAttempts?: number
}

export interface SendBulkEmailDto {
    emails: SendEmailDto[]
}

export interface EmailStatusResponse {
    emailId: string
    status: EmailStatus
    attempts: number
    lastAttemptAt: Date | null
    errorMessage: string | null
    providerMessageId: string | null
    createdAt: Date
    updatedAt: Date
}

// ==================== EMAIL HISTORY TYPES ====================
export interface EmailHistory extends Timestamps {
    id: number
    emailId: string // UUID
    projectId: number
    status: EmailStatus
    toEmail: string
    subject: string
    provider: string
    providerMessageId: string | null

    // Tracking
    sentAt: Date | null
    deliveredAt: Date | null
    openedAt: Date | null
    clickedAt: Date | null
    bouncedAt: Date | null

    errorMessage: string | null
    metadata: Record<string, unknown> | null
}

export interface EmailHistoryFilter {
    status?: EmailStatus
    startDate?: Date
    endDate?: Date
    toEmail?: string
}

// ==================== EMAIL TEMPLATE TYPES ====================
export interface EmailTemplate extends Timestamps {
    id: number
    projectId: number
    name: string
    subject: string
    htmlBody: string
    textBody: string | null
    variables: string[] | null
    isActive: boolean
    version: number
}

export interface CreateTemplateDto {
    projectId: number
    name: string
    subject: string
    htmlBody: string
    textBody?: string
    variables?: string[]
}

export interface UpdateTemplateDto {
    name?: string
    subject?: string
    htmlBody?: string
    textBody?: string
    variables?: string[]
    isActive?: boolean
}

// ==================== WEBHOOK TYPES ====================
export interface WebhookLog extends Timestamps {
    id: number
    emailId: string
    projectId: number
    webhookUrl: string
    payload: Record<string, unknown>
    responseStatus: number | null
    responseBody: string | null
    attempts: number
    sentAt: Date | null
}

export interface WebhookPayload {
    event: 'email.sent' | 'email.delivered' | 'email.failed' | 'email.bounced' | 'email.opened' | 'email.clicked'
    emailId: string
    projectId: number
    timestamp: string
    data: {
        toEmail: string
        subject: string
        status: EmailStatus
        providerMessageId?: string
        errorMessage?: string
    }
}
