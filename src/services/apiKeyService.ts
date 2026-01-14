import RepositoryFactory from '../repositories/RepositoryFactory'
import { ApiKeyWithPlainText, CreateApiKeyDto } from '../types/project.types'
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
