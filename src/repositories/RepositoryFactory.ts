import config from '../configs/config'
import { EApplicationEnvironment } from '../types/common.types'
import { DrizzleProjectRepository } from './implementations/drizzle/DrizzleProjectRepository'
import { IProjectRepository } from './interfaces/IProjectRepository'

class RepositoryFactory {
    private static projectRepository: IProjectRepository | null = null

    static getProjectRepository(): IProjectRepository {
        if (!this.projectRepository) {
            this.projectRepository = new DrizzleProjectRepository()
        }
        return this.projectRepository
    }

    static reset(): void {
        this.projectRepository = null
    }

    static setProjectRepository(projectRepository: IProjectRepository): void {
        if (config.ENV !== EApplicationEnvironment.TESTING) {
            throw new Error('setProjectRepository can only be used in testing environment')
        }
        this.projectRepository = projectRepository
    }
}

export default RepositoryFactory
