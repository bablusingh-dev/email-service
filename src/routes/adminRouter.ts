import { Router } from 'express'
import projectController from '../controllers/projectController'

const router = Router()
router.route('/projects').post(projectController.createProject).get(projectController.getAllProjects)
router.route('/projects/:id').get(projectController.getProjectById).put(projectController.updateProject).delete(projectController.deleteProject)

export default router
