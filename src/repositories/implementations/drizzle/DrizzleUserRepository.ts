import { count, desc, eq } from 'drizzle-orm'
import { db } from '../../../database/db'
import { User, CreateUserDto } from '../../../types/user.types'
import { IUserRepository } from '../../interfaces/IUserRepository'
import { users } from '../../../database/schema'
import { PaginationParams, PaginatedResponse } from '../../../types/common.types'

export class DrizzleUserRepository implements IUserRepository {
    async findById(id: number): Promise<User | null> {
        const result = await db.select().from(users).where(eq(users.id, id)).limit(1)
        return result[0] || null
    }

    async findAll(params?: PaginationParams): Promise<PaginatedResponse<User>> {
        const page = params?.page || 1
        const limit = params?.limit || 10
        const offset = (page - 1) * limit

        const [data, totalResult] = await Promise.all([
            db.select().from(users).limit(limit).offset(offset).orderBy(desc(users.createdAt)),
            db.select({ count: count() }).from(users)
        ])

        const total = totalResult[0]?.count || 0
        const totalPages = Math.ceil(total / limit)
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        }
    }

    async create(data: CreateUserDto): Promise<User> {
        const [result] = await db
            .insert(users)
            .values({
                email: data.email,
                passwordHash: data.password,
                name: data.name
            })
            .returning()
        return result
    }

    async update(id: number, data: Partial<User>): Promise<User | null> {
        const [result] = await db
            .update(users)
            .set({
                ...data,
                updatedAt: new Date()
            })
            .where(eq(users.id, id))
            .returning()
        return result || null
    }

    async delete(id: number): Promise<boolean> {
        const result = await db.delete(users).where(eq(users.id, id)).returning()
        return result.length ? result.length > 0 : false
    }

    async count(): Promise<number> {
        const result = await db.select({ count: count() }).from(users)
        return result[0]?.count || 0
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await db.select().from(users).where(eq(users.email, email)).limit(1)
        return result[0] || null
    }

    async findByResetToken(resetToken: string): Promise<User | null> {
        const result = await db.select().from(users).where(eq(users.resetToken, resetToken)).limit(1)
        return result[0] || null
    }

    async updatePasswordHash(id: number, passwordHash: string): Promise<User | null> {
        const [result] = await db
            .update(users)
            .set({
                passwordHash,
                updatedAt: new Date()
            })
            .where(eq(users.id, id))
            .returning()
        return result || null
    }

    async setResetToken(id: number, resetToken: string, expiry: Date): Promise<User | null> {
        const [result] = await db
            .update(users)
            .set({
                resetToken,
                resetTokenExpiry: expiry,
                updatedAt: new Date()
            })
            .where(eq(users.id, id))
            .returning()
        return result || null
    }

    async clearResetToken(id: number): Promise<User | null> {
        const [result] = await db
            .update(users)
            .set({
                resetToken: null,
                resetTokenExpiry: null,
                updatedAt: new Date()
            })
            .where(eq(users.id, id))
            .returning()
        return result || null
    }
}

