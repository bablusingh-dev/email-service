import { and, count, desc, eq } from 'drizzle-orm'
import { db } from '../../../database/db'
import { apiKeys } from '../../../database/schema'
import { ApiKey, CreateApiKeyDto, UpdateApiKeyDto } from '../../../types/project.types'
import { IApiKeyRepository } from '../../interfaces/IApiKeyRepository'
import { PaginatedResponse, PaginationParams } from '../../../types/common.types'

export class DrizzleApiKeyRepository implements IApiKeyRepository {
    async findById(id: number): Promise<ApiKey | null> {
        const result = await db.select().from(apiKeys).where(eq(apiKeys.id, id)).limit(1)
        return result[0] || null
    }

    /**
     * Find all records with optional pagination
     */
    async findAll(params?: PaginationParams): Promise<PaginatedResponse<ApiKey>> {
        const page = params?.page || 1
        const limit = params?.limit || 10
        const offset = (page - 1) * limit

        const [data, totalResult] = await Promise.all([
            db.select().from(apiKeys).limit(limit).offset(offset).orderBy(desc(apiKeys.createdAt)),
            db.select({ count: count() }).from(apiKeys)
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

    /**
     * Create a new record
     */
    async create(data: CreateApiKeyDto): Promise<ApiKey> {
        const [result] = await db
            .insert(apiKeys)
            .values({
                projectId: data.projectId,
                keyName: data.keyName,
                keyHash: '', // Will be set by service
                keyPrefix: '', // Will be set by service
                expiresAt: data.expiresAt || null
            })
            .returning()
        return result
    }

    /**
     * Update an existing record
     */
    async update(id: number, data: UpdateApiKeyDto): Promise<ApiKey | null> {
        const updateData: Record<string, unknown> = {
            updatedAt: new Date()
        }
        if (data.keyName !== undefined) updateData.keyName = data.keyName
        if (data.isActive !== undefined) updateData.isActive = data.isActive
        if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt
        if (Object.keys(updateData).length === 0) {
            return this.findById(id)
        }
        const [result] = await db.update(apiKeys).set(updateData).where(eq(apiKeys.id, id)).returning()
        return result || null
    }

    /**
     * Delete a record by ID
     */
    async delete(id: number): Promise<boolean> {
        const result = await db.delete(apiKeys).where(eq(apiKeys.id, id)).returning()
        return result.length > 0
    }

    /**
     * Count total records
     */
    async count(): Promise<number> {
        const result = await db.select({ count: count() }).from(apiKeys)
        return result[0]?.count || 0
    }
    async findByHash(keyHash: string): Promise<ApiKey | null> {
        const result = await db.select().from(apiKeys).where(eq(apiKeys.keyHash, keyHash)).limit(1)
        return result[0] || null
    }

    /**
     * Find all API keys for a project
     */
    async findByProjectId(projectId: number): Promise<ApiKey[]> {
        const result = await db.select().from(apiKeys).where(eq(apiKeys.projectId, projectId))
        return result
    }

    /**
     * Find an API key by its prefix
     */
    async findByPrefix(keyPrefix: string): Promise<ApiKey[]> {
        const result = await db.select().from(apiKeys).where(eq(apiKeys.keyPrefix, keyPrefix))
        return result
    }

    /**
     * Update the last used timestamp for an API key
     */
    async updateLastUsed(id: number): Promise<void> {
        await db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, id))
    }

    /**
     * Revoke an API key (set isActive to false)
     */
    async revoke(id: number): Promise<ApiKey | null> {
        const [result] = await db.update(apiKeys).set({ isActive: false }).where(eq(apiKeys.id, id)).returning()
        return result || null
    }

    /**
     * Find all active API keys for a project
     */
    async findActiveByProjectId(projectId: number): Promise<ApiKey[]> {
        const result = await db
            .select()
            .from(apiKeys)
            .where(and(eq(apiKeys.projectId, projectId), eq(apiKeys.isActive, true)))
            .orderBy(desc(apiKeys.createdAt))
        return result
    }

    /**
     * Delete all API keys for a project
     */
    async deleteByProjectId(projectId: number): Promise<number> {
        const result = await db.delete(apiKeys).where(eq(apiKeys.projectId, projectId))
        return result.length
    }
    /**
     * Update hash and prefix for an API key (internal use)
     */
    async updateHashAndPrefix(id: number, keyHash: string, keyPrefix: string): Promise<void> {
        await db.update(apiKeys).set({ keyHash, keyPrefix }).where(eq(apiKeys.id, id))
    }
}
