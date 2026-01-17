import config from '../configs/config'
import { cacheApiKey, getCachedApiKey, invalidateApiKeyCache } from '../configs/redis'
import RepositoryFactory from '../repositories/RepositoryFactory'
import { ApiKey, ApiKeyWithPlainText, CreateApiKeyDto, ValidatedApiKey } from '../types/project.types'
import { AppError } from '../utils/appError'
import { extractKeyPrefix, generateApiKey, hash } from '../utils/encryption'

const API_KEY_CACHE_TTL = parseInt(config.API_KEY_CACHE_TTL) || 300

class ApiKeyService {
    private apiKeyRepository = RepositoryFactory.getApiKeyRepository()
    private projectRepository = RepositoryFactory.getProjectRepository()
    async generateApiKey(data: CreateApiKeyDto): Promise<ApiKeyWithPlainText> {
        const project = await this.projectRepository.findById(data.projectId)
        if (!project) {
            throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND')
        }
        const plainTextKey = generateApiKey()
        const hashKey = hash(plainTextKey)
        const keyPrefix = extractKeyPrefix(plainTextKey)

        // Creeate API key
        const apiKey = await this.apiKeyRepository.create({ ...data })

        // Update API key hash and prefix
        await this.updateKeyHashAndPrefix(apiKey.id, hashKey, keyPrefix)
        const finalKey = await this.apiKeyRepository.findById(apiKey.id)

        return {
            ...finalKey!,
            plainTextKey
        }
    }
    async getApiKeyById(apiKeyId: number) {
        const apiKey = await this.apiKeyRepository.findById(apiKeyId)
        if (!apiKey) {
            throw new AppError('API Key not found', 404, 'API_KEY_NOT_FOUND')
        }
        return apiKey
    }
    async getApiKeyByProjectId(projectId: number) {
        const apiKey = await this.apiKeyRepository.findByProjectId(projectId)
        return apiKey
    }

    async updateApiKey(id: number, data: Partial<CreateApiKeyDto>): Promise<ApiKey | null> {
        if (!data || Object.keys(data).length === 0) {
            throw new AppError('No data provided for update', 400, 'NO_DATA_PROVIDED')
        }
        const existingKey = await this.apiKeyRepository.findById(id)
        if (existingKey && (!existingKey.isActive || (existingKey.expiresAt && existingKey.expiresAt > new Date()))) {
            throw new AppError('Cannot update a revoked API Key', 400, 'API_KEY_REVOKED')
        }
        const apiKey = await this.apiKeyRepository.update(id, data)
        if (!apiKey) {
            throw new AppError('API Key not found', 404, 'API_KEY_NOT_FOUND')
        }
        await invalidateApiKeyCache(apiKey.keyHash)
        return apiKey
    }
    async deleteApiKey(id: number): Promise<boolean> {
        const existingKey = await this.apiKeyRepository.findById(id)
        if (existingKey) {
            await invalidateApiKeyCache(existingKey?.keyHash)
        }
        const success = await this.apiKeyRepository.delete(id)
        if (!success) {
            throw new AppError('API Key not found', 404, 'API_KEY_NOT_FOUND')
        }
        return success
    }
    async revokeApiKey(id: number): Promise<ApiKey | null> {
        const apiKey = await this.apiKeyRepository.revoke(id)
        if (!apiKey) {
            throw new AppError('API Key not found', 404, 'API_KEY_NOT_FOUND')
        }
        await invalidateApiKeyCache(apiKey.keyHash)
        return apiKey
    }

    async rotateApiKey(id: number): Promise<ApiKeyWithPlainText> {
        const existingKey = await this.apiKeyRepository.findById(id)
        if (!existingKey) {
            throw new AppError('API Key not found', 404, 'API_KEY_NOT_FOUND')
        }
        if (!existingKey.isActive) {
            throw new AppError('Cannot rotate a revoked API Key', 400, 'API_KEY_REVOKED')
        }
        await invalidateApiKeyCache(existingKey.keyHash)
        // Revoke old key
        await this.apiKeyRepository.revoke(id)
        return this.generateApiKey({
            projectId: existingKey.projectId,
            keyName: `${existingKey.keyName} (rotated)`,
            expiresAt: existingKey.expiresAt || undefined
        })
    }

    async validateApiKey(plainTextKey: string): Promise<ValidatedApiKey | null> {
        const keyHash = hash(plainTextKey)
        const cachedApiKey = await getCachedApiKey(keyHash)
        if (cachedApiKey) {
            const data = JSON.parse(cachedApiKey) as ValidatedApiKey
            return data
        }
        const apiKey = await this.apiKeyRepository.findByHash(keyHash)
        if (!apiKey) {
            return null
        }
        if (!apiKey.isActive || (apiKey.expiresAt && apiKey.expiresAt < new Date())) {
            return null
        }
        // find associated project
        const project = await this.projectRepository.findById(apiKey.projectId)
        if (!project || !project.isActive) {
            return null
        }
        const result: ValidatedApiKey = { apiKey, project }
        await cacheApiKey(keyHash, JSON.stringify(result), API_KEY_CACHE_TTL)
        // Update last used timestamp (async, don't wait)
        this.apiKeyRepository.updateLastUsed(apiKey.id).catch(() => {})
        return result
    }
    /**
     * Helper to update hash and prefix (internal use)
     */
    private async updateKeyHashAndPrefix(id: number, keyHash: string, keyPrefix: string): Promise<void> {
        const repo = this.apiKeyRepository
        if (repo.updateHashAndPrefix) {
            await repo.updateHashAndPrefix(id, keyHash, keyPrefix)
        }
    }
}

export default new ApiKeyService()
