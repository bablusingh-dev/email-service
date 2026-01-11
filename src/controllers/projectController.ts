import { NextFunction, Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { createProjectSchema, updateProjectSchema } from '../validators/schema'
import projectService from '../services/projectService'
import httpResponse from '../utils/httpResponse'
import { AppError } from '../utils/appError'

export default {
    createProject: asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const value = await createProjectSchema.validateAsync(req.body)

        const project = await projectService.createProject(value)
        return httpResponse(req, res, 201, 'Project created successfully', { project })
    }),
    getAllProjects: asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10

        const { data: projects, pagination } = await projectService.getAllProjects({ page, limit })
        return httpResponse(req, res, 200, 'Projects retrieved successfully', { projects, pagination })
    }),
    getProjectById: asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const projectId = parseInt(req.params.id)
        const project = await projectService.getProjectById(projectId)
        if (!project) {
            throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND')
        }
        return httpResponse(req, res, 200, 'Project retrieved successfully', { project })
    }),
    updateProject: asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const projectId = parseInt(req.params.id)
        const value = await updateProjectSchema.validateAsync(req.body)
        const updatedProject = await projectService.updateProject(projectId, value)
        if (!updatedProject) {
            throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND')
        }
        return httpResponse(req, res, 200, 'Project updated successfully', { project: updatedProject })
    }),
    deleteProject: asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const projectId = parseInt(req.params.id)
        const deleted = await projectService.deleteProject(projectId)
        if (!deleted) {
            throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND')
        }
        return httpResponse(req, res, 200, 'Project deleted successfully')
    }),
    // TODO: GetProjectStats
}
