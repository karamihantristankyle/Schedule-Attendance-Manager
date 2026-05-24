import { Router, type Request, type Response } from 'express'
import { createSubject } from '../utils/dataStore.js'

const router = Router()

router.post('/', (req: Request, res: Response) => {
  const role = String(req.body.role ?? '')
  const actorId = Number(req.body.actorId ?? 0)

  try {
    const subject = createSubject(role, actorId, {
      code: String(req.body.code ?? ''),
      name: String(req.body.name ?? ''),
      teacherId: Number(req.body.teacherId ?? 0),
    })

    res.status(200).json({
      success: true,
      message: 'Subject created successfully',
      subject,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create subject'
    res.status(400).json({ success: false, message })
  }
})

export default router
