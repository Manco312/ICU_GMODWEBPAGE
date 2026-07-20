import type { Announcement } from '@/lib/types'
import { formatDate } from '@/lib/format'
import { AlertTriangle, Megaphone, Radio } from 'lucide-react'

const config = {
  CRITICAL: {
    label: 'CRITICAL',
    icon: AlertTriangle,
    className: 'border-primary bg-primary/10 text-primary',
  },
  PRIORITY: {
    label: 'PRIORITY',
    icon: Radio,
    className: 'border-secondary bg-secondary/30 text-secondary-foreground',
  },
  STANDARD: {
    label: 'STANDARD',
    icon: Megaphone,
    className: 'border-border bg-muted text-muted-foreground',
  },
} as const

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const c = config[announcement.priority]
  const Icon = c.icon
  return (
    <article className="clip-corner border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest ${c.className}`}
        >
          <Icon className="h-3 w-3" />
          {c.label}
        </span>
        <time className="font-mono text-xs text-muted-foreground">
          {formatDate(announcement.created_at)}
        </time>
      </div>
      <h3 className="text-lg font-semibold uppercase tracking-wide text-foreground text-balance">
        {announcement.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {announcement.body}
      </p>
    </article>
  )
}
