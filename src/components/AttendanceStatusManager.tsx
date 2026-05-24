import { useEffect, useMemo, useState } from 'react'
import { ClipboardCheck } from 'lucide-react'
import type { AttendanceManagementEntry, AttendanceStatus, Subject } from '../../shared/types'

interface AttendanceStatusManagerProps {
  title: string
  subtitle: string
  subjects: Subject[]
  entries: AttendanceManagementEntry[]
  isSaving: boolean
  feedback?: string | null
  onSave: (entry: AttendanceManagementEntry, status: AttendanceStatus) => Promise<void>
}

const statusOptions: AttendanceStatus[] = ['present', 'late', 'absent']

export function AttendanceStatusManager({
  title,
  subtitle,
  subjects,
  entries,
  isSaving,
  feedback,
  onSave,
}: AttendanceStatusManagerProps) {
  const [draftStatuses, setDraftStatuses] = useState<Record<string, AttendanceStatus>>({})
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(subjects[0]?.id ?? 0)

  useEffect(() => {
    if (subjects.length === 0) {
      setSelectedSubjectId(0)
      return
    }

    setSelectedSubjectId((current) => (subjects.some((subject) => subject.id === current) ? current : subjects[0].id))
  }, [subjects])

  const filteredEntries = useMemo(() => {
    const latestEntries = new Map<number, AttendanceManagementEntry>()

    entries
      .filter((entry) => entry.subjectId === selectedSubjectId)
      .forEach((entry) => {
        const existing = latestEntries.get(entry.studentId)

        if (!existing) {
          latestEntries.set(entry.studentId, entry)
          return
        }

        const shouldReplace =
          (entry.sessionStatus === 'open' && existing.sessionStatus !== 'open')
          || (entry.sessionStatus === existing.sessionStatus && entry.sessionDate > existing.sessionDate)

        if (shouldReplace) {
          latestEntries.set(entry.studentId, entry)
        }
      })

    return Array.from(latestEntries.values()).sort((left, right) => left.studentName.localeCompare(right.studentName))
  }, [entries, selectedSubjectId])

  const selectedSubject = subjects.find((subject) => subject.id === selectedSubjectId) ?? null

  useEffect(() => {
    setDraftStatuses(
      Object.fromEntries(
        filteredEntries.map((entry) => [entry.entryKey, entry.status]),
      ),
    )
  }, [filteredEntries])

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

      <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,20rem)_1fr]">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Choose subject</span>
          <select
            value={selectedSubjectId}
            onChange={(event) => setSelectedSubjectId(Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.code} - {subject.name}
              </option>
            ))}
          </select>
        </label>
        <div className="rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          {selectedSubject
            ? `Editing attendance for ${selectedSubject.code}. Only enrolled students appear here.`
            : 'No subject selected.'}
        </div>
      </div>

      <div className="mt-6 max-h-[42rem] space-y-5 overflow-y-auto pr-1">
        {filteredEntries.length > 0 ? filteredEntries.map((entry) => (
          <article key={entry.entryKey} className="rounded-[24px] border border-slate-100 bg-slate-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-slate-900">{entry.studentName}</p>
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
        )) : (
          <div className="rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-5 text-sm text-slate-500">
            No enrolled students with attendance entries are available for this subject yet.
          </div>
        )}
      </div>

      {feedback ? <p className="mt-4 text-sm text-slate-500">{feedback}</p> : null}
    </section>
  )
}
