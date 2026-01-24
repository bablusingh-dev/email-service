import Joi from 'joi'
import { EApplicationEnvironment, EmailProvider } from '../types/common.types'
import { CreateApiKeyDto, CreateProjectDto, UpdateApiKeyDto, UpdateProjectDto } from '../types/project.types'
import { CreateUserDto, LoginDto, ResetPasswordDto } from '../types/user.types'

export const createProjectSchema = Joi.object<CreateProjectDto>({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(1000).optional(),
    provider: Joi.string()
        .valid(...Object.values(EmailProvider))
        .required(),
    providerApiKey: Joi.string().required(),
    defaultFromEmail: Joi.string().email().required(),
    defaultFromName: Joi.string().max(255).optional(),
    replyToEmail: Joi.string().email().optional(),
    domain: Joi.string().max(255).optional(),
    webhookUrl: Joi.string().uri().optional(),
    rateLimitPerMinute: Joi.number().integer().min(1).max(1000).optional(),
    environment: Joi.string()
        .valid(...Object.values(EApplicationEnvironment))
        .optional()
})

export const updateProjectSchema = Joi.object<UpdateProjectDto>({
    name: Joi.string().min(3).max(255).optional(),
    description: Joi.string().max(1000).optional(),
    provider: Joi.string()
        .valid(...Object.values(EmailProvider))
        .optional(),
    providerApiKey: Joi.string().optional(),
    defaultFromEmail: Joi.string().email().optional(),
    defaultFromName: Joi.string().max(255).optional(),
    replyToEmail: Joi.string().email().optional(),
    domain: Joi.string().max(255).optional(),
    webhookUrl: Joi.string().uri().optional(),
    rateLimitPerMinute: Joi.number().integer().min(1).max(1000).optional(),
    environment: Joi.string()
        .valid(...Object.values(EApplicationEnvironment))
        .optional()
}).min(1)

// ==================== API KEY SCHEMAS ====================

export const createApiKeySchema = Joi.object<CreateApiKeyDto>({
    keyName: Joi.string().min(3).max(255).required(),
    expiresAt: Joi.date().greater('now').optional()
}).required()

export const updateApiKeySchema = Joi.object<UpdateApiKeyDto>({
    keyName: Joi.string().min(3).max(255).optional(),
    isActive: Joi.boolean().optional(),
    expiresAt: Joi.date().greater('now').optional()
}).min(1)

// ==================== USER SCHEMAS ====================

export const createUserSchema = Joi.object<CreateUserDto>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    name: Joi.string().min(2).max(255).required()
})

export const loginSchema = Joi.object<LoginDto>({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const resetPasswordSchema = Joi.object<ResetPasswordDto>({
    email: Joi.string().email().required(),
    resetToken: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128).required()
})

// ==================== EMAIL SCHEMAS ====================

export const sendEmailSchema = Joi.object({
    toEmail: Joi.string().email().required(),
    toName: Joi.string().max(255).optional(),
    ccEmails: Joi.array().items(Joi.string().email()).max(10).optional(),
    bccEmails: Joi.array().items(Joi.string().email()).max(10).optional(),
    fromEmail: Joi.string().email().optional(),
    fromName: Joi.string().max(255).optional(),
    replyTo: Joi.string().email().optional(),
    subject: Joi.string().min(1).max(500).required(),
    htmlBody: Joi.string().optional(),
    textBody: Joi.string().optional(),
    templateId: Joi.number().integer().optional(),
    templateVariables: Joi.object().optional(),
    attachments: Joi.array()
        .items(
            Joi.object({
                filename: Joi.string().required(),
                content: Joi.string().required(), // Base64
                contentType: Joi.string().optional()
            })
        )
        .max(5)
        .optional(),
    customHeaders: Joi.object().optional(),
    scheduledAt: Joi.date().greater('now').optional(),
    priority: Joi.number().integer().min(1).max(10).optional(),
    maxAttempts: Joi.number().integer().min(1).max(10).optional()
})

export const sendBulkEmailSchema = Joi.object({
    emails: Joi.array().items(sendEmailSchema).min(1).max(100).required()
})

// ==================== QUERY SCHEMAS ====================

export const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional()
})

export const emailHistoryFilterSchema = Joi.object({
    status: Joi.string().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    toEmail: Joi.string().email().optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional()
})
