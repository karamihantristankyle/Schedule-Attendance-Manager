import { Router, type Request, type Response } from 'express'
import {
  checkInStudent,
  enrollStudentInSubject,
  getAttendanceHistory,
  getTeacherDashboard,
  openAttendanceSession,
  upsertAttendanceStatus,
} from '../utils/dataStore.js'

const router = Router()

router.get('/history', (req: Request, res: Response) => {
  const studentId = Number(req.query.studentId ?? 0)
  res.status(200).json(getAttendanceHistory(studentId))
})

router.get('/teacher/:teacherId', (req: Request, res: Response) => {
  const teacherId = Number(req.params.teacherId)
  res.status(200).json(getTeacherDashboard(teacherId))
})

router.post('/open', (req: Request, res: Response) => {
  const scheduleId = Number(req.body.scheduleId)
  res.status(200).json(openAttendanceSession(scheduleId))
})

router.post('/checkin', (req: Request, res: Response) => {
  const studentId = Number(req.body.studentId)
  const qrToken = String(req.body.qrToken ?? '')

  try {
    res.status(200).json(checkInStudent(studentId, qrToken))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to check in'
    res.status(400).json({ success: false, message })
  }
})

router.patch('/status', (req: Request, res: Response) => {
  const role = String(req.body.role ?? '')
  const actorId = Number(req.body.actorId ?? 0)
  const sessionId = Number(req.body.sessionId ?? 0)
  const studentId = Number(req.body.studentId ?? 0)
  const status = String(req.body.status ?? '')

  try {
    const entry = upsertAttendanceStatus(role, actorId, sessionId, studentId, status as 'present' | 'late' | 'absent')
    res.status(200).json({
      success: true,
      message: 'Attendance status updated successfully',
      entry,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update attendance status'
    res.status(400).json({ success: false, message })
  }
})

router.post('/enroll', (req: Request, res: Response) => {
  const role = String(req.body.role ?? '')
  const actorId = Number(req.body.actorId ?? 0)
  const subjectId = Number(req.body.subjectId ?? 0)
  const studentId = Number(req.body.studentId ?? 0)

  try {
    const enrollment = enrollStudentInSubject(role, actorId, { subjectId, studentId })
    res.status(200).json({
      success: true,
      message: 'Student enrolled successfully',
      enrollment,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to enroll student'
    res.status(400).json({ success: false, message })
  }
})

export default router
