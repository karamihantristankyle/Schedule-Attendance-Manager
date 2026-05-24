import { useEffect, useMemo, useState } from 'react'
import { GraduationCap } from 'lucide-react'
import type { User } from '../../shared/types'

interface SubjectEnrollmentGroup {
  subjectId: number
  subjectCode: string
  subjectName: string
  students: User[]
}

interface EnrollmentManagerCardProps {
  subjects: SubjectEnrollmentGroup[]
  availableStudents: User[]
  isSubmitting: boolean
  feedback?: string | null
  onEnroll: (payload: { subjectId: number; studentId: number }) => Promise<void>
}

const formatUserName = (user: User) => `${user.firstName} ${user.lastName}`.trim()

export function EnrollmentManagerCard({
  subjects,
  availableStudents,
  isSubmitting,
  feedback,
  onEnroll,
}: EnrollmentManagerCardProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(subjects[0]?.subjectId ?? 0)
  const [rosterSubjectId, setRosterSubjectId] = useState<number>(subjects[0]?.subjectId ?? 0)
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0)

  useEffect(() => {
    if (subjects.length === 0) {
      setSelectedSubjectId(0)
      return
    }

    setSelectedSubjectId((current) =>
      subjects.some((subject) => subject.subjectId === current) ? current : subjects[0].subjectId,
    )
    setRosterSubjectId((current) =>
      subjects.some((subject) => subject.subjectId === current) ? current : subjects[0].subjectId,
    )
  }, [subjects])

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.subjectId === selectedSubjectId) ?? null,
    [selectedSubjectId, subjects],
  )

  const selectedRosterSubject = useMemo(
    () => subjects.find((subject) => subject.subjectId === rosterSubjectId) ?? null,
    [rosterSubjectId, subjects],
  )

  const enrollableStudents = useMemo(() => {
    if (!selectedSubject) {
      return []
    }

    const enrolledIds = new Set(selectedSubject.students.map((student) => student.id))
    return availableStudents.filter((student) => !enrolledIds.has(student.id))
  }, [availableStudents, selectedSubject])

  useEffect(() => {
    if (enrollableStudents.length === 0) {
      setSelectedStudentId(0)
      return
    }

    setSelectedStudentId((current) =>
      enrollableStudents.some((student) => student.id === current) ? current : enrollableStudents[0].id,
    )
  }, [enrollableStudents])

  return (
    <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(14,42,87,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E73C7]">Enrollment Manager</p>
          <h2 className="mt-2 text-2xl font-black text-[#0E2A57]">Enroll students to your subjects</h2>
          <p className="mt-2 text-sm text-slate-500">Choose a subject, enroll students, and keep attendance limited to the students officially assigned to that class.</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1F4E9B]">
          <GraduationCap className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Subject</span>
          <select
            value={selectedSubjectId}
            onChange={(event) => setSelectedSubjectId(Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          >
            {subjects.map((subject) => (
              <option key={subject.subjectId} value={subject.subjectId}>
                {subject.subjectCode} - {subject.subjectName}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Student</span>
          <select
            value={selectedStudentId}
            onChange={(event) => setSelectedStudentId(Number(event.target.value))}
            disabled={enrollableStudents.length === 0}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enrollableStudents.length > 0 ? enrollableStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {formatUserName(student)}{student.studentNumber ? ` - ${student.studentNumber}` : ''}
              </option>
            )) : (
              <option value={0}>All available students are already enrolled</option>
            )}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          disabled={isSubmitting || !selectedSubject || selectedStudentId === 0}
          onClick={async () => {
            await onEnroll({ subjectId: selectedSubjectId, studentId: selectedStudentId })
          }}
          className="inline-flex items-center rounded-2xl bg-[#1F4E9B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3E73C7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : 'Enroll Student'}
        </button>
        {selectedSubject ? (
          <p className="text-sm text-slate-500">{selectedSubject.students.length} enrolled students in this subject</p>
        ) : null}
      </div>

      <div className="mt-6 rounded-[28px] border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <label className="w-full max-w-sm space-y-2">
            <span className="text-sm font-semibold text-slate-700">View enrolled students by subject</span>
            <select
              value={rosterSubjectId}
              onChange={(event) => setRosterSubjectId(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            >
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectCode} - {subject.subjectName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 max-h-[18rem] space-y-3 overflow-y-auto pr-1">
          {selectedRosterSubject?.students.length ? selectedRosterSubject.students.map((student) => (
            <article key={student.id} className="rounded-[20px] border border-slate-200 bg-white px-4 py-3">
              <p className="font-bold text-slate-900">{formatUserName(student)}</p>
              <p className="mt-1 text-sm text-slate-500">
                {student.studentNumber ? `${student.studentNumber} • ` : ''}{student.course ?? 'Student'}
              </p>
            </article>
          )) : (
            <p className="rounded-[20px] border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
              No students are enrolled in this subject yet.
            </p>
          )}
        </div>
      </div>

      {feedback ? <p className="mt-4 text-sm text-slate-500">{feedback}</p> : null}
    </section>
  )
}
