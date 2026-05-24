import type {
  AttendanceRecord,
  AttendanceSession,
  DemoUser,
  Enrollment,
  Schedule,
  Subject,
} from '../../shared/types.js'

export interface AppData {
  users: DemoUser[]
  subjects: Subject[]
  schedules: Schedule[]
  enrollments: Enrollment[]
  sessions: AttendanceSession[]
  records: AttendanceRecord[]
}

const users: DemoUser[] = [
  {
    id: 1,
    firstName: 'Andrea',
    lastName: 'Santos',
    email: 'student@uphsl.edu',
    password: 'password123',
    role: 'student',
    studentNumber: '22-1975-239',
    course: 'BS Information Technology',
    yearLevel: 4,
  },
  {
    id: 2,
    firstName: 'Miguel',
    lastName: 'Reyes',
    email: 'teacher@uphsl.edu',
    password: 'password123',
    role: 'teacher',
    employeeNumber: 'FAC-0204',
  },
  {
    id: 3,
    firstName: 'Cecilia',
    lastName: 'Navarro',
    email: 'admin@uphsl.edu',
    password: 'password123',
    role: 'admin',
    employeeNumber: 'ADM-0001',
  },
  {
    id: 4,
    firstName: 'Paolo',
    lastName: 'Mendoza',
    email: 'student2@uphsl.edu',
    password: 'password123',
    role: 'student',
    studentNumber: '22-1975-240',
    course: 'BS Information Technology',
    yearLevel: 3,
  },
  {
    id: 5,
    firstName: 'Jasmine',
    lastName: 'Cruz',
    email: 'student3@uphsl.edu',
    password: 'password123',
    role: 'student',
    studentNumber: '22-1975-241',
    course: 'BS Computer Science',
    yearLevel: 2,
  },
  {
    id: 6,
    firstName: 'Lara',
    lastName: 'Villanueva',
    email: 'teacher2@uphsl.edu',
    password: 'password123',
    role: 'teacher',
    employeeNumber: 'FAC-0205',
  },
  {
    id: 7,
    firstName: 'Noel',
    lastName: 'Garcia',
    email: 'teacher3@uphsl.edu',
    password: 'password123',
    role: 'teacher',
    employeeNumber: 'FAC-0206',
  },
  {
    id: 8,
    firstName: 'Sofia',
    lastName: 'Martinez',
    email: 'teacher4@uphsl.edu',
    password: 'password123',
    role: 'teacher',
    employeeNumber: 'FAC-0207',
  },
  {
    id: 9,
    firstName: 'Daniel',
    lastName: 'Bautista',
    email: 'teacher5@uphsl.edu',
    password: 'password123',
    role: 'teacher',
    employeeNumber: 'FAC-0208',
  },
  {
    id: 10,
    firstName: 'Karen',
    lastName: 'Dela Cruz',
    email: 'teacher6@uphsl.edu',
    password: 'password123',
    role: 'teacher',
    employeeNumber: 'FAC-0209',
  },
  {
    id: 11,
    firstName: 'Jerome',
    lastName: 'Castillo',
    email: 'teacher7@uphsl.edu',
    password: 'password123',
    role: 'teacher',
    employeeNumber: 'FAC-0210',
  },
  {
    id: 12,
    firstName: 'Patricia',
    lastName: 'Aquino',
    email: 'teacher8@uphsl.edu',
    password: 'password123',
    role: 'teacher',
    employeeNumber: 'FAC-0211',
  },
  {
    id: 13,
    firstName: 'Vincent',
    lastName: 'Flores',
    email: 'teacher9@uphsl.edu',
    password: 'password123',
    role: 'teacher',
    employeeNumber: 'FAC-0212',
  },
  {
    id: 14,
    firstName: 'Mae',
    lastName: 'Gonzales',
    email: 'teacher10@uphsl.edu',
    password: 'password123',
    role: 'teacher',
    employeeNumber: 'FAC-0213',
  },
  {
    id: 15,
    firstName: 'Bianca',
    lastName: 'Ramos',
    email: 'student4@uphsl.edu',
    password: 'password123',
    role: 'student',
    studentNumber: '22-1975-242',
    course: 'BS Information Technology',
    yearLevel: 4,
  },
  {
    id: 16,
    firstName: 'Ethan',
    lastName: 'Lopez',
    email: 'student5@uphsl.edu',
    password: 'password123',
    role: 'student',
    studentNumber: '22-1975-243',
    course: 'BS Computer Science',
    yearLevel: 1,
  },
  {
    id: 17,
    firstName: 'Nicole',
    lastName: 'Fernandez',
    email: 'student6@uphsl.edu',
    password: 'password123',
    role: 'student',
    studentNumber: '22-1975-244',
    course: 'BS Information Systems',
    yearLevel: 2,
  },
  {
    id: 18,
    firstName: 'Carl',
    lastName: 'Domingo',
    email: 'student7@uphsl.edu',
    password: 'password123',
    role: 'student',
    studentNumber: '22-1975-245',
    course: 'BS Information Technology',
    yearLevel: 3,
  },
  {
    id: 19,
    firstName: 'Angela',
    lastName: 'Rivera',
    email: 'student8@uphsl.edu',
    password: 'password123',
    role: 'student',
    studentNumber: '22-1975-246',
    course: 'BS Computer Science',
    yearLevel: 4,
  },
  {
    id: 20,
    firstName: 'Mark',
    lastName: 'Salazar',
    email: 'student9@uphsl.edu',
    password: 'password123',
    role: 'student',
    studentNumber: '22-1975-247',
    course: 'BS Information Systems',
    yearLevel: 2,
  },
  {
    id: 21,
    firstName: 'Trisha',
    lastName: 'Torres',
    email: 'student10@uphsl.edu',
    password: 'password123',
    role: 'student',
    studentNumber: '22-1975-248',
    course: 'BS Information Technology',
    yearLevel: 1,
  },
]

const subjects: Subject[] = [
  { id: 1, code: 'IT 401', name: 'Systems Integration', teacherId: 2 },
  { id: 2, code: 'IT 402', name: 'Capstone Project', teacherId: 2 },
  { id: 3, code: 'CS 210', name: 'Data Structures', teacherId: 6 },
  { id: 4, code: 'IT 305', name: 'Database Management', teacherId: 7 },
  { id: 5, code: 'CS 220', name: 'Object-Oriented Programming', teacherId: 8 },
  { id: 6, code: 'IT 310', name: 'Human Computer Interaction', teacherId: 9 },
  { id: 7, code: 'IS 201', name: 'Business Process Management', teacherId: 10 },
  { id: 8, code: 'NET 205', name: 'Computer Networks', teacherId: 11 },
  { id: 9, code: 'SE 330', name: 'Software Engineering', teacherId: 12 },
  { id: 10, code: 'IT 415', name: 'Information Assurance', teacherId: 13 },
]

const schedules: Schedule[] = [
  { id: 1, subjectId: 1, room: 'LAB 2', dayOfWeek: 'Monday', startTime: '08:00', endTime: '09:30' },
  { id: 2, subjectId: 2, room: 'ROOM 305', dayOfWeek: 'Wednesday', startTime: '10:00', endTime: '11:30' },
  { id: 3, subjectId: 3, room: 'LAB 4', dayOfWeek: 'Tuesday', startTime: '13:00', endTime: '14:30' },
  { id: 4, subjectId: 4, room: 'ROOM 204', dayOfWeek: 'Thursday', startTime: '15:00', endTime: '16:30' },
  { id: 5, subjectId: 5, room: 'LAB 1', dayOfWeek: 'Friday', startTime: '09:00', endTime: '10:30' },
  { id: 6, subjectId: 6, room: 'ROOM 210', dayOfWeek: 'Monday', startTime: '11:00', endTime: '12:30' },
  { id: 7, subjectId: 7, room: 'ROOM 402', dayOfWeek: 'Tuesday', startTime: '16:00', endTime: '17:30' },
  { id: 8, subjectId: 8, room: 'LAB 5', dayOfWeek: 'Wednesday', startTime: '08:30', endTime: '10:00' },
  { id: 9, subjectId: 9, room: 'ROOM 118', dayOfWeek: 'Thursday', startTime: '12:30', endTime: '14:00' },
  { id: 10, subjectId: 10, room: 'LAB 3', dayOfWeek: 'Friday', startTime: '14:30', endTime: '16:00' },
]

const sessions: AttendanceSession[] = [
  {
    id: 1,
    scheduleId: 1,
    sessionDate: '2026-05-24',
    openedAt: '2026-05-24T07:55:00.000Z',
    closedAt: null,
    validFrom: '2026-05-24T07:55:00.000Z',
    validUntil: '2026-05-24T08:20:00.000Z',
    qrToken: 'UPHSL-IT401-0524',
    status: 'open',
  },
  {
    id: 2,
    scheduleId: 2,
    sessionDate: '2026-05-21',
    openedAt: '2026-05-21T09:58:00.000Z',
    closedAt: '2026-05-21T10:22:00.000Z',
    validFrom: '2026-05-21T09:58:00.000Z',
    validUntil: '2026-05-21T10:20:00.000Z',
    qrToken: 'UPHSL-IT402-0521',
    status: 'closed',
  },
  {
    id: 3,
    scheduleId: 3,
    sessionDate: '2026-05-24',
    openedAt: '2026-05-24T12:55:00.000Z',
    closedAt: null,
    validFrom: '2026-05-24T12:55:00.000Z',
    validUntil: '2026-05-24T13:20:00.000Z',
    qrToken: 'UPHSL-CS210-0524',
    status: 'open',
  },
  {
    id: 4,
    scheduleId: 4,
    sessionDate: '2026-05-22',
    openedAt: '2026-05-22T14:58:00.000Z',
    closedAt: '2026-05-22T15:25:00.000Z',
    validFrom: '2026-05-22T14:58:00.000Z',
    validUntil: '2026-05-22T15:20:00.000Z',
    qrToken: 'UPHSL-IT305-0522',
    status: 'closed',
  },
  {
    id: 5,
    scheduleId: 5,
    sessionDate: '2026-05-23',
    openedAt: '2026-05-23T08:55:00.000Z',
    closedAt: '2026-05-23T10:05:00.000Z',
    validFrom: '2026-05-23T08:55:00.000Z',
    validUntil: '2026-05-23T09:20:00.000Z',
    qrToken: 'UPHSL-CS220-0523',
    status: 'closed',
  },
  {
    id: 6,
    scheduleId: 6,
    sessionDate: '2026-05-24',
    openedAt: '2026-05-24T10:55:00.000Z',
    closedAt: null,
    validFrom: '2026-05-24T10:55:00.000Z',
    validUntil: '2026-05-24T11:20:00.000Z',
    qrToken: 'UPHSL-IT310-0524',
    status: 'open',
  },
  {
    id: 7,
    scheduleId: 7,
    sessionDate: '2026-05-20',
    openedAt: '2026-05-20T15:55:00.000Z',
    closedAt: '2026-05-20T17:10:00.000Z',
    validFrom: '2026-05-20T15:55:00.000Z',
    validUntil: '2026-05-20T16:20:00.000Z',
    qrToken: 'UPHSL-IS201-0520',
    status: 'closed',
  },
  {
    id: 8,
    scheduleId: 8,
    sessionDate: '2026-05-24',
    openedAt: '2026-05-24T08:25:00.000Z',
    closedAt: null,
    validFrom: '2026-05-24T08:25:00.000Z',
    validUntil: '2026-05-24T08:50:00.000Z',
    qrToken: 'UPHSL-NET205-0524',
    status: 'open',
  },
  {
    id: 9,
    scheduleId: 9,
    sessionDate: '2026-05-22',
    openedAt: '2026-05-22T12:25:00.000Z',
    closedAt: '2026-05-22T13:40:00.000Z',
    validFrom: '2026-05-22T12:25:00.000Z',
    validUntil: '2026-05-22T12:50:00.000Z',
    qrToken: 'UPHSL-SE330-0522',
    status: 'closed',
  },
  {
    id: 10,
    scheduleId: 10,
    sessionDate: '2026-05-24',
    openedAt: '2026-05-24T14:25:00.000Z',
    closedAt: null,
    validFrom: '2026-05-24T14:25:00.000Z',
    validUntil: '2026-05-24T14:50:00.000Z',
    qrToken: 'UPHSL-IT415-0524',
    status: 'open',
  },
]

const studentUsers = users.filter((user) => user.role === 'student')

const enrollmentPairs: Array<[number, number]> = [
  [1, 1],
  [2, 1],
  [1, 4],
  [3, 4],
  [2, 5],
  [4, 5],
]

studentUsers.forEach((student, index) => {
  const subjectIds = [((index + 2) % 10) + 1, ((index + 5) % 10) + 1, ((index + 7) % 10) + 1]
  subjectIds.forEach((subjectId) => {
    enrollmentPairs.push([subjectId, student.id])
  })
})

const uniqueEnrollmentKeys = new Set<string>()
const enrollments: Enrollment[] = []

enrollmentPairs.forEach(([subjectId, studentId]) => {
  const key = `${subjectId}-${studentId}`
  if (uniqueEnrollmentKeys.has(key)) {
    return
  }

  uniqueEnrollmentKeys.add(key)
  enrollments.push({
    id: enrollments.length + 1,
    subjectId,
    studentId,
    status: 'active',
  })
})

const records: AttendanceRecord[] = [
  {
    id: 1,
    attendanceSessionId: 2,
    studentId: 1,
    timeIn: '2026-05-21T10:03:00.000Z',
    status: 'present',
  },
  {
    id: 2,
    attendanceSessionId: 1,
    studentId: 4,
    timeIn: '2026-05-24T08:06:00.000Z',
    status: 'late',
  },
  {
    id: 3,
    attendanceSessionId: 4,
    studentId: 5,
    timeIn: '2026-05-22T15:01:00.000Z',
    status: 'present',
  },
  {
    id: 4,
    attendanceSessionId: 5,
    studentId: 15,
    timeIn: '2026-05-23T09:02:00.000Z',
    status: 'present',
  },
  {
    id: 5,
    attendanceSessionId: 6,
    studentId: 16,
    timeIn: '2026-05-24T11:08:00.000Z',
    status: 'present',
  },
  {
    id: 6,
    attendanceSessionId: 7,
    studentId: 17,
    timeIn: '2026-05-20T16:11:00.000Z',
    status: 'late',
  },
  {
    id: 7,
    attendanceSessionId: 8,
    studentId: 18,
    timeIn: '2026-05-24T08:41:00.000Z',
    status: 'late',
  },
  {
    id: 8,
    attendanceSessionId: 9,
    studentId: 19,
    timeIn: '2026-05-22T12:39:00.000Z',
    status: 'present',
  },
  {
    id: 9,
    attendanceSessionId: 10,
    studentId: 20,
    timeIn: '2026-05-24T14:39:00.000Z',
    status: 'present',
  },
]

export const createSeedData = (): AppData => ({
  users: structuredClone(users),
  subjects: structuredClone(subjects),
  schedules: structuredClone(schedules),
  enrollments: structuredClone(enrollments),
  sessions: structuredClone(sessions),
  records: structuredClone(records),
})
