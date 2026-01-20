import { Router } from 'express'
import projectController from '../controllers/projectController'
import apiKeyController from '../controllers/apiKeyController'
import authMiddleware from '../middleware/authMiddleware'
import { UserRole } from '../types/common.types'

const router = Router()
router
    .route('/projects')
    .post(authMiddleware.authenticate, authMiddleware.authorize([UserRole.ADMIN]), projectController.createProject)
    .get(authMiddleware.authenticate, authMiddleware.authorize([UserRole.ADMIN]), projectController.getAllProjects)
router
    .route('/projects/:id')
    .get(authMiddleware.authenticate, authMiddleware.authorize([UserRole.ADMIN]), projectController.getProjectById)
    .put(authMiddleware.authenticate, authMiddleware.authorize([UserRole.ADMIN]), projectController.updateProject)
    .delete(authMiddleware.authenticate, authMiddleware.authorize([UserRole.ADMIN]), projectController.deleteProject)
// ==================== API KEY ROUTES ====================

router
    .route('/projects/:projectId/api-keys')
    .get(authMiddleware.authenticate, authMiddleware.authorize([UserRole.ADMIN]), apiKeyController.getApiKeyByProjectId)
    .post(apiKeyController.generateApiKey)
router
    .route('/api-keys/:id')
    .get(authMiddleware.authenticate, authMiddleware.authorize([UserRole.ADMIN]), apiKeyController.getApiKeyById)
    .put(apiKeyController.updateApiKey)
    .delete(apiKeyController.deleteApiKey)
router.route('/api-keys/:id/revoke').post(authMiddleware.authenticate, authMiddleware.authorize([UserRole.ADMIN]), apiKeyController.revokeApiKey)
router.route('/api-keys/:id/rotate').post(authMiddleware.authenticate, authMiddleware.authorize([UserRole.ADMIN]), apiKeyController.rotateApiKey)

export default router
