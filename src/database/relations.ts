import { relations } from 'drizzle-orm'
import { apiKeys, projects } from './schema'

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
    project: one(projects, {
        fields: [apiKeys.projectId],
        references: [projects.id]
    })
}))
