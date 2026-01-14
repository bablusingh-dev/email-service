import { NextFunction, Request, Response } from 'express'
import apiKeyService from '../services/apiKeyService'
import { asyncHandler } from '../utils/asyncHandler'
import { createApiKeySchema } from '../validators/schema'
import httpResponse from '../utils/httpResponse'

export default {
    generateApiKey: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
        const projectId = parseInt(req.params.projectId)
        const value = await createApiKeySchema.validateAsync(req.body)
        const apiKey = await apiKeyService.generateApiKey({ ...value, projectId })
        return httpResponse(req, res, 201, 'API key generated successfully. Save it securely - it will not be shown again.', { apiKey })
    })
}
