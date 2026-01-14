import { ApiKey, CreateApiKeyDto, UpdateApiKeyDto } from '../../types/project.types.js'
import { IBaseRepository } from './IBaseRepository.js'

/**
 * API Key repository interface
 * Extends base repository with API key-specific methods
 */
export interface IApiKeyRepository extends IBaseRepository<ApiKey, CreateApiKeyDto, UpdateApiKeyDto> {
    /**
     * Find an API key by its hash
     */
    findByHash(keyHash: string): Promise<ApiKey | null>

    /**
     * Find all API keys for a project
     */
    findByProjectId(projectId: number): Promise<ApiKey[]>

    /**
     * Find an API key by its prefix
     */
    findByPrefix(keyPrefix: string): Promise<ApiKey[]>

    /**
     * Update the last used timestamp for an API key
     */
    updateLastUsed(id: number): Promise<void>

    /**
     * Revoke an API key (set isActive to false)
     */
    revoke(id: number): Promise<ApiKey | null>

    /**
     * Find all active API keys for a project
     */
    findActiveByProjectId(projectId: number): Promise<ApiKey[]>

    /**
     * Delete all API keys for a project
     */
    deleteByProjectId(projectId: number): Promise<number>

    /**
     * Update hash and prefix for an API key (internal use)
     */
    updateHashAndPrefix(id: number, keyHash: string, keyPrefix: string): Promise<void>
}
