import RepositoryFactory from '../repositories/RepositoryFactory'
import { EApplicationEnvironment, PaginatedResponse, PaginationParams } from '../types/common.types'
import { CreateProjectDto, Project, ProjectWithDecryptedKey, UpdateProjectDto } from '../types/project.types'
import { AppError } from '../utils/appError'
import { decrypt, encrypt } from '../utils/encryption'

class ProjectService {
    private projectRepository = RepositoryFactory.getProjectRepository()

    async createProject(data: CreateProjectDto): Promise<Project> {
        const existingProject = await this.projectRepository.findByName(data.name)
        if (existingProject) {
            throw new AppError('Project with this name already exists', 409, 'PROJECT_EXISTS')
        }
        const encryptedApiKey = encrypt(data.providerApiKey)
        return await this.projectRepository.create({
            ...data,
            providerApiKey: encryptedApiKey
        })
    }

    getProjectById(id: number): Promise<Project | null> {
        return this.projectRepository.findById(id)
    }
    async getProjectWithDecryptedApiKey(id: number): Promise<ProjectWithDecryptedKey | null> {
        const project = await this.projectRepository.findById(id)
        if (!project) {
            return null
        }
        const decryptedApiKey = decrypt(project.providerApiKeyEncrypted)
        const { providerApiKeyEncrypted: _, ...rest } = project
        return {
            ...rest,
            providerApiKey: decryptedApiKey
        }
    }
    async getAllProjects(params: PaginationParams): Promise<PaginatedResponse<Project>> {
        return await this.projectRepository.findAll(params)
    }
    async getProjectByEnvironment(environment: EApplicationEnvironment): Promise<Project[]> {
        return await this.projectRepository.findByEnvironment(environment)
    }

    async getActiveProjects(): Promise<Project[]> {
        return await this.projectRepository.findActive()
    }
    async updateProject(id: number, data: UpdateProjectDto): Promise<Project | null> {
        if (data.providerApiKey) {
            data.providerApiKey = encrypt(data.providerApiKey)
        }
        if (data.name) {
            const existing = await this.projectRepository.findByName(data.name)
            if (existing && existing.id !== id) {
                throw new AppError('Project with this name already exists', 409, 'PROJECT_EXISTS')
            }
        }
        return await this.projectRepository.update(id, data)
    }
    async deleteProject(id: number): Promise<boolean> {
        return await this.projectRepository.delete(id)
    }
    async toggleProjectActive(id: number): Promise<Project | null> {
        return await this.projectRepository.toggleActive(id)
    }
    async getProjectCount(): Promise<number> {
        return await this.projectRepository.count()
    }
}
export default new ProjectService()
