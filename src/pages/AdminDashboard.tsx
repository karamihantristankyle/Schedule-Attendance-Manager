import { useEffect, useState } from 'react'
import { BookOpenText, CalendarRange, ChartNoAxesCombined, UsersRound } from 'lucide-react'
import { DashboardShell } from '@/components/DashboardShell'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { SubjectManagerCard } from '@/components/SubjectManagerCard'
import { createSubject, getAdminDashboard } from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'
import { getStatusTone } from '@/utils/attendance'
import type { AdminDashboardData } from '../../shared/types'

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user)
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [subjectFeedback, setSubjectFeedback] = useState<string | null>(null)
  const [isCreatingSubject, setIsCreatingSubject] = useState(false)

  useEffect(() => {
    getAdminDashboard().then(setData)
  }, [])

  if (!data || !user) {
    return <div className="p-10 text-sm text-slate-500">Loading admin dashboard...</div>
  }

  const refreshDashboard = async () => {
    const refreshed = await getAdminDashboard()
    setData(refreshed)
  }

  const studentUsers = data.users.filter((entry) => entry.role === 'student')
  const teacherUsers = data.users.filter((entry) => entry.role === 'teacher')
  const adminUsers = data.users.filter((entry) => entry.role === 'admin')

  return (
    <DashboardShell title="Admin Dashboard" subtitle="Manage academic data, review analytics, and monitor attendance health.">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={String(data.summary.totalStudents)} hint="Active student accounts in the system" />
        <StatCard label="Teachers" value={String(data.summary.totalTeachers)} hint="Faculty members with managed classes" />
        <StatCard label="Subjects" value={String(data.summary.totalSubjects)} hint="Academic offerings linked to attendance" />
        <StatCard label="Attendance Rate" value={`${data.summary.attendanceRate}%`} hint="Present and late records across sessions" />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(14,42,87,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E73C7]">Users</p>
                <h2 className="mt-2 text-2xl font-black text-[#0E2A57]">Role overview</h2>
                <p className="mt-2 text-sm text-slate-500">View users in separate student, teacher, and admin groups instead of one long mixed list.</p>
              </div>
              <UsersRound className="h-8 w-8 text-[#1F4E9B]" />
            </div>
            <div className="mt-6 grid gap-4 xl:grid-cols-3">
              {[
                { title: 'Students', users: studentUsers, tone: 'green' as const },
                { title: 'Teachers', users: teacherUsers, tone: 'gold' as const },
                { title: 'Admins', users: adminUsers, tone: 'blue' as const },
              ].map((group) => (
                <section key={group.title} className="rounded-[28px] border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-black text-slate-900">{group.title}</h3>
                    <StatusBadge
                      label={`${group.users.length}`}
                      tone={group.tone}
                    />
                  </div>
                  <div className="mt-4 space-y-3">
                    {group.users.map((entry) => (
                      <article key={entry.id} className="rounded-[20px] border border-slate-200 bg-white px-4 py-3">
                        <p className="font-bold text-slate-900">{entry.firstName} {entry.lastName}</p>
                        <p className="mt-1 break-all text-sm text-slate-500">{entry.email}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <SubjectManagerCard
            teachers={data.teachers}
            isSubmitting={isCreatingSubject}
            feedback={subjectFeedback}
            onSubmit={async (payload) => {
              setIsCreatingSubject(true)
              try {
                await createSubject(user.role, user.id, payload)
                setSubjectFeedback(`Subject ${payload.code.toUpperCase()} created successfully and is now ready for scheduling.`)
                await refreshDashboard()
              } catch (error) {
                const message = error instanceof Error ? error.message : 'Unable to create subject'
                setSubjectFeedback(message)
              } finally {
                setIsCreatingSubject(false)
              }
            }}
          />

          <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(14,42,87,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E73C7]">Schedules</p>
                <h2 className="mt-2 text-2xl font-black text-[#0E2A57]">Academic timetable</h2>
              </div>
              <CalendarRange className="h-8 w-8 text-[#1F4E9B]" />
            </div>
            <div className="mt-6 grid gap-4">
              {data.schedules.map((item) => (
                <article key={item.id} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-900">{item.subject.code}</p>
                      <p className="text-sm text-slate-500">{item.subject.name}</p>
                    </div>
                    <StatusBadge label={item.dayOfWeek} tone="blue" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
                    <span>{item.teacherName}</span>
                    <span>{item.room}</span>
                    <span>{item.startTime} - {item.endTime}</span>
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
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Analytics</p>
                <h2 className="mt-2 text-2xl font-black">Attendance monitoring overview</h2>
              </div>
              <ChartNoAxesCombined className="h-8 w-8 text-[#F2B233]" />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] bg-white/10 p-5">
                <p className="text-sm text-blue-100">Attendance Efficiency</p>
                <p className="mt-3 text-4xl font-black text-[#F2B233]">{data.summary.attendanceRate}%</p>
                <p className="mt-2 text-sm text-blue-50">Combined present and late submissions from tracked sessions.</p>
              </div>
              <div className="rounded-[24px] bg-white/10 p-5">
                <p className="text-sm text-blue-100">Operational Scope</p>
                <p className="mt-3 text-4xl font-black text-[#F2B233]">{data.sessions.length}</p>
                <p className="mt-2 text-sm text-blue-50">Attendance sessions already created within the demo.</p>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(14,42,87,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E73C7]">Session Registry</p>
                <h2 className="mt-2 text-2xl font-black text-[#0E2A57]">Attendance sessions</h2>
              </div>
              <BookOpenText className="h-8 w-8 text-[#1F4E9B]" />
            </div>
            <div className="mt-6 space-y-4">
              {data.sessions.map((item) => (
                <article key={item.id} className="rounded-[24px] border border-slate-100 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">{item.subjectCode}</p>
                      <p className="text-sm text-slate-500">{item.sessionDate}</p>
                    </div>
                    <StatusBadge label={item.status} tone={getStatusTone(item.status)} />
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Token: {item.qrToken}</p>
                </article>
              ))}
            </div>
          </section>

        </div>
      </div>
    </DashboardShell>
  )
}
