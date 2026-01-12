import { boolean, index, integer, pgTable, serial, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { projects } from './project'
export const apiKeys = pgTable(
    'api_keys',
    {
        id: serial('id').primaryKey(),
        projectId: integer('project_id')
            .notNull()
            .references(() => projects.id, { onDelete: 'cascade' }),
        keyName: varchar('key_name', { length: 255 }).notNull(),
        keyHash: varchar('key_hash', { length: 64 }).notNull().unique(), // SHA-256 hash
        keyPrefix: varchar('key_prefix', { length: 20 }).notNull(), // First 8 chars for identification
        isActive: boolean('is_active').notNull().default(true),
        lastUsedAt: timestamp('last_used_at'),
        expiresAt: timestamp('expires_at'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow()
    },
    (apiKey) => [
        uniqueIndex('api_keys_key_hash_idx').on(apiKey.keyHash),
        index('api_keys_project_id_idx').on(apiKey.projectId),
        index('api_keys_key_prefix_idx').on(apiKey.keyPrefix)
    ]
)
