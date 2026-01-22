import { relations } from 'drizzle-orm'
import { apiKeys, emailHistory, emailQueue, emailTemplates, projects, webhookLogs } from './schema'

export const projectsRelations = relations(projects, ({ many }) => ({
    apiKeys: many(apiKeys),
    emailQueue: many(emailQueue),
    emailHistory: many(emailHistory),
    emailTemplates: many(emailTemplates),
    webhookLogs: many(webhookLogs)
}))

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
    project: one(projects, {
        fields: [apiKeys.projectId],
        references: [projects.id]
    })
}))

export const emailQueueRelations = relations(emailQueue, ({ one }) => ({
    project: one(projects, {
        fields: [emailQueue.projectId],
        references: [projects.id]
    })
}))

export const emailHistoryRelations = relations(emailHistory, ({ one }) => ({
    project: one(projects, {
        fields: [emailHistory.projectId],
        references: [projects.id]
    })
}))

export const emailTemplatesRelations = relations(emailTemplates, ({ one }) => ({
    project: one(projects, {
        fields: [emailTemplates.projectId],
        references: [projects.id]
    })
}))

export const webhookLogsRelations = relations(webhookLogs, ({ one }) => ({
    project: one(projects, {
        fields: [webhookLogs.projectId],
        references: [projects.id]
    })
}))
