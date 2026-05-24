import { Router, type Request, type Response } from 'express'
import { getClassReport } from '../utils/dataStore.js'

const router = Router()

router.get('/class/:subjectId', (req: Request, res: Response) => {
  const subjectId = Number(req.params.subjectId)
  res.status(200).json(getClassReport(subjectId))
})

export default router
