import { serial, uuid, integer, varchar, jsonb, text, timestamp, pgTable, uniqueIndex, index, boolean } from 'drizzle-orm/pg-core'
import { projects } from './project'

export const emailQueue = pgTable(
    'email_queue',
    {
        id: serial('id').primaryKey(),
        emailId: uuid('email_id').notNull().unique().defaultRandom(),
        projectId: integer('project_id')
            .notNull()
            .references(() => projects.id, { onDelete: 'cascade' }),
        status: varchar('status', { length: 20 }).notNull().default('queued'), // queued, processing, sent, failed, cancelled
        priority: integer('priority').notNull().default(5), // 1-10, higher = sent first

        // Recipients
        toEmail: varchar('to_email', { length: 255 }).notNull(),
        toName: varchar('to_name', { length: 255 }),
        ccEmails: jsonb('cc_emails').$type<string[]>(),
        bccEmails: jsonb('bcc_emails').$type<string[]>(),

        // Sender
        fromEmail: varchar('from_email', { length: 255 }),
        fromName: varchar('from_name', { length: 255 }),
        replyTo: varchar('reply_to', { length: 255 }),

        // Content
        subject: varchar('subject', { length: 500 }).notNull(),
        htmlBody: text('html_body'),
        textBody: text('text_body'),

        // Template support
        templateId: integer('template_id'),
        templateVariables: jsonb('template_variables'),

        // Attachments and headers
        attachments: jsonb('attachments').$type<Array<{ filename: string; content: string; contentType: string }>>(),
        customHeaders: jsonb('custom_headers').$type<Record<string, string>>(),

        // Scheduling and retry
        scheduledAt: timestamp('scheduled_at'),
        attempts: integer('attempts').notNull().default(0),
        maxAttempts: integer('max_attempts').notNull().default(3),
        lastAttemptAt: timestamp('last_attempt_at'),
        errorMessage: text('error_message'),

        // Provider tracking
        providerMessageId: varchar('provider_message_id', { length: 255 }),

        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow()
    },
    (emailQueue) => [
        uniqueIndex('email_queue_email_id_idx').on(emailQueue.emailId),
        index('email_queue_status_idx').on(emailQueue.status),
        index('email_queue_project_id_idx').on(emailQueue.projectId),
        index('email_queue_scheduled_at_idx').on(emailQueue.scheduledAt),
        index('email_queue_priority_idx').on(emailQueue.priority),
        index('email_queue_created_at_idx').on(emailQueue.createdAt),
        index('email_queue_status_project_idx').on(emailQueue.status, emailQueue.projectId)
    ]
)

// ==================== EMAIL TEMPLATES TABLE ====================
export const emailTemplates = pgTable(
    'email_templates',
    {
        id: serial('id').primaryKey(),
        projectId: integer('project_id')
            .notNull()
            .references(() => projects.id, { onDelete: 'cascade' }),
        name: varchar('name', { length: 255 }).notNull(),
        subject: varchar('subject', { length: 500 }).notNull(),
        htmlBody: text('html_body').notNull(),
        textBody: text('text_body'),
        variables: jsonb('variables').$type<string[]>(), // List of variable names used in template
        isActive: boolean('is_active').notNull().default(true),
        version: integer('version').notNull().default(1),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow()
    },
    (emailTemplates) => [
        index('email_templates_project_id_idx').on(emailTemplates.projectId),
        index('email_templates_name_idx').on(emailTemplates.name)
    ]
)
