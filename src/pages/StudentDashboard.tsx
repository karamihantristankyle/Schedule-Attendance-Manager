import { useEffect, useMemo, useState } from 'react'
import { CalendarClock, CheckCircle2, CircleCheckBig, Copy, QrCode, ScanLine, Sparkles } from 'lucide-react'
import { DashboardShell } from '@/components/DashboardShell'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { checkIn, getStudentDashboard } from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'
import { formatAttendanceRate, formatTime, getStatusTone } from '@/utils/attendance'
import type { CheckInResponse, StudentDashboardData } from '../../shared/types'

export default function StudentDashboard() {
  const user = useAuthStore((state) => state.user)
  const [data, setData] = useState<StudentDashboardData | null>(null)
  const [qrToken, setQrToken] = useState('')
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'info' | 'error'; content: string } | null>(null)
  const [checkInResult, setCheckInResult] = useState<CheckInResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      return
    }

    getStudentDashboard(user.id).then(setData)
  }, [user])

  useEffect(() => {
    if (data?.activeSession?.qrToken) {
      setQrToken(data.activeSession.qrToken)
    }
  }, [data?.activeSession?.qrToken])

  const tokenSegments = useMemo(() => qrToken.trim().toUpperCase().split('-').filter(Boolean), [qrToken])

  if (!user || !data) {
    return <div className="p-10 text-sm text-slate-500">Loading student dashboard...</div>
  }

  const stats = [
    { label: 'Attendance Rate', value: formatAttendanceRate(data.stats.attendanceRate), hint: 'Computed from recorded attendance sessions' },
    { label: 'Classes Today', value: String(data.stats.classesToday), hint: 'Sessions available on the current schedule' },
    { label: 'Present Records', value: String(data.stats.attendedCount), hint: 'Successful check-ins already recorded' },
    { label: 'Late Records', value: String(data.stats.lateCount), hint: 'Late arrivals for recorded sessions' },
  ]

  return (
    <DashboardShell title="Student Dashboard" subtitle="Track your classes, attendance history, and QR check-ins.">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <StatCard key={item.label} {...item} />
            ))}
          </section>

          <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(14,42,87,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E73C7]">Weekly Schedule</p>
                <h2 className="mt-2 text-2xl font-black text-[#0E2A57]">Your enrolled classes</h2>
              </div>
              <CalendarClock className="h-8 w-8 text-[#1F4E9B]" />
            </div>
            <div className="mt-6 grid gap-4">
              {data.schedules.map((item) => (
                <article key={item.id} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-black text-slate-900">{item.subject.code}</p>
                      <p className="text-sm text-slate-500">{item.subject.name}</p>
                    </div>
                    <StatusBadge label={item.dayOfWeek} tone="blue" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
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
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">QR Attendance</p>
                <h2 className="mt-2 text-2xl font-black">Check in to an open session</h2>
              </div>
              <QrCode className="h-8 w-8 text-[#F2B233]" />
            </div>
            <p className="mt-4 text-sm leading-6 text-blue-50">Use the live attendance token below or paste the one shown on the teacher dashboard. Repeat clicks will keep your attendance confirmed instead of failing.</p>
            <div className="mt-5 rounded-[28px] bg-white/10 p-5 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="text-sm font-semibold text-blue-50">Session Token</label>
                {data.activeSession ? (
                  <button
                    type="button"
                    onClick={() => setQrToken(data.activeSession?.qrToken ?? '')}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#F2B233]" />
                    Use Live Token
                  </button>
                ) : null}
              </div>
              {data.activeSession ? (
                <div className="mt-4 rounded-[24px] border border-white/15 bg-[#0E2A57]/35 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">{data.activeSession.subject.code}</p>
                      <p className="text-xs text-blue-100">{data.activeSession.subject.name} • {data.activeSession.room}</p>
                    </div>
                    <StatusBadge label={data.activeSession.status} tone={getStatusTone(data.activeSession.status)} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tokenSegments.map((segment) => (
                      <span
                        key={`${segment}-${tokenSegments.indexOf(segment)}`}
                        className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-black tracking-[0.18em] text-[#F2B233]"
                      >
                        {segment}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-blue-100">
                    <span>Valid until {formatTime(data.activeSession.validUntil)}</span>
                    <span>Tap Use Live Token to auto-fill</span>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-4 text-sm text-blue-100">
                  No open session yet. Ask the teacher to open attendance first.
                </div>
              )}
              <input
                value={qrToken}
                onChange={(event) => setQrToken(event.target.value)}
                className="mt-4 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 font-mono text-sm uppercase tracking-[0.18em] text-white outline-none placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-blue-100"
                placeholder="Enter active session token"
              />
              <button
                onClick={async () => {
                  setIsSubmitting(true)
                  setFeedback(null)
                  try {
                    const result = await checkIn(user.id, qrToken)
                    setCheckInResult(result)
                    setFeedback({
                      tone: result.alreadyRecorded ? 'info' : 'success',
                      content: result.alreadyRecorded
                        ? `${result.message} Your attendance is still counted.`
                        : `${result.message} Attendance saved successfully.`,
                    })
                    const refreshed = await getStudentDashboard(user.id)
                    setData(refreshed)
                  } catch (error) {
                    const message = error instanceof Error ? error.message : 'Unable to submit attendance'
                    setCheckInResult(null)
                    setFeedback({ tone: 'error', content: message })
                  } finally {
                    setIsSubmitting(false)
                  }
                }}
                disabled={isSubmitting || !qrToken.trim()}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#F2B233] px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ScanLine className="h-4 w-4" />
                {isSubmitting ? 'Checking in...' : 'Submit attendance'}
              </button>
              {feedback ? (
                <div
                  className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                    feedback.tone === 'success'
                      ? 'bg-emerald-400/15 text-emerald-100'
                      : feedback.tone === 'info'
                        ? 'bg-sky-400/15 text-sky-100'
                        : 'bg-red-400/15 text-red-100'
                  }`}
                >
                  {feedback.content}
                </div>
              ) : null}
              {checkInResult?.success && checkInResult.session && checkInResult.record ? (
                <div className="mt-4 rounded-[24px] border border-emerald-300/25 bg-emerald-400/10 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-300/20 text-emerald-100">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-100">
                        {checkInResult.alreadyRecorded ? 'Attendance Confirmed' : 'Attendance Captured'}
                      </p>
                      <p className="text-lg font-bold text-white">{checkInResult.session.subjectCode}</p>
                      <p className="text-sm text-emerald-50">
                        {checkInResult.session.subjectName} • {checkInResult.session.room}
                      </p>
                      <p className="text-sm text-emerald-100">
                        Marked {checkInResult.record.status} at {formatTime(checkInResult.record.timeIn)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
              <button
                type="button"
                onClick={async () => {
                  if (!qrToken.trim()) {
                    return
                  }
                  await navigator.clipboard.writeText(qrToken.trim().toUpperCase())
                  setFeedback({ tone: 'info', content: 'Token copied. You can paste it anywhere for the demo.' })
                }}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-blue-100 transition hover:text-white"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy current token
              </button>
            </div>
          </section>


          <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(14,42,87,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E73C7]">Attendance History</p>
                <h2 className="mt-2 text-2xl font-black text-[#0E2A57]">Recent records</h2>
              </div>
              <CircleCheckBig className="h-8 w-8 text-[#1F4E9B]" />
            </div>
            <div className="mt-6 space-y-4">
              {data.history.map((item) => (
                <article key={item.id} className="rounded-[24px] border border-slate-100 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">{item.subjectCode}</p>
                      <p className="text-sm text-slate-500">{item.subjectName}</p>
                    </div>
                    <StatusBadge label={item.status} tone={getStatusTone(item.status)} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                    <span>{item.sessionDate}</span>
                    <span>{item.room}</span>
                    <span>{formatTime(item.timeIn)}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  )
}
