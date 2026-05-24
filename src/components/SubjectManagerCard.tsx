import { useEffect, useState } from 'react'
import { BookPlus } from 'lucide-react'
import type { CreateSubjectInput, User } from '../../shared/types'

interface SubjectManagerCardProps {
  teachers: User[]
  isSubmitting: boolean
  feedback?: string | null
  onSubmit: (payload: CreateSubjectInput) => Promise<void>
}

export function SubjectManagerCard({
  teachers,
  isSubmitting,
  feedback,
  onSubmit,
}: SubjectManagerCardProps) {
  const [form, setForm] = useState<CreateSubjectInput>({
    code: '',
    name: '',
    teacherId: teachers[0]?.id ?? 0,
  })

  useEffect(() => {
    if (teachers.length > 0) {
      setForm((current) => ({
        ...current,
        teacherId: current.teacherId || teachers[0].id,
      }))
    }
  }, [teachers])

  return (
    <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(14,42,87,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E73C7]">Subject Manager</p>
          <h2 className="mt-2 text-2xl font-black text-[#0E2A57]">Add more subjects</h2>
          <p className="mt-2 text-sm text-slate-500">Create a new subject and assign it to a teacher so it can be used in the schedule manager right away.</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1F4E9B]">
          <BookPlus className="h-6 w-6" />
        </div>
      </div>

      <form
        className="mt-6 grid gap-4 md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault()
          await onSubmit(form)
          setForm((current) => ({ ...current, code: '', name: '' }))
        }}
      >
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Subject Code</span>
          <input
            value={form.code}
            onChange={(event) => setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
            placeholder="IT 403"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Assigned Teacher</span>
          <select
            value={form.teacherId}
            onChange={(event) => setForm((current) => ({ ...current, teacherId: Number(event.target.value) }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          >
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Subject Name</span>
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
            placeholder="Network Security"
          />
        </label>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting || teachers.length === 0 || !form.code.trim() || !form.name.trim()}
            className="inline-flex items-center rounded-2xl bg-[#1F4E9B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3E73C7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Create Subject'}
          </button>
          {feedback ? <p className="mt-3 text-sm text-slate-500">{feedback}</p> : null}
        </div>
      </form>
    </section>
  )
}
