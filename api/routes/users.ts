import { Router, type Request, type Response } from 'express'
import { createUser } from '../utils/dataStore.js'

const router = Router()

router.post('/', (req: Request, res: Response) => {
  const role = String(req.body.role ?? '')
  const actorId = Number(req.body.actorId ?? 0)

  try {
    const user = createUser(role, actorId, {
      role: String(req.body.userRole ?? '') as 'student' | 'teacher',
      firstName: String(req.body.firstName ?? ''),
      lastName: String(req.body.lastName ?? ''),
      studentNumber: String(req.body.studentNumber ?? ''),
    })

    res.status(200).json({
      success: true,
      message: 'User created successfully',
      user,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create user'
    res.status(400).json({ success: false, message })
  }
})

export default router
