import { NextFunction, Request, Response } from 'express'
import apiKeyService from '../services/apiKeyService'
import { asyncHandler } from '../utils/asyncHandler'
import { createApiKeySchema, updateApiKeySchema } from '../validators/schema'
import httpResponse from '../utils/httpResponse'

export default {
    generateApiKey: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
        const projectId = parseInt(req.params.projectId)
        const value = await createApiKeySchema.validateAsync(req.body)
        const apiKey = await apiKeyService.generateApiKey({ ...value, projectId })
        return httpResponse(req, res, 201, 'API key generated successfully. Save it securely - it will not be shown again.', { apiKey })
    }),
    getApiKeyByProjectId: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
        const projectId = parseInt(req.params.projectId)
        const apiKey = await apiKeyService.getApiKeyByProjectId(projectId)

        return httpResponse(req, res, 200, 'API keys retrieved successfully.', { apiKey })
    }),
    getApiKeyById: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
        const apiKeyId = parseInt(req.params.id)
        const apiKey = await apiKeyService.getApiKeyById(apiKeyId)
        return httpResponse(req, res, 200, 'API key retrieved successfully.', { apiKey })
    }),
    updateApiKey: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
        const apiKeyId = parseInt(req.params.id)
        const value = await updateApiKeySchema.validateAsync(req.body)
        const apiKey = await apiKeyService.updateApiKey(apiKeyId, value)
        return httpResponse(req, res, 200, 'API key updated successfully.', { apiKey })
    }),
    deleteApiKey: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
        const apiKeyId = parseInt(req.params.id)
        await apiKeyService.deleteApiKey(apiKeyId)
        return httpResponse(req, res, 200, 'API key deleted successfully.')
    }),
    revokeApiKey: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
        const apiKeyId = parseInt(req.params.id)
        const apiKey = await apiKeyService.revokeApiKey(apiKeyId)
        return httpResponse(req, res, 200, 'API key revoked successfully.', { apiKey })
    }),
    rotateApiKey: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
        const apiKeyId = parseInt(req.params.id)
        const apiKey = await apiKeyService.rotateApiKey(apiKeyId)
        return httpResponse(req, res, 200, 'API key rotated successfully. Save the new key securely - it will not be shown again.', { apiKey })
    })
}
