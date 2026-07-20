import type { Training } from '@/lib/types'
import { formatDateTime, relativeCountdown } from '@/lib/format'
import { CalendarClock, Crosshair } from 'lucide-react'

export function TrainingItem({
  training,
  battalionName,
}: {
  training: Training
  battalionName?: string | null
}) {
  return (
    <article className="flex flex-col gap-3 border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
          <Crosshair className="h-4 w-4" />
        </span>
        <div>
          <h4 className="font-semibold uppercase tracking-wide text-foreground">
            {training.title}
          </h4>
          {training.description ? (
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {training.description}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="h-3 w-3" />
              {formatDateTime(training.scheduled_at)}
            </span>
            {battalionName ? (
              <span className="text-secondary-foreground">
                {'// '}
                {battalionName}
              </span>
            ) : (
              <span className="text-primary">{'// ALL BATTALIONS'}</span>
            )}
          </div>
        </div>
      </div>
      <span className="shrink-0 self-start border border-border bg-muted px-2 py-1 font-mono text-[11px] font-semibold tracking-widest text-foreground sm:self-center">
        {relativeCountdown(training.scheduled_at)}
      </span>
    </article>
  )
}
