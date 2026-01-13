import config from '../configs/config'
import { EApplicationEnvironment } from '../types/common.types'
import { DrizzleApiKeyRepository } from './implementations/drizzle/DrizzleApiKeyRepository'
import { DrizzleProjectRepository } from './implementations/drizzle/DrizzleProjectRepository'
import { IApiKeyRepository } from './interfaces/IApiKeyRepository'
import { IProjectRepository } from './interfaces/IProjectRepository'

class RepositoryFactory {
    private static projectRepository: IProjectRepository | null = null
    private static apiKeyRepository: IApiKeyRepository | null = null

    static getProjectRepository(): IProjectRepository {
        if (!this.projectRepository) {
            this.projectRepository = new DrizzleProjectRepository()
        }
        return this.projectRepository
    }
    static getApiKeyRepository(): IApiKeyRepository {
        if (!this.apiKeyRepository) {
            this.apiKeyRepository = new DrizzleApiKeyRepository()
        }
        return this.apiKeyRepository
    }
    static reset(): void {
        this.projectRepository = null
        this.apiKeyRepository = null
    }

    static setProjectRepository(projectRepository: IProjectRepository): void {
        if (config.ENV !== EApplicationEnvironment.TESTING) {
            throw new Error('setProjectRepository can only be used in testing environment')
        }
        this.projectRepository = projectRepository
    }
    static setApiKeyRepository(apiKeyRepository: IApiKeyRepository): void {
        if (config.ENV !== EApplicationEnvironment.TESTING) {
            throw new Error('setApiKeyRepository can only be used in testing environment')
        }
        this.apiKeyRepository = apiKeyRepository
    }
}

export default RepositoryFactory
