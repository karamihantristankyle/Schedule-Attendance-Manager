import { useEffect, useState } from 'react'
import { CalendarPlus } from 'lucide-react'
import type { CreateScheduleInput, Subject, User } from '../../shared/types'

interface ScheduleManagerCardProps {
  title: string
  subtitle: string
  subjects: Subject[]
  teachers?: User[]
  submitLabel: string
  isSubmitting: boolean
  feedback?: string | null
  onSubmit: (payload: CreateScheduleInput) => Promise<void>
}

const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function ScheduleManagerCard({
  title,
  subtitle,
  subjects,
  teachers,
  submitLabel,
  isSubmitting,
  feedback,
  onSubmit,
}: ScheduleManagerCardProps) {
  const [selectedTeacherId, setSelectedTeacherId] = useState<number>(teachers?.[0]?.id ?? 0)
  const [form, setForm] = useState<CreateScheduleInput>({
    subjectId: subjects[0]?.id ?? 0,
    room: '',
    dayOfWeek: 'Monday',
    startTime: '08:00',
    endTime: '09:30',
  })

  const filteredSubjects = teachers?.length
    ? subjects.filter((subject) => subject.teacherId === selectedTeacherId)
    : subjects

  useEffect(() => {
    if (teachers?.length) {
      setSelectedTeacherId((current) => current || teachers[0].id)
    }
  }, [teachers])

  useEffect(() => {
    if (filteredSubjects.length > 0) {
      setForm((current) => ({
        ...current,
        subjectId: filteredSubjects.some((subject) => subject.id === current.subjectId)
          ? current.subjectId
          : filteredSubjects[0].id,
      }))
    }
  }, [filteredSubjects])

  const selectedTeacher = teachers?.find((teacher) => teacher.id === selectedTeacherId)

  return (
    <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(14,42,87,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E73C7]">Schedule Manager</p>
          <h2 className="mt-2 text-2xl font-black text-[#0E2A57]">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1F4E9B]">
          <CalendarPlus className="h-6 w-6" />
        </div>
      </div>

      <form
        className="mt-6 grid gap-4 md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault()
          await onSubmit(form)
          setForm((current) => ({ ...current, room: '' }))
        }}
      >
        {teachers?.length ? (
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Teacher</span>
            <select
              value={selectedTeacherId}
              onChange={(event) => setSelectedTeacherId(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
            >
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {`${teacher.firstName} ${teacher.lastName}`.trim()}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Subject</span>
          <select
            value={form.subjectId}
            onChange={(event) => setForm((current) => ({ ...current, subjectId: Number(event.target.value) }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          >
            {filteredSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.code} - {subject.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Room</span>
          <input
            value={form.room}
            onChange={(event) => setForm((current) => ({ ...current, room: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
            placeholder="LAB 3"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Day</span>
          <select
            value={form.dayOfWeek}
            onChange={(event) => setForm((current) => ({ ...current, dayOfWeek: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          >
            {dayOptions.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Start</span>
            <input
              type="time"
              value={form.startTime}
              onChange={(event) => setForm((current) => ({ ...current, startTime: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">End</span>
            <input
              type="time"
              value={form.endTime}
              onChange={(event) => setForm((current) => ({ ...current, endTime: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
            />
          </label>
        </div>

        <div className="md:col-span-2">
          {selectedTeacher ? (
            <div className="mb-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-[#1F4E9B]">
              This schedule will appear under <span className="font-semibold">{`${selectedTeacher.firstName} ${selectedTeacher.lastName}`.trim()}</span>'s teacher dashboard.
            </div>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting || filteredSubjects.length === 0 || !form.room.trim()}
            className="inline-flex items-center rounded-2xl bg-[#F2B233] px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
          {feedback ? <p className="mt-3 text-sm text-slate-500">{feedback}</p> : null}
        </div>
      </form>
    </section>
  )
}
