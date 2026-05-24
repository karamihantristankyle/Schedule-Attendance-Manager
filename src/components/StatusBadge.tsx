import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  label: string
  tone: 'blue' | 'gold' | 'green' | 'slate'
}

const toneClassMap = {
  blue: 'bg-blue-100 text-[#1F4E9B]',
  gold: 'bg-amber-100 text-amber-700',
  green: 'bg-emerald-100 text-emerald-700',
  slate: 'bg-slate-100 text-slate-600',
}

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return <span className={cn('rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]', toneClassMap[tone])}>{label}</span>
}
