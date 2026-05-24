import { Router, type Request, type Response } from 'express'
import { getAdminDashboard, getAnalyticsSummary, getStudentDashboard } from '../utils/dataStore.js'

const router = Router()

router.get('/summary', (_req: Request, res: Response) => {
  res.status(200).json(getAnalyticsSummary())
})

router.get('/student/:studentId', (req: Request, res: Response) => {
  const studentId = Number(req.params.studentId)
  res.status(200).json(getStudentDashboard(studentId))
})

router.get('/admin/overview', (_req: Request, res: Response) => {
  res.status(200).json(getAdminDashboard())
})

export default router
