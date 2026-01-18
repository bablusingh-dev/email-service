import config from '../configs/config'
import { EApplicationEnvironment } from '../types/common.types'
import { DrizzleApiKeyRepository } from './implementations/drizzle/DrizzleApiKeyRepository'
import { DrizzleProjectRepository } from './implementations/drizzle/DrizzleProjectRepository'
import { DrizzleUserRepository } from './implementations/drizzle/DrizzleUserRepository'
import { IApiKeyRepository } from './interfaces/IApiKeyRepository'
import { IProjectRepository } from './interfaces/IProjectRepository'
import { IUserRepository } from './interfaces/IUserRepository'

class RepositoryFactory {
    private static projectRepository: IProjectRepository | null = null
    private static apiKeyRepository: IApiKeyRepository | null = null
    private static userRepository: IUserRepository | null = null

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
    static getUserRepository(): IUserRepository {
        if (!this.userRepository) {
            this.userRepository = new DrizzleUserRepository()
        }
        return this.userRepository
    }
    static reset(): void {
        this.projectRepository = null
        this.apiKeyRepository = null
        this.userRepository = null
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
    static setUserRepository(userRepository: IUserRepository): void {
        if (config.ENV !== EApplicationEnvironment.TESTING) {
            throw new Error('setUserRepository can only be used in testing environment')
        }
        this.userRepository = userRepository
    }
}

export default RepositoryFactory
