import { type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

interface DashboardShellProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function DashboardShell({ title, subtitle, children }: DashboardShellProps) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-900">
      <div className="border-b border-[#d6e0f6] bg-[#0E2A57] text-white shadow-lg shadow-[#0E2A57]/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-100">UPHSL Attendance Suite</p>
            <h1 className="mt-2 text-2xl font-black">{title}</h1>
            <p className="mt-1 text-sm text-blue-100">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/" className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/90 transition hover:border-[#F2B233] hover:text-[#F2B233]">
              Home
            </Link>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
              <Shield className="h-4 w-4 text-[#F2B233]" />
              {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
            </div>
            <button className="rounded-full bg-[#F2B233] p-2 text-slate-950">
              <Bell className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                clearSession()
                navigate('/login')
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0E2A57] transition hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </div>
  )
}
