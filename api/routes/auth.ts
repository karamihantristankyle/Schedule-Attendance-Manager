import { Router, type Request, type Response } from 'express'
import { loginUser } from '../utils/dataStore.js'

const router = Router()

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const result = loginUser(email, password)
    res.status(200).json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed'
    res.status(401).json({ error: message })
  }
})

export default router
