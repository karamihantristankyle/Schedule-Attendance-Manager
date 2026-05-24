import { describe, expect, it } from 'vitest'
import { checkInStudent, createSchedule, createSubject, createUser, enrollStudentInSubject, getTeacherDashboard, openAttendanceSession, resetStore, upsertAttendanceStatus } from './dataStore'

describe('attendance store', () => {
  it('opens a new session when schedule has no active session', () => {
    resetStore()
    const session = openAttendanceSession(2)
    expect(session.status).toBe('open')
    expect(session.qrToken).toContain('IT402')
  })

  it('records attendance for a valid enrolled student', () => {
    resetStore()
    const result = checkInStudent(1, 'UPHSL-IT401-0524')
    expect(result.success).toBe(true)
    expect(result.message).toContain('checked in')
  })

  it('accepts token input with mixed case and spaces', () => {
    resetStore()
    const result = checkInStudent(1, '  uphsl-it401-0524  ')
    expect(result.success).toBe(true)
    expect(result.record?.status).toBe('late')
  })

  it('returns a confirmed result for duplicate submissions', () => {
    resetStore()
    checkInStudent(1, 'UPHSL-IT401-0524')
    const result = checkInStudent(1, 'UPHSL-IT401-0524')
    expect(result.success).toBe(true)
    expect(result.alreadyRecorded).toBe(true)
    expect(result.message).toContain('already confirmed')
  })

  it('allows a teacher to create a schedule for an assigned subject', () => {
    resetStore()
    const schedule = createSchedule('teacher', 2, {
      subjectId: 1,
      room: 'lab 5',
      dayOfWeek: 'Friday',
      startTime: '13:00',
      endTime: '14:30',
    })
    expect(schedule.room).toBe('LAB 5')
    expect(schedule.subject.code).toBe('IT 401')
  })

  it('allows an admin to create a new subject for a teacher', () => {
    resetStore()
    const subject = createSubject('admin', 3, {
      code: 'it 403',
      name: 'Network Security',
      teacherId: 2,
    })
    expect(subject.code).toBe('IT 403')
    expect(subject.teacherId).toBe(2)
  })

  it('allows an admin to create a new student with a student number', () => {
    resetStore()
    const user = createUser('admin', 3, {
      role: 'student',
      firstName: 'Kyle',
      lastName: 'Morales',
      studentNumber: '2024-00999',
    })
    expect(user.role).toBe('student')
    expect(user.studentNumber).toBe('2024-00999')
    expect(user.email).toContain('kyle.morales')
  })

  it('allows an admin to create a new teacher with generated login details from a single name field', () => {
    resetStore()
    const user = createUser('admin', 3, {
      role: 'teacher',
      firstName: 'Lia',
      lastName: '',
    })
    expect(user.role).toBe('teacher')
    expect(user.employeeNumber).toContain('FAC-')
    expect(user.email).toContain('lia')
  })

  it('creates an attendance record when a teacher marks a student absent', () => {
    resetStore()
    const entry = upsertAttendanceStatus('teacher', 2, 1, 1, 'absent')
    expect(entry.status).toBe('absent')
    expect(entry.recordId).not.toBeNull()
  })

  it('allows a teacher to enroll a student in their own subject', () => {
    resetStore()
    const enrollment = enrollStudentInSubject('teacher', 2, {
      subjectId: 1,
      studentId: 5,
    })
    expect(enrollment.subjectId).toBe(1)
    expect(enrollment.student.id).toBe(5)

    const dashboard = getTeacherDashboard(2)
    const subjectRoster = dashboard.subjectEnrollments.find((subject) => subject.subjectId === 1)
    expect(subjectRoster?.students.some((student) => student.id === 5)).toBe(true)
  })

  it('allows check-in only after a student is actively enrolled in the subject', () => {
    resetStore()
    expect(() => checkInStudent(5, 'UPHSL-IT401-0524')).toThrow('Student is not enrolled in this subject')

    enrollStudentInSubject('teacher', 2, {
      subjectId: 1,
      studentId: 5,
    })

    const result = checkInStudent(5, 'UPHSL-IT401-0524')
    expect(result.success).toBe(true)
  })

  it('sorts teacher attendance entries alphabetically by student name', () => {
    resetStore()
    const dashboard = getTeacherDashboard(2)
    const names = dashboard.attendanceEntries.map((entry) => entry.studentName)
    expect(names).toEqual([...names].sort((left, right) => left.localeCompare(right)))
  })

  it('does not allow admins to edit attendance status', () => {
    resetStore()
    expect(() => upsertAttendanceStatus('admin', 3, 1, 1, 'present')).toThrow('Only teachers can update attendance status')
  })
})
