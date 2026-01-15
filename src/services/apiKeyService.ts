import RepositoryFactory from '../repositories/RepositoryFactory'
import { ApiKey, ApiKeyWithPlainText, CreateApiKeyDto } from '../types/project.types'
import { AppError } from '../utils/appError'
import { extractKeyPrefix, generateApiKey, hash } from '../utils/encryption'

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
        return apiKey
    }
    async deleteApiKey(id: number): Promise<boolean> {
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
        // Revoke old key
        await this.apiKeyRepository.revoke(id)
        return this.generateApiKey({
            projectId: existingKey.projectId,
            keyName: `${existingKey.keyName} (rotated)`,
            expiresAt: existingKey.expiresAt || undefined
        })
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
