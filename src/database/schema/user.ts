import { pgTable, varchar, serial, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { UserRole } from '../../types/common.types'

export const users = pgTable(
    'users',
    {
        id: serial('id').primaryKey(),
        email: varchar('email', { length: 255 }).notNull().unique(),
        passwordHash: varchar('password_hash', { length: 255 }).notNull(),
        name: varchar('name', { length: 255 }).notNull(),
        role: varchar('role', { length: 20 }).notNull().default('ADMIN').$type<UserRole>(),
        resetToken: varchar('reset_token', { length: 255 }),
        resetTokenExpiry: timestamp('reset_token_expiry'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow()
    },
    (user) => [uniqueIndex('users_email_idx').on(user.email)]
)
