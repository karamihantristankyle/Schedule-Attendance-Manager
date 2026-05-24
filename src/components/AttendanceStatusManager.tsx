import { useEffect, useState } from 'react'
import { ClipboardCheck } from 'lucide-react'
import type { AttendanceManagementEntry, AttendanceStatus } from '../../shared/types'

interface AttendanceStatusManagerProps {
  title: string
  subtitle: string
  entries: AttendanceManagementEntry[]
  isSaving: boolean
  feedback?: string | null
  onSave: (entry: AttendanceManagementEntry, status: AttendanceStatus) => Promise<void>
}

const statusOptions: AttendanceStatus[] = ['present', 'late', 'absent']

export function AttendanceStatusManager({
  title,
  subtitle,
  entries,
  isSaving,
  feedback,
  onSave,
}: AttendanceStatusManagerProps) {
  const [draftStatuses, setDraftStatuses] = useState<Record<string, AttendanceStatus>>({})

  useEffect(() => {
    setDraftStatuses(
      Object.fromEntries(entries.map((entry) => [entry.entryKey, entry.status])),
    )
  }, [entries])

  return (
    <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(14,42,87,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E73C7]">Attendance Control</p>
          <h2 className="mt-2 text-2xl font-black text-[#0E2A57]">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1F4E9B]">
          <ClipboardCheck className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {entries.map((entry) => (
          <article key={entry.entryKey} className="rounded-[24px] border border-slate-100 bg-slate-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-slate-900">{entry.studentName}</p>
                <p className="text-sm text-slate-500">
                  {entry.subjectCode} • {entry.subjectName}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                  {entry.sessionDate} • {entry.room} • {entry.sessionStatus}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={draftStatuses[entry.entryKey] ?? entry.status}
                  onChange={(event) =>
                    setDraftStatuses((current) => ({
                      ...current,
                      [entry.entryKey]: event.target.value as AttendanceStatus,
                    }))
                  }
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => onSave(entry, draftStatuses[entry.entryKey] ?? entry.status)}
                  className="rounded-full bg-[#1F4E9B] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#3E73C7] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Save
                </button>
              </div>
            </div>
            <div className="mt-3 text-sm text-slate-500">
              {entry.timeIn ? `Recorded at ${new Date(entry.timeIn).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}` : 'No time-in yet. Saving will create or update the attendance record.'}
            </div>
          </article>
        ))}
      </div>

      {feedback ? <p className="mt-4 text-sm text-slate-500">{feedback}</p> : null}
    </section>
  )
}
