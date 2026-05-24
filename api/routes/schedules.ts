import { Router, type Request, type Response } from 'express'
import { createSchedule, getSchedulesForRole } from '../utils/dataStore.js'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  const role = String(req.query.role ?? '')
  const userId = Number(req.query.userId ?? 0)
  res.status(200).json(getSchedulesForRole(role, userId))
})

router.post('/sync', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Schedule data synchronized successfully',
  })
})

router.post('/', (req: Request, res: Response) => {
  const role = String(req.body.role ?? '')
  const actorId = Number(req.body.actorId ?? 0)

  try {
    const schedule = createSchedule(role, actorId, {
      subjectId: Number(req.body.subjectId),
      room: String(req.body.room ?? ''),
      dayOfWeek: String(req.body.dayOfWeek ?? ''),
      startTime: String(req.body.startTime ?? ''),
      endTime: String(req.body.endTime ?? ''),
    })

    res.status(200).json({
      success: true,
      message: 'Schedule created successfully',
      schedule,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create schedule'
    res.status(400).json({ success: false, message })
  }
})

export default router
