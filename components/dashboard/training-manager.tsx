'use client'

import { useActionState, useState } from 'react'
import { createTraining, deleteTraining } from '@/app/dashboard/actions'
import type { Battalion, Training } from '@/lib/types'
import { formatDateTime, relativeCountdown } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CalendarClock, Plus, Trash2 } from 'lucide-react'

export function TrainingManager({
  battalions,
  trainings,
  isAdmin,
  officerBattalionId,
}: {
  battalions: Battalion[]
  trainings: Training[]
  isAdmin: boolean
  officerBattalionId: string | null
}) {
  const [state, formAction, pending] = useActionState(createTraining, {})
  const bmap = new Map(battalions.map((b) => [b.id, b.name]))

  return (
    <section>
      <SectionTitle>Manage Operations</SectionTitle>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <form
          action={formAction}
          key={state.success}
          className="border border-border bg-card p-5 lg:col-span-2"
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground">
            <Plus className="h-4 w-4 text-primary" />
            Schedule Operation
          </h3>

          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required placeholder="Live-fire drill" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Briefing</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Details of the exercise…"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="scheduled_at">Scheduled Time</Label>
              <Input id="scheduled_at" name="scheduled_at" type="datetime-local" required />
            </div>

            {isAdmin ? (
              <div className="grid gap-2">
                <Label htmlFor="battalion_id">Assign To</Label>
                <Select name="battalion_id" defaultValue="GLOBAL">
                  <SelectTrigger id="battalion_id">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GLOBAL">Army-Wide (All Battalions)</SelectItem>
                    {battalions.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <input type="hidden" name="battalion_id" value={officerBattalionId ?? ''} />
            )}

            {state.error ? (
              <p className="border border-primary/50 bg-primary/10 px-3 py-2 text-sm text-primary">
                {state.error}
              </p>
            ) : null}
            {state.success ? (
              <p className="border border-secondary bg-secondary/20 px-3 py-2 text-sm text-secondary-foreground">
                {state.success}
              </p>
            ) : null}

            <Button type="submit" disabled={pending} className="gap-2">
              {pending ? 'Transmitting…' : 'Schedule'}
            </Button>
          </div>
        </form>

        {/* List */}
        <div className="lg:col-span-3">
          <div className="grid gap-3">
            {trainings.length ? (
              trainings.map((t) => (
                <div
                  key={t.id}
                  className="flex items-start justify-between gap-3 border border-border bg-card p-4"
                >
                  <div>
                    <h4 className="font-semibold uppercase tracking-wide text-foreground">
                      {t.title}
                    </h4>
                    {t.description ? (
                      <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 font-mono text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarClock className="h-3 w-3" />
                        {formatDateTime(t.scheduled_at)}
                      </span>
                      <span className={t.battalion_id ? 'text-secondary-foreground' : 'text-primary'}>
                        {t.battalion_id ? bmap.get(t.battalion_id) ?? 'Unit' : 'ALL BATTALIONS'}
                      </span>
                      <span>{relativeCountdown(t.scheduled_at)}</span>
                    </div>
                  </div>
                  <DeleteButton id={t.id} />
                </div>
              ))
            ) : (
              <p className="border border-dashed border-border bg-card/50 p-6 text-center font-mono text-sm text-muted-foreground">
                No operations under your command.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function DeleteButton({ id }: { id: string }) {
  const [busy, setBusy] = useState(false)
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={busy}
      onClick={async () => {
        setBusy(true)
        await deleteTraining(id)
        setBusy(false)
      }}
      className="shrink-0 text-muted-foreground hover:text-primary"
      aria-label="Cancel operation"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 border-b border-border pb-2 text-2xl font-bold uppercase tracking-wide text-foreground">
      {children}
    </h2>
  )
}
