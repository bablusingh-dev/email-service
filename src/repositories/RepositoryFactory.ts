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
}

export default RepositoryFactory
