import { Router } from 'express'
import projectController from '../controllers/projectController'
import apiKeyController from '../controllers/apiKeyController'

const router = Router()
router.route('/projects').post(projectController.createProject).get(projectController.getAllProjects)
router.route('/projects/:id').get(projectController.getProjectById).put(projectController.updateProject).delete(projectController.deleteProject)

router.post('/projects/:projectId/api-keys', apiKeyController.generateApiKey)

export default router
