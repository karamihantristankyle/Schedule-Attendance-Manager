import express, { type NextFunction, type Request, type Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import scheduleRoutes from './routes/schedules.js'
import subjectRoutes from './routes/subjects.js'
import userRoutes from './routes/users.js'
import attendanceRoutes from './routes/attendance.js'
import reportRoutes from './routes/reports.js'
import analyticsRoutes from './routes/analytics.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/schedules', scheduleRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/users', userRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/analytics', analyticsRoutes)

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'ok' })
})

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: error.message || 'Server internal error',
  })
})

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'API not found' })
})

export default app
