import { NextFunction, Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { createProjectSchema } from '../validators/schema'
import projectService from '../services/projectService'
import httpResponse from '../utils/httpResponse'
// import { AppError } from '../utils/appError'

export default {
    createProject: asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const value = await createProjectSchema.validateAsync(req.body)

        const project = await projectService.createProject(value)
        return httpResponse(req, res, 201, 'Project created successfully', project)
    })
}
