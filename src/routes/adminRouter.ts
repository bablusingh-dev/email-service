import { Router } from 'express'
import projectController from '../controllers/projectController'
import apiKeyController from '../controllers/apiKeyController'

const router = Router()
router.route('/projects').post(projectController.createProject).get(projectController.getAllProjects)
router.route('/projects/:id').get(projectController.getProjectById).put(projectController.updateProject).delete(projectController.deleteProject)

// ==================== API KEY ROUTES ====================

router.route('/projects/:projectId/api-keys').get(apiKeyController.getApiKeyByProjectId).post(apiKeyController.generateApiKey)
router.route('/api-keys/:id').get(apiKeyController.getApiKeyById).put(apiKeyController.updateApiKey).delete(apiKeyController.deleteApiKey)
router.route('/api-keys/:id/revoke').post(apiKeyController.revokeApiKey)
router.route('/api-keys/:id/rotate').post(apiKeyController.rotateApiKey)

export default router
