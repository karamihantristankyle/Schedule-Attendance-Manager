export type UserRole = 'student' | 'teacher' | 'admin'
export type AttendanceStatus = 'present' | 'late' | 'absent'
export type SessionStatus = 'scheduled' | 'open' | 'closed'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: UserRole
  studentNumber?: string
  employeeNumber?: string
  course?: string
  yearLevel?: number
}

export interface DemoUser extends User {
  password: string
}

export interface Subject {
  id: number
  code: string
  name: string
  teacherId: number
}

export interface Schedule {
  id: number
  subjectId: number
  room: string
  dayOfWeek: string
  startTime: string
  endTime: string
}

export interface Enrollment {
  id: number
  subjectId: number
  studentId: number
  status: 'active' | 'inactive'
}

export interface AttendanceSession {
  id: number
  scheduleId: number
  sessionDate: string
  openedAt: string | null
  closedAt: string | null
  validFrom: string
  validUntil: string
  qrToken: string
  status: SessionStatus
}

export interface AttendanceRecord {
  id: number
  attendanceSessionId: number
  studentId: number
  timeIn: string
  status: AttendanceStatus
}

export interface AttendanceHistoryItem {
  id: number
  subjectCode: string
  subjectName: string
  room: string
  sessionDate: string
  timeIn: string
  status: AttendanceStatus
}

export interface AttendanceManagementEntry {
  entryKey: string
  recordId: number | null
  sessionId: number
  studentId: number
  studentName: string
  subjectId: number
  subjectCode: string
  subjectName: string
  room: string
  sessionDate: string
  timeIn: string | null
  status: AttendanceStatus
  sessionStatus: SessionStatus
}

export interface CreateScheduleInput {
  subjectId: number
  room: string
  dayOfWeek: string
  startTime: string
  endTime: string
}

export interface CreateSubjectInput {
  code: string
  name: string
  teacherId: number
}

export interface CreateUserInput {
  role: Extract<UserRole, 'student' | 'teacher'>
  firstName: string
  lastName: string
  studentNumber?: string
}

export interface EnrollStudentInput {
  subjectId: number
  studentId: number
}

export interface StudentDashboardData {
  user: User
  stats: {
    attendanceRate: number
    classesToday: number
    attendedCount: number
    lateCount: number
  }
  schedules: Array<Schedule & { subject: Subject }>
  activeSession: (AttendanceSession & { subject: Subject; room: string }) | null
  history: AttendanceHistoryItem[]
}

export interface TeacherDashboardData {
  user: User
  managedSubjects: Subject[]
  students: User[]
  subjectEnrollments: Array<{
    subjectId: number
    subjectCode: string
    subjectName: string
    students: User[]
  }>
  classes: Array<Schedule & { subject: Subject }>
  activeSession: (AttendanceSession & { subject: Subject; room: string }) | null
  recentRecords: Array<AttendanceHistoryItem & { studentName: string }>
  attendanceEntries: AttendanceManagementEntry[]
  report: {
    scheduleId: number
    subjectCode: string
    subjectName: string
    attendanceRate: number
    presentCount: number
    lateCount: number
  }[]
}

export interface AdminDashboardData {
  summary: {
    totalStudents: number
    totalTeachers: number
    totalSubjects: number
    attendanceRate: number
  }
  users: User[]
  teachers: User[]
  subjects: Subject[]
  schedules: Array<Schedule & { subject: Subject; teacherName: string }>
  sessions: Array<AttendanceSession & { subjectCode: string }>
  attendanceEntries: AttendanceManagementEntry[]
}

export interface LoginResponse {
  token: string
  user: User
}

export interface CheckInResponse {
  success: boolean
  message: string
  alreadyRecorded?: boolean
  record?: {
    id: number
    sessionId: number
    status: AttendanceStatus
    timeIn: string
  }
  session?: {
    subjectCode: string
    subjectName: string
    room: string
    validUntil: string
  }
}
