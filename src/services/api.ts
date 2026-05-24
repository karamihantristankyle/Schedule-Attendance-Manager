import type {
  AdminDashboardData,
  AttendanceManagementEntry,
  CheckInResponse,
  CreateScheduleInput,
  CreateSubjectInput,
  CreateUserInput,
  LoginResponse,
  StudentDashboardData,
  TeacherDashboardData,
  UserRole,
} from '../../shared/types'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed')
  }

  return data as T
}

export const login = (email: string, password: string) =>
  request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const getStudentDashboard = (studentId: number) => request<StudentDashboardData>(`/api/analytics/student/${studentId}`)

export const getTeacherDashboard = (teacherId: number) => request<TeacherDashboardData>(`/api/attendance/teacher/${teacherId}`)

export const getAdminDashboard = () => request<AdminDashboardData>('/api/analytics/admin/overview')

export const openSession = (scheduleId: number) =>
  request('/api/attendance/open', {
    method: 'POST',
    body: JSON.stringify({ scheduleId }),
  })

export const createSchedule = (role: UserRole, actorId: number, payload: CreateScheduleInput) =>
  request<{ success: boolean; message: string }>('/api/schedules', {
    method: 'POST',
    body: JSON.stringify({ role, actorId, ...payload }),
  })

export const createSubject = (role: UserRole, actorId: number, payload: CreateSubjectInput) =>
  request<{ success: boolean; message: string }>('/api/subjects', {
    method: 'POST',
    body: JSON.stringify({ role, actorId, ...payload }),
  })

export const createUser = (role: UserRole, actorId: number, payload: CreateUserInput) =>
  request<{ success: boolean; message: string; user: { email: string; firstName: string; lastName: string } }>('/api/users', {
    method: 'POST',
    body: JSON.stringify({ role, actorId, userRole: payload.role, ...payload }),
  })

export const checkIn = (studentId: number, qrToken: string) =>
  request<CheckInResponse>('/api/attendance/checkin', {
    method: 'POST',
    body: JSON.stringify({ studentId, qrToken }),
  })

export const updateAttendanceStatus = (
  role: UserRole,
  actorId: number,
  payload: Pick<AttendanceManagementEntry, 'sessionId' | 'studentId'> & { status: AttendanceManagementEntry['status'] },
) =>
  request<{ success: boolean; message: string }>('/api/attendance/status', {
    method: 'PATCH',
    body: JSON.stringify({ role, actorId, ...payload }),
  })
