import { IBaseRepository } from './IBaseRepository.js'
import { Project, CreateProjectDto, UpdateProjectDto } from '../../types/project.types.js'
import { EApplicationEnvironment } from '../../types/common.types.js'

/**
 * Project repository interface
 * Extends base repository with project-specific methods
 */
export interface IProjectRepository extends IBaseRepository<Project, CreateProjectDto, UpdateProjectDto> {
    /**
     * Find a project by name
     */
    findByName(name: string): Promise<Project | null>

    /**
     * Find projects by environment
     */
    findByEnvironment(environment: EApplicationEnvironment): Promise<Project[]>

    /**
     * Find all active projects
     */
    findActive(): Promise<Project[]>

    // TODO:
    /**
     * Get project statistics (email counts, etc.)
     */
    // getProjectStats(projectId: number): Promise<ProjectStats | null>

    /**
     * Toggle project active status
     */
    toggleActive(projectId: number): Promise<Project | null>
}
