import { createSeedData } from '../data/mockData.js'
import type {
  AdminDashboardData,
  AttendanceHistoryItem,
  AttendanceManagementEntry,
  AttendanceRecord,
  AttendanceStatus,
  CreateUserInput,
  CreateSubjectInput,
  AttendanceSession,
  CreateScheduleInput,
  DemoUser,
  LoginResponse,
  Schedule,
  StudentDashboardData,
  Subject,
  TeacherDashboardData,
  User,
} from '../../shared/types.js'

const state = createSeedData()

const today = '2026-05-24'

const normalizeToken = (value: string) => value.trim().toUpperCase().replace(/\s+/g, '')
const normalizeDay = (value: string) => value.trim()
const normalizeSubjectCode = (value: string) => value.trim().toUpperCase()
const normalizeName = (value: string) => value.trim().replace(/\s+/g, ' ')
const formatName = (firstName: string, lastName: string) => `${firstName} ${lastName}`.trim()

const slugifyName = (value: string) =>
  normalizeName(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '.')

const createUniqueEmail = (firstName: string, lastName: string) => {
  const base = `${slugifyName(firstName)}.${slugifyName(lastName)}`.replace(/^\.+|\.+$/g, '') || `user${state.users.length + 1}`
  let email = `${base}@uphsl.edu`
  let suffix = 2

  while (state.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    email = `${base}${suffix}@uphsl.edu`
    suffix += 1
  }

  return email
}

const withoutPassword = (user: DemoUser): User => {
  const { password: _password, ...safeUser } = user
  return safeUser
}

const getSubjectById = (subjectId: number): Subject => {
  const subject = state.subjects.find((item) => item.id === subjectId)
  if (!subject) {
    throw new Error('Subject not found')
  }
  return subject
}

const getScheduleById = (scheduleId: number): Schedule => {
  const schedule = state.schedules.find((item) => item.id === scheduleId)
  if (!schedule) {
    throw new Error('Schedule not found')
  }
  return schedule
}

const getUserById = (userId: number): DemoUser => {
  const user = state.users.find((item) => item.id === userId)
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

const toHistoryItem = (record: AttendanceRecord): AttendanceHistoryItem => {
  const session = state.sessions.find((item) => item.id === record.attendanceSessionId)
  if (!session) {
    throw new Error('Session not found')
  }
  const schedule = getScheduleById(session.scheduleId)
  const subject = getSubjectById(schedule.subjectId)

  return {
    id: record.id,
    subjectCode: subject.code,
    subjectName: subject.name,
    room: schedule.room,
    sessionDate: session.sessionDate,
    timeIn: record.timeIn,
    status: record.status,
  }
}

const toAttendanceManagementEntry = (session: AttendanceSession, student: DemoUser): AttendanceManagementEntry => {
  const schedule = getScheduleById(session.scheduleId)
  const subject = getSubjectById(schedule.subjectId)
  const existingRecord = state.records.find(
    (record) => record.attendanceSessionId === session.id && record.studentId === student.id,
  )

  return {
    entryKey: `${session.id}-${student.id}`,
    recordId: existingRecord?.id ?? null,
    sessionId: session.id,
    studentId: student.id,
    studentName: formatName(student.firstName, student.lastName),
    subjectId: subject.id,
    subjectCode: subject.code,
    subjectName: subject.name,
    room: schedule.room,
    sessionDate: session.sessionDate,
    timeIn: existingRecord?.timeIn ?? null,
    status: existingRecord?.status ?? 'absent',
    sessionStatus: session.status,
  }
}

const getAttendanceEntries = (options?: { teacherId?: number }): AttendanceManagementEntry[] => {
  const relevantSessions = state.sessions.filter((session) => {
    if (!options?.teacherId) {
      return true
    }

    const schedule = getScheduleById(session.scheduleId)
    const subject = getSubjectById(schedule.subjectId)
    return subject.teacherId === options.teacherId
  })

  return relevantSessions
    .flatMap((session) => {
      const schedule = getScheduleById(session.scheduleId)
      const enrolledStudents = state.enrollments
        .filter((enrollment) => enrollment.subjectId === schedule.subjectId && enrollment.status === 'active')
        .map((enrollment) => getUserById(enrollment.studentId))

      return enrolledStudents.map((student) => toAttendanceManagementEntry(session, student))
    })
    .sort((left, right) => {
      const dateCompare = right.sessionDate.localeCompare(left.sessionDate)
      if (dateCompare !== 0) {
        return dateCompare
      }

      return left.studentName.localeCompare(right.studentName)
    })
}

export const loginUser = (email: string, password: string): LoginResponse => {
  const user = state.users.find((item) => item.email === email && item.password === password)
  if (!user) {
    throw new Error('Invalid credentials')
  }

  return {
    token: `demo-token-${user.role}-${user.id}`,
    user: withoutPassword(user),
  }
}

export const getStudentDashboard = (studentId: number): StudentDashboardData => {
  const user = withoutPassword(getUserById(studentId))
  const subjectIds = state.enrollments
    .filter((item) => item.studentId === studentId && item.status === 'active')
    .map((item) => item.subjectId)

  const schedules = state.schedules
    .filter((schedule) => subjectIds.includes(schedule.subjectId))
    .map((schedule) => ({
      ...schedule,
      subject: getSubjectById(schedule.subjectId),
    }))

  const history = state.records
    .filter((record) => record.studentId === studentId)
    .map(toHistoryItem)
    .sort((left, right) => right.sessionDate.localeCompare(left.sessionDate))

  const attendedCount = history.filter((item) => item.status === 'present').length
  const lateCount = history.filter((item) => item.status === 'late').length
  const attendanceRate = history.length === 0 ? 0 : Math.round(((attendedCount + lateCount) / history.length) * 100)
  const activeSession = state.sessions
    .filter((session) => session.status === 'open')
    .map((session) => {
      const schedule = getScheduleById(session.scheduleId)
      const subject = getSubjectById(schedule.subjectId)

      return {
        ...session,
        subject,
        room: schedule.room,
      }
    })
    .find((session) => subjectIds.includes(session.subject.id)) ?? null

  return {
    user,
    stats: {
      attendanceRate,
      classesToday: schedules.filter((item) => item.dayOfWeek === 'Monday').length,
      attendedCount,
      lateCount,
    },
    schedules,
    activeSession,
    history,
  }
}

export const getTeacherDashboard = (teacherId: number): TeacherDashboardData => {
  const user = withoutPassword(getUserById(teacherId))
  const managedSubjects = state.subjects.filter((subject) => subject.teacherId === teacherId)
  const classes = state.schedules
    .filter((schedule) => getSubjectById(schedule.subjectId).teacherId === teacherId)
    .map((schedule) => ({
      ...schedule,
      subject: getSubjectById(schedule.subjectId),
    }))

  const activeSession = state.sessions
    .filter((session) => session.status === 'open')
    .map((session) => {
      const schedule = getScheduleById(session.scheduleId)
      const subject = getSubjectById(schedule.subjectId)
      return {
        ...session,
        subject,
        room: schedule.room,
      }
    })
    .find((session) => session.subject.teacherId === teacherId) ?? null

  const recentRecords = state.records
    .slice()
    .reverse()
    .map((record) => {
      const student = getUserById(record.studentId)
      return {
        ...toHistoryItem(record),
        studentName: formatName(student.firstName, student.lastName),
      }
    })

  const report = classes.map((schedule) => {
    const sessions = state.sessions.filter((session) => session.scheduleId === schedule.id)
    const records = state.records.filter((record) => sessions.some((session) => session.id === record.attendanceSessionId))
    const presentCount = records.filter((record) => record.status === 'present').length
    const lateCount = records.filter((record) => record.status === 'late').length
    const attendanceRate = records.length === 0 ? 0 : Math.round(((presentCount + lateCount) / records.length) * 100)

    return {
      scheduleId: schedule.id,
      subjectCode: schedule.subject.code,
      subjectName: schedule.subject.name,
      attendanceRate,
      presentCount,
      lateCount,
    }
  })

  return {
    user,
    managedSubjects,
    classes,
    activeSession,
    recentRecords,
    attendanceEntries: getAttendanceEntries({ teacherId }).slice(0, 8),
    report,
  }
}

export const getAdminDashboard = (): AdminDashboardData => {
  const presentCount = state.records.filter((item) => item.status === 'present' || item.status === 'late').length
  const attendanceRate = state.records.length === 0 ? 0 : Math.round((presentCount / state.records.length) * 100)

  return {
    summary: {
      totalStudents: state.users.filter((item) => item.role === 'student').length,
      totalTeachers: state.users.filter((item) => item.role === 'teacher').length,
      totalSubjects: state.subjects.length,
      attendanceRate,
    },
    users: state.users.map(withoutPassword),
    teachers: state.users.filter((item) => item.role === 'teacher').map(withoutPassword),
    subjects: state.subjects,
    schedules: state.schedules.map((schedule) => {
      const subject = getSubjectById(schedule.subjectId)
      const teacher = getUserById(subject.teacherId)
      return {
        ...schedule,
        subject,
        teacherName: formatName(teacher.firstName, teacher.lastName),
      }
    }),
    sessions: state.sessions.map((session) => {
      const schedule = getScheduleById(session.scheduleId)
      const subject = getSubjectById(schedule.subjectId)
      return {
        ...session,
        subjectCode: subject.code,
      }
    }),
    attendanceEntries: getAttendanceEntries().slice(0, 10),
  }
}

export const getSchedulesForRole = (role: string, userId: number) => {
  if (role === 'student') {
    return getStudentDashboard(userId).schedules
  }

  if (role === 'teacher') {
    return getTeacherDashboard(userId).classes
  }

  return getAdminDashboard().schedules
}

export const getAttendanceHistory = (studentId: number) => getStudentDashboard(studentId).history

export const openAttendanceSession = (scheduleId: number) => {
  const schedule = getScheduleById(scheduleId)
  const subject = getSubjectById(schedule.subjectId)
  const currentOpenSession = state.sessions.find((item) => item.scheduleId === scheduleId && item.status === 'open')

  if (currentOpenSession) {
    return {
      ...currentOpenSession,
      subject,
      room: schedule.room,
    }
  }

  const nextId = state.sessions.length + 1
  const session: AttendanceSession = {
    id: nextId,
    scheduleId,
    sessionDate: today,
    openedAt: `${today}T07:50:00.000Z`,
    closedAt: null,
    validFrom: `${today}T07:50:00.000Z`,
    validUntil: `${today}T08:20:00.000Z`,
    qrToken: `${subject.code.replace(/\s+/g, '')}-${today}-${nextId}`,
    status: 'open',
  }

  state.sessions.push(session)

  return {
    ...session,
    subject,
    room: schedule.room,
  }
}

export const createSchedule = (role: string, actorId: number, payload: CreateScheduleInput) => {
  const subject = getSubjectById(payload.subjectId)

  if (role === 'teacher' && subject.teacherId !== actorId) {
    throw new Error('Teachers can only create schedules for their assigned subjects')
  }

  if (role !== 'teacher' && role !== 'admin') {
    throw new Error('Only teachers and admins can create schedules')
  }

  const nextId = state.schedules.length + 1
  const schedule: Schedule = {
    id: nextId,
    subjectId: payload.subjectId,
    room: payload.room.trim().toUpperCase(),
    dayOfWeek: normalizeDay(payload.dayOfWeek),
    startTime: payload.startTime,
    endTime: payload.endTime,
  }

  state.schedules.push(schedule)

  const teacher = getUserById(subject.teacherId)

  return {
    ...schedule,
    subject,
    teacherName: formatName(teacher.firstName, teacher.lastName),
  }
}

export const createSubject = (role: string, actorId: number, payload: CreateSubjectInput) => {
  if (role !== 'admin') {
    throw new Error('Only admins can create subjects')
  }

  const actor = getUserById(actorId)
  if (actor.role !== 'admin') {
    throw new Error('Only admins can create subjects')
  }

  const teacher = getUserById(payload.teacherId)
  if (teacher.role !== 'teacher') {
    throw new Error('Assigned user must be a teacher')
  }

  const subjectCode = normalizeSubjectCode(payload.code)
  const existingSubject = state.subjects.find((subject) => normalizeSubjectCode(subject.code) === subjectCode)
  if (existingSubject) {
    throw new Error('Subject code already exists')
  }

  const subject: Subject = {
    id: state.subjects.length + 1,
    code: subjectCode,
    name: payload.name.trim(),
    teacherId: payload.teacherId,
  }

  state.subjects.push(subject)

  return subject
}

export const createUser = (role: string, actorId: number, payload: CreateUserInput) => {
  if (role !== 'admin') {
    throw new Error('Only admins can add users')
  }

  const actor = getUserById(actorId)
  if (actor.role !== 'admin') {
    throw new Error('Only admins can add users')
  }

  const firstName = normalizeName(payload.firstName)
  const lastName = normalizeName(payload.lastName)
  if (!firstName) {
    throw new Error('Name is required')
  }

  if (payload.role !== 'student' && payload.role !== 'teacher') {
    throw new Error('Only student and teacher accounts can be created here')
  }

  const nextId = state.users.length + 1
  const email = createUniqueEmail(firstName, lastName)

  if (payload.role === 'student') {
    const studentNumber = normalizeName(payload.studentNumber ?? '')
    if (!studentNumber) {
      throw new Error('Student number is required')
    }

    const existingStudent = state.users.find((user) => user.studentNumber === studentNumber)
    if (existingStudent) {
      throw new Error('Student number already exists')
    }

    const student: DemoUser = {
      id: nextId,
      firstName,
      lastName,
      email,
      password: 'password123',
      role: 'student',
      studentNumber,
      course: 'BS Information Technology',
      yearLevel: 1,
    }

    state.users.push(student)
    return student
  }

  const teacher: DemoUser = {
    id: nextId,
    firstName,
    lastName,
    email,
    password: 'password123',
    role: 'teacher',
    employeeNumber: `FAC-${String(200 + nextId).padStart(4, '0')}`,
  }

  state.users.push(teacher)
  return teacher
}

export const upsertAttendanceStatus = (
  role: string,
  actorId: number,
  sessionId: number,
  studentId: number,
  status: AttendanceStatus,
) => {
  if (role !== 'teacher' && role !== 'admin') {
    throw new Error('Only teachers and admins can update attendance status')
  }

  const session = state.sessions.find((item) => item.id === sessionId)
  if (!session) {
    throw new Error('Attendance session not found')
  }

  const schedule = getScheduleById(session.scheduleId)
  const subject = getSubjectById(schedule.subjectId)

  if (role === 'teacher' && subject.teacherId !== actorId) {
    throw new Error('Teachers can only update attendance for their own subjects')
  }

  const enrolled = state.enrollments.some(
    (enrollment) => enrollment.subjectId === subject.id && enrollment.studentId === studentId && enrollment.status === 'active',
  )
  if (!enrolled) {
    throw new Error('Student is not enrolled in this subject')
  }

  let record = state.records.find((item) => item.attendanceSessionId === sessionId && item.studentId === studentId)

  if (!record) {
    record = {
      id: state.records.length + 1,
      attendanceSessionId: sessionId,
      studentId,
      timeIn: status === 'absent' ? session.validUntil : `${today}T08:10:00.000Z`,
      status,
    }
    state.records.push(record)
  } else {
    record.status = status
    if (status === 'absent' && !record.timeIn) {
      record.timeIn = session.validUntil
    }
  }

  return toAttendanceManagementEntry(session, getUserById(studentId))
}

export const checkInStudent = (studentId: number, qrToken: string) => {
  const normalizedToken = normalizeToken(qrToken)
  const session = state.sessions.find((item) => normalizeToken(item.qrToken) === normalizedToken && item.status === 'open')
  if (!session) {
    throw new Error('Session is invalid or already closed')
  }

  const schedule = getScheduleById(session.scheduleId)
  const subject = getSubjectById(schedule.subjectId)
  const enrolled = state.enrollments.some((item) => item.studentId === studentId && item.subjectId === subject.id)
  if (!enrolled) {
    throw new Error('Student is not enrolled in this subject')
  }

  const duplicate = state.records.find((item) => item.attendanceSessionId === session.id && item.studentId === studentId)
  if (duplicate) {
    return {
      success: true,
      alreadyRecorded: true,
      message: `Attendance already confirmed for ${subject.code}.`,
      record: {
        id: duplicate.id,
        sessionId: session.id,
        status: duplicate.status,
        timeIn: duplicate.timeIn,
      },
      session: {
        subjectCode: subject.code,
        subjectName: subject.name,
        room: schedule.room,
        validUntil: session.validUntil,
      },
    }
  }

  const nextId = state.records.length + 1
  const status = state.records.length % 2 === 0 ? 'present' : 'late'
  const record: AttendanceRecord = {
    id: nextId,
    attendanceSessionId: session.id,
    studentId,
    timeIn: `${today}T08:04:00.000Z`,
    status,
  }

  state.records.push(record)

  return {
    success: true,
    message: `You are checked in for ${subject.code}.`,
    record: {
      id: record.id,
      sessionId: session.id,
      status: record.status,
      timeIn: record.timeIn,
    },
    session: {
      subjectCode: subject.code,
      subjectName: subject.name,
      room: schedule.room,
      validUntil: session.validUntil,
    },
  }
}

export const getClassReport = (subjectId: number) => {
  const subject = getSubjectById(subjectId)
  const schedules = state.schedules.filter((item) => item.subjectId === subjectId)
  const sessions = state.sessions.filter((item) => schedules.some((schedule) => schedule.id === item.scheduleId))
  const records = state.records.filter((item) => sessions.some((session) => session.id === item.attendanceSessionId))

  return {
    subjectCode: subject.code,
    subjectName: subject.name,
    sessionsHeld: sessions.length,
    attendanceCount: records.length,
    lateCount: records.filter((item) => item.status === 'late').length,
  }
}

export const getAnalyticsSummary = () => getAdminDashboard().summary

export const resetStore = () => {
  const fresh = createSeedData()
  state.users = fresh.users
  state.subjects = fresh.subjects
  state.schedules = fresh.schedules
  state.enrollments = fresh.enrollments
  state.sessions = fresh.sessions
  state.records = fresh.records
}
