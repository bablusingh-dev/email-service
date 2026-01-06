import { EmailProvider, EApplicationEnvironment, Timestamps } from './common.types'

// ==================== PROJECT TYPES ====================
export interface Project extends Timestamps {
    id: number
    name: string
    description: string | null
    provider: EmailProvider
    providerApiKeyEncrypted: string
    defaultFromEmail: string
    defaultFromName: string | null
    replyToEmail: string | null
    domain: string | null
    webhookUrl: string | null
    rateLimitPerMinute: number
    isActive: boolean
    environment: EApplicationEnvironment
}

export interface CreateProjectDto {
    name: string
    description?: string
    provider: EmailProvider
    providerApiKey: string // Plain text, will be encrypted
    defaultFromEmail: string
    defaultFromName?: string
    replyToEmail?: string
    domain?: string
    webhookUrl?: string
    rateLimitPerMinute?: number
    environment?: EApplicationEnvironment
}

export interface UpdateProjectDto {
    name?: string
    description?: string
    provider?: EmailProvider
    providerApiKey?: string // Plain text, will be encrypted
    defaultFromEmail?: string
    defaultFromName?: string
    replyToEmail?: string
    domain?: string
    webhookUrl?: string
    rateLimitPerMinute?: number
    isActive?: boolean
    environment?: EApplicationEnvironment
}

export interface ProjectWithDecryptedKey extends Omit<Project, 'providerApiKeyEncrypted'> {
    providerApiKey: string // Decrypted
}

export interface ProjectStats {
    totalQueued: number
    totalProcessing: number
    totalSent: number
    totalFailed: number
    totalCancelled: number
    last24Hours: {
        sent: number
        failed: number
    }
}
