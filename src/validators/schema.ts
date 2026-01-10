import Joi from 'joi'
import { EApplicationEnvironment, EmailProvider } from '../types/common.types'
import { CreateProjectDto, UpdateProjectDto } from '../types/project.types'

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
