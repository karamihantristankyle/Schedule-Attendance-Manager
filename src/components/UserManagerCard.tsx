import { useState } from 'react'
import { UserPlus2 } from 'lucide-react'
import type { CreateUserInput } from '../../shared/types'

interface UserManagerCardProps {
  isSubmitting: boolean
  feedback?: string | null
  onSubmit: (payload: CreateUserInput) => Promise<void>
}

export function UserManagerCard({ isSubmitting, feedback, onSubmit }: UserManagerCardProps) {
  const [form, setForm] = useState({
    role: 'student' as CreateUserInput['role'],
    name: '',
    studentNumber: '',
  })

  const parseName = (value: string) => {
    const trimmedName = value.trim().replace(/\s+/g, ' ')
    const [firstName = '', ...rest] = trimmedName.split(' ')
    return {
      firstName,
      lastName: rest.join(' '),
    }
  }

  return (
    <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(14,42,87,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E73C7]">User Manager</p>
          <h2 className="mt-2 text-2xl font-black text-[#0E2A57]">Add students and teachers</h2>
          <p className="mt-2 text-sm text-slate-500">Admins can add teachers with name only, or add students with name plus student number. New accounts use the default password `password123`.</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1F4E9B]">
          <UserPlus2 className="h-6 w-6" />
        </div>
      </div>

      <form
        className="mt-6 grid gap-4 md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault()
          await onSubmit({
            role: form.role,
            ...parseName(form.name),
            studentNumber: form.role === 'student' ? form.studentNumber : '',
          })
          setForm({
            role: form.role,
            name: '',
            studentNumber: '',
          })
        }}
      >
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Role</span>
          <select
            value={form.role}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                role: event.target.value as CreateUserInput['role'],
                studentNumber: event.target.value === 'student' ? current.studentNumber : '',
              }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Name</span>
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
            placeholder={form.role === 'student' ? 'Andrea Santos' : 'Lia Ramos'}
          />
        </label>

        {form.role === 'student' ? (
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Student Number</span>
            <input
              value={form.studentNumber ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, studentNumber: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              placeholder="2024-00999"
            />
          </label>
        ) : null}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={
              isSubmitting
              || !form.name.trim()
              || (form.role === 'student' && !form.studentNumber?.trim())
            }
            className="inline-flex items-center rounded-2xl bg-[#1F4E9B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#3E73C7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : `Create ${form.role === 'student' ? 'Student' : 'Teacher'}`}
          </button>
          {feedback ? <p className="mt-3 text-sm text-slate-500">{feedback}</p> : null}
        </div>
      </form>
    </section>
  )
}
