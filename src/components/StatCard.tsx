interface StatCardProps {
  label: string
  value: string
  hint: string
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <article className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(14,42,87,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E73C7]">{label}</p>
      <p className="mt-3 text-3xl font-black text-[#0E2A57]">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{hint}</p>
    </article>
  )
}
