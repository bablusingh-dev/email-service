import { integer, pgTable, varchar, boolean, serial, text, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core'
import { EApplicationEnvironment, EmailProvider } from '../../types/common.types'

export const projects = pgTable(
    'projects',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 255 }).notNull().unique(),
        description: text('description'),
        provider: varchar('provider', { length: 50 }).notNull().default('resend').$type<EmailProvider>(),
        providerApiKeyEncrypted: text('provider_api_key_encrypted').notNull(),
        defaultFromEmail: varchar('default_from_email', { length: 255 }).notNull(),
        defaultFromName: varchar('default_from_name', { length: 255 }),
        replyToEmail: varchar('reply_to_email', { length: 255 }),
        domain: varchar('domain', { length: 255 }),
        webhookUrl: text('webhook_url'),
        rateLimitPerMinute: integer('rate_limit_per_minute').notNull().default(10),
        isActive: boolean('is_active').notNull().default(true),
        environment: varchar('environment', { length: 20 }).notNull().default('production').$type<EApplicationEnvironment>(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow()
    },
    (project) => [uniqueIndex('projects_name_idx').on(project.name), index('projects_environment_idx').on(project.environment)]
)
