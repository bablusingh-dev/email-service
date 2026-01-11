import { count, desc, eq } from 'drizzle-orm'
import { db } from '../../../database/db'
import { CreateProjectDto, Project, UpdateProjectDto } from '../../../types/project.types'
import { IProjectRepository } from '../../interfaces/IProjectRepository'
import { projects } from '../../../database/schema'
import { PaginationParams, PaginatedResponse, EApplicationEnvironment } from '../../../types/common.types'

export class DrizzleProjectRepository implements IProjectRepository {
    async findById(id: number): Promise<Project | null> {
        const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1)
        return result[0] || null
    }
    async findAll(params?: PaginationParams): Promise<PaginatedResponse<Project>> {
        const page = params?.page || 1
        const limit = params?.limit || 10
        const offset = (page - 1) * limit

        const [data, totalResult] = await Promise.all([
            db.select().from(projects).limit(limit).offset(offset).orderBy(desc(projects.createdAt)),
            db.select({ count: count() }).from(projects)
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
    async create(data: CreateProjectDto): Promise<Project> {
        const [result] = await db
            .insert(projects)
            .values({
                name: data.name,
                description: data.description || null,
                provider: data.provider,
                providerApiKeyEncrypted: data.providerApiKey,
                defaultFromEmail: data.defaultFromEmail,
                defaultFromName: data.defaultFromName || null,
                replyToEmail: data.replyToEmail || null,
                domain: data.domain || null,
                webhookUrl: data.webhookUrl || null,
                rateLimitPerMinute: data.rateLimitPerMinute || 10,
                environment: data.environment || EApplicationEnvironment.DEVELOPMENT,
                updatedAt: new Date()
            })
            .returning()
        return result
    }
    async update(id: number, data: UpdateProjectDto): Promise<Project | null> {
        const updateData: Record<string, unknown> = {
            updatedAt: new Date()
        }
        if (data.name) updateData.name = data.name
        if (data.description) updateData.description = data.description
        if (data.provider) updateData.provider = data.provider
        if (data.providerApiKey) updateData.providerApiKeyEncrypted = data.providerApiKey
        if (data.defaultFromEmail) updateData.defaultFromEmail = data.defaultFromEmail
        if (data.defaultFromName) updateData.defaultFromName = data.defaultFromName
        if (data.replyToEmail) updateData.replyToEmail = data.replyToEmail
        if (data.domain) updateData.domain = data.domain
        if (data.webhookUrl) updateData.webhookUrl = data.webhookUrl
        if (data.rateLimitPerMinute) updateData.rateLimitPerMinute = data.rateLimitPerMinute
        if (data.environment) updateData.environment = data.environment

        const [result] = await db.update(projects).set(updateData).where(eq(projects.id, id)).returning()
        return result || null
    }
    async delete(id: number): Promise<boolean> {
        const result = await db.delete(projects).where(eq(projects.id, id)).returning()
        return result.length > 0
    }
    async count(): Promise<number> {
        const result = await db.select({ count: count() }).from(projects)
        return result[0]?.count || 0
    }
    async findByName(name: string): Promise<Project | null> {
        const result = await db.select().from(projects).where(eq(projects.name, name)).limit(1)
        return result[0] || null
    }
    async findByEnvironment(environment: EApplicationEnvironment): Promise<Project[]> {
        const result = await db.select().from(projects).where(eq(projects.environment, environment))
        return result
    }
    async findActive(): Promise<Project[]> {
        const result = await db.select().from(projects).where(eq(projects.isActive, true))
        return result
    }
    //TODO: implement
    // getProjectStats(projectId: number): ProjectStats | null {

    //     return null
    // }
    async toggleActive(projectId: number): Promise<Project | null> {
        const project = await this.findById(projectId)
        if (!project) return null
        const isActive = !project.isActive
        const [result] = await db.update(projects).set({ isActive }).where(eq(projects.id, projectId)).returning()
        return result || null
    }
}
