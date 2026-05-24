import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, UserCircle2 } from 'lucide-react'
import { login } from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'

const demoAccountGroups = [
  {
    title: 'Students',
    accentClass: 'bg-emerald-50 text-emerald-700',
    accounts: [
      { label: 'Student', email: 'student@uphsl.edu' },
      { label: 'Student 2', email: 'student2@uphsl.edu' },
      { label: 'Student 3', email: 'student3@uphsl.edu' },
    ],
  },
  {
    title: 'Teachers',
    accentClass: 'bg-blue-50 text-[#1F4E9B]',
    accounts: [
      { label: 'Teacher', email: 'teacher@uphsl.edu' },
      { label: 'Teacher 2', email: 'teacher2@uphsl.edu' },
      { label: 'Teacher 3', email: 'teacher3@uphsl.edu' },
    ],
  },
  {
    title: 'Admin',
    accentClass: 'bg-amber-50 text-amber-700',
    accounts: [{ label: 'Admin', email: 'admin@uphsl.edu' }],
  },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [email, setEmail] = useState('student@uphsl.edu')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitLogin = async (submittedEmail: string, submittedPassword: string) => {
    setIsSubmitting(true)
    setError('')

    try {
      const result = await login(submittedEmail.trim(), submittedPassword.trim())
      setSession(result)
      navigate(`/${result.user.role}`)
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Unable to sign in'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submitLogin(email, password)
  }

  return (
    <div className="min-h-screen bg-[#F4F7FC] px-6 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[36px] bg-white shadow-[0_30px_80px_rgba(14,42,87,0.18)] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative overflow-hidden bg-[#0E2A57] p-8 text-white md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(62,115,199,0.45),_transparent_34%),radial-gradient(circle_at_bottom,_rgba(242,178,51,0.2),_transparent_30%)]" />
          <div className="relative space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.38em] text-blue-100">UPHSL Attendance Suite</p>
              <h1 className="mt-4 max-w-md text-4xl font-black leading-tight">Sign in to manage attendance in real time.</h1>
            </div>

            <div className="space-y-3 text-sm text-blue-100">
              <p>Use the demo accounts below or beside this form to open the student, teacher, or admin experience.</p>
              <p>Every role is connected to live Express endpoints using the UPHSL blue-and-gold design system.</p>
            </div>

            <div className="grid gap-4">
              {[
                'Automatic session creation from schedules',
                'QR-based student attendance flow',
                'Teacher monitoring and admin analytics',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center p-8 md:p-12">
          <div className="mx-auto w-full max-w-xl space-y-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#3E73C7]">Account Access</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">Welcome back</h2>
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <span className="font-semibold">Demo password</span>
                <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-amber-950 shadow-sm">password123</span>
              </div>
            </div>

            <div className="space-y-5">
              {demoAccountGroups.map((group) => (
                <section key={group.title} className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">{group.title}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${group.accentClass}`}>
                      {group.accounts.length} Account{group.accounts.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {group.accounts.map((account) => (
                      <article
                        key={account.label}
                        className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:border-[#3E73C7] hover:shadow-md"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="min-w-0">
                            <p className="text-lg font-bold text-slate-900">{account.label}</p>
                            <p className="mt-1 text-sm text-slate-500">{account.email}</p>
                          </div>

                          <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[260px]">
                            <button
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => {
                                setEmail(account.email)
                                setPassword('password123')
                              }}
                              className="min-h-11 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-semibold leading-tight text-slate-700 transition hover:border-[#3E73C7] hover:bg-white hover:text-[#1F4E9B] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Use Account
                            </button>
                            <button
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => submitLogin(account.email, 'password123')}
                              className="min-h-11 rounded-full bg-[#1F4E9B] px-4 py-2 text-center text-sm font-bold leading-tight text-white transition hover:bg-[#3E73C7] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Open Dashboard
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Email</span>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full bg-transparent px-3 py-4 text-sm outline-none"
                    placeholder="name@uphsl.edu"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Password</span>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                  <LockKeyhole className="h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-transparent px-3 py-4 text-sm outline-none"
                    placeholder="Enter password"
                  />
                </div>
              </label>

              {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F2B233] px-5 py-4 text-sm font-bold text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserCircle2 className="h-4 w-4" />
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
