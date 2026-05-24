import { CalendarDays, ChartColumnBig, ChevronRight, QrCode, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: CalendarDays,
    title: 'Schedule Sync',
    description: 'Pulls class schedules and prepares attendance sessions ahead of time.',
  },
  {
    icon: QrCode,
    title: 'QR Attendance',
    description: 'Lets teachers open secure QR-based attendance windows for each class.',
  },
  {
    icon: ChartColumnBig,
    title: 'Analytics',
    description: 'Highlights attendance trends, late counts, and class-level insights.',
  },
  {
    icon: ShieldCheck,
    title: 'Validation',
    description: 'Prevents duplicate check-ins and accepts only active class sessions.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(62,115,199,0.32),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(242,178,51,0.18),_transparent_30%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-blue-200">University of Perpetual Help</p>
            <h1 className="text-lg font-black tracking-wide text-white">Smart Attendance Monitoring</h1>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center rounded-full border border-[#F2B233]/60 bg-[#F2B233]/12 px-5 py-2 text-sm font-bold text-[#F2B233] transition hover:bg-[#F2B233] hover:text-slate-950"
          >
            Open Demo
          </Link>
        </header>

        <main className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-8">
            <div className="space-y-5">
              <h2 className="max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl">
                Automated attendance built for schedules, QR check-ins, and academic reporting.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
                This demo web app shows how a university can manage student attendance through synchronized schedules,
                secure attendance sessions, and role-based dashboards for students, teachers, and admins.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-[#F2B233] px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-950/30 transition hover:brightness-105"
              >
                Open Demo
                <ChevronRight className="h-4 w-4" />
              </Link>
              <a
                href="#feature-grid"
                className="inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-[#F2B233] hover:bg-white/5 hover:text-[#F2B233]"
              >
                Explore Features
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-black text-[#F2B233]">95%</p>
                <p className="mt-2 text-sm text-slate-300">Target attendance visibility across subjects and sessions.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-black text-[#F2B233]">3 Roles</p>
                <p className="mt-2 text-sm text-slate-300">Dedicated student, teacher, and admin dashboards.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-black text-[#F2B233]">Live Demo</p>
                <p className="mt-2 text-sm text-slate-300">Seeded API responses make the experience runnable immediately.</p>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-white/8 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
            <div className="rounded-[28px] bg-gradient-to-br from-[#0E2A57] via-[#1F4E9B] to-[#3E73C7] p-6">
              <div className="flex items-center justify-between rounded-3xl bg-white/10 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-blue-100">Demo Accounts</p>
                  <p className="mt-1 text-lg font-bold text-white">Use any role to explore the system</p>
                </div>
                <Users className="h-8 w-8 text-[#F2B233]" />
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ['Student', 'student@uphsl.edu', 'Dashboard, schedule, history'],
                  ['Student 2', 'student2@uphsl.edu', 'Additional student test account'],
                  ['Student 3', 'student3@uphsl.edu', 'Additional student test account'],
                  ['Teacher', 'teacher@uphsl.edu', 'Session control, reports, monitoring'],
                  ['Teacher 2', 'teacher2@uphsl.edu', 'Secondary teacher schedule and attendance tools'],
                  ['Teacher 3', 'teacher3@uphsl.edu', 'Third teacher account for admin subject assignment'],
                  ['Admin', 'admin@uphsl.edu', 'Analytics, users, schedules'],
                ].map(([role, email, desc]) => (
                  <div key={role} className="rounded-3xl bg-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{role}</p>
                        <p className="text-xs text-blue-100">{email}</p>
                      </div>
                      <p className="rounded-full bg-[#F2B233] px-3 py-1 text-xs font-bold text-slate-950">password123</p>
                    </div>
                    <p className="mt-3 text-sm text-blue-50">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <section id="feature-grid" className="grid gap-4 pb-10 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article key={feature.title} className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2B233] text-slate-950">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-black text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{feature.description}</p>
              </article>
            )
          })}
        </section>

        <footer className="border-t border-white/10 py-4 text-sm text-slate-400">
          Smart QR-Based Attendance Monitoring System integrated with scheduling and reporting.
        </footer>
      </div>
    </div>
  )
}
