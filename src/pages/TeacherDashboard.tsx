import { useEffect, useMemo, useState } from 'react'
import { BarChart3, Copy, QrCode, TimerReset } from 'lucide-react'
import { AttendanceStatusManager } from '@/components/AttendanceStatusManager'
import { DashboardShell } from '@/components/DashboardShell'
import { EnrollmentManagerCard } from '@/components/EnrollmentManagerCard'
import { ScheduleManagerCard } from '@/components/ScheduleManagerCard'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { createSchedule, enrollStudent, getTeacherDashboard, openSession, updateAttendanceStatus } from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'
import { formatAttendanceRate, getStatusTone } from '@/utils/attendance'
import type { TeacherDashboardData } from '../../shared/types'

export default function TeacherDashboard() {
  const user = useAuthStore((state) => state.user)
  const [data, setData] = useState<TeacherDashboardData | null>(null)
  const [scheduleFeedback, setScheduleFeedback] = useState<string | null>(null)
  const [enrollmentFeedback, setEnrollmentFeedback] = useState<string | null>(null)
  const [attendanceFeedback, setAttendanceFeedback] = useState<string | null>(null)
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false)
  const [isEnrollingStudent, setIsEnrollingStudent] = useState(false)
  const [isSavingAttendance, setIsSavingAttendance] = useState(false)
  const tokenSegments = useMemo(
    () => data?.activeSession?.qrToken.split('-').filter(Boolean) ?? [],
    [data?.activeSession?.qrToken],
  )

  useEffect(() => {
    if (!user) {
      return
    }

    getTeacherDashboard(user.id).then(setData)
  }, [user])

  if (!user || !data) {
    return <div className="p-10 text-sm text-slate-500">Loading teacher dashboard...</div>
  }

  const refreshDashboard = async () => {
    const refreshed = await getTeacherDashboard(user.id)
    setData(refreshed)
  }

  const totals = data.report.reduce(
    (accumulator, item) => ({
      attendanceRate: Math.max(accumulator.attendanceRate, item.attendanceRate),
      presentCount: accumulator.presentCount + item.presentCount,
      lateCount: accumulator.lateCount + item.lateCount,
    }),
    { attendanceRate: 0, presentCount: 0, lateCount: 0 },
  )

  return (
    <DashboardShell title="Teacher Dashboard" subtitle="Open attendance sessions, share QR access, and monitor class participation.">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Assigned Classes" value={String(data.classes.length)} hint="Subjects currently handled by this faculty account" />
        <StatCard label="Present Records" value={String(totals.presentCount)} hint="Successful student attendance across sessions" />
        <StatCard label="Best Rate" value={formatAttendanceRate(totals.attendanceRate)} hint="Highest subject attendance performance" />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <ScheduleManagerCard
            title="Create schedules for your subjects"
            subtitle="Teachers can now add class schedule slots directly for the subjects they handle."
            subjects={data.managedSubjects}
            submitLabel="Add Schedule"
            isSubmitting={isCreatingSchedule}
            feedback={scheduleFeedback}
            onSubmit={async (payload) => {
              setIsCreatingSchedule(true)
              try {
                await createSchedule(user.role, user.id, payload)
                setScheduleFeedback('Schedule added successfully. Your class list has been refreshed.')
                await refreshDashboard()
              } catch (error) {
                const message = error instanceof Error ? error.message : 'Unable to create schedule'
                setScheduleFeedback(message)
              } finally {
                setIsCreatingSchedule(false)
              }
            }}
          />

          <EnrollmentManagerCard
            subjects={data.subjectEnrollments}
            availableStudents={data.students}
            isSubmitting={isEnrollingStudent}
            feedback={enrollmentFeedback}
            onEnroll={async (payload) => {
              setIsEnrollingStudent(true)
              try {
                await enrollStudent(user.role, user.id, payload)
                setEnrollmentFeedback('Student enrolled successfully. The roster and attendance controls have been refreshed.')
                await refreshDashboard()
              } catch (error) {
                const message = error instanceof Error ? error.message : 'Unable to enroll student'
                setEnrollmentFeedback(message)
              } finally {
                setIsEnrollingStudent(false)
              }
            }}
          />

          <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(14,42,87,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E73C7]">Class Sessions</p>
                <h2 className="mt-2 text-2xl font-black text-[#0E2A57]">Open attendance from your schedule</h2>
              </div>
              <TimerReset className="h-8 w-8 text-[#1F4E9B]" />
            </div>
            <div className="mt-6 max-h-[28rem] space-y-4 overflow-y-auto pr-1">
              {data.classes.map((item) => (
                <article key={item.id} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-black text-slate-900">{item.subject.code}</p>
                      <p className="text-sm text-slate-500">{item.subject.name}</p>
                    </div>
                    <button
                      onClick={async () => {
                        await openSession(item.id)
                        await refreshDashboard()
                      }}
                      className="rounded-2xl bg-[#F2B233] px-4 py-3 text-sm font-bold text-slate-950 transition hover:brightness-105"
                    >
                      Open session
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span>{item.dayOfWeek}</span>
                    <span>{item.startTime} - {item.endTime}</span>
                    <span>{item.room}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[32px] bg-gradient-to-br from-[#0E2A57] via-[#1F4E9B] to-[#3E73C7] p-6 text-white shadow-[0_20px_60px_rgba(14,42,87,0.24)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Active Session</p>
                <h2 className="mt-2 text-2xl font-black">Live QR attendance access</h2>
              </div>
              <QrCode className="h-8 w-8 text-[#F2B233]" />
            </div>
            {data.activeSession ? (
              <div className="mt-5 rounded-[28px] bg-white/10 p-5 backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-black">{data.activeSession.subject.code}</p>
                    <p className="text-sm text-blue-50">{data.activeSession.subject.name}</p>
                  </div>
                  <StatusBadge label={data.activeSession.status} tone={getStatusTone(data.activeSession.status)} />
                </div>
                <div className="mt-6 rounded-[28px] border border-dashed border-white/20 bg-[#0E2A57]/40 p-5 text-center">
                  <p className="text-xs uppercase tracking-[0.28em] text-blue-100">Demo QR Token</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {tokenSegments.map((segment, index) => (
                      <span
                        key={`${segment}-${index}`}
                        className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-black tracking-[0.18em] text-[#F2B233]"
                      >
                        {segment}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-blue-100">Share this token with the student dashboard or copy it directly for a clean demo flow.</p>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(data.activeSession?.qrToken ?? '')
                    }}
                    className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    <Copy className="h-3.5 w-3.5 text-[#F2B233]" />
                    Copy token
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-5 rounded-[24px] bg-white/10 px-4 py-4 text-sm text-blue-50">Open a class session to generate the current QR token.</p>
            )}
          </section>

          <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(14,42,87,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E73C7]">Subject Reports</p>
                <h2 className="mt-2 text-2xl font-black text-[#0E2A57]">Attendance performance</h2>
              </div>
              <BarChart3 className="h-8 w-8 text-[#1F4E9B]" />
            </div>
            <div className="mt-6 grid max-h-[28rem] gap-4 overflow-y-auto pr-1">
              {data.report.map((item) => (
                <article key={item.scheduleId} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-900">{item.subjectCode}</p>
                      <p className="text-sm text-slate-500">{item.subjectName}</p>
                    </div>
                    <StatusBadge label={`${item.attendanceRate}%`} tone="blue" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-600">
                    <span>Present: {item.presentCount}</span>
                    <span>Late: {item.lateCount}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-6">
        <AttendanceStatusManager
          title="Teacher-only attendance control"
          subtitle="Choose a subject, then edit attendance only for the students enrolled in that class."
          subjects={data.managedSubjects}
          entries={data.attendanceEntries}
          isSaving={isSavingAttendance}
          feedback={attendanceFeedback}
          onSave={async (entry, status) => {
            setIsSavingAttendance(true)
            try {
              await updateAttendanceStatus(user.role, user.id, {
                sessionId: entry.sessionId,
                studentId: entry.studentId,
                status,
              })
              setAttendanceFeedback(`Updated ${entry.studentName} to ${status}.`)
              await refreshDashboard()
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Unable to update attendance status'
              setAttendanceFeedback(message)
            } finally {
              setIsSavingAttendance(false)
            }
          }}
        />
      </div>
    </DashboardShell>
  )
}
