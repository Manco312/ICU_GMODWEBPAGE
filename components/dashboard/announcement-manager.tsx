'use client'

import { useActionState, useState } from 'react'
import { createAnnouncement, deleteAnnouncement } from '@/app/dashboard/actions'
import type { Announcement } from '@/lib/types'
import { formatDate } from '@/lib/format'
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
import { Megaphone, Trash2 } from 'lucide-react'

export function AnnouncementManager({
  announcements,
}: {
  announcements: Announcement[]
}) {
  const [state, formAction, pending] = useActionState(createAnnouncement, {})

  return (
    <section>
      <h2 className="mb-5 border-b border-border pb-2 text-2xl font-bold uppercase tracking-wide text-foreground">
        Command Directives
      </h2>

      <div className="grid gap-6 lg:grid-cols-5">
        <form
          action={formAction}
          key={state.success}
          className="border border-border bg-card p-5 lg:col-span-2"
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground">
            <Megaphone className="h-4 w-4 text-primary" />
            Issue Directive
          </h3>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="a-title">Title</Label>
              <Input id="a-title" name="title" required placeholder="Muster order" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="a-body">Transmission</Label>
              <Textarea id="a-body" name="body" rows={4} required placeholder="Directive body…" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="a-priority">Priority</Label>
              <Select name="priority" defaultValue="STANDARD">
                <SelectTrigger id="a-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="PRIORITY">Priority</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

            <Button type="submit" disabled={pending}>
              {pending ? 'Transmitting…' : 'Transmit'}
            </Button>
          </div>
        </form>

        <div className="grid gap-3 lg:col-span-3">
          {announcements.length ? (
            announcements.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between gap-3 border border-border bg-card p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest text-muted-foreground">
                      {a.priority}
                    </span>
                    <time className="font-mono text-xs text-muted-foreground">
                      {formatDate(a.created_at)}
                    </time>
                  </div>
                  <h4 className="mt-2 font-semibold uppercase tracking-wide text-foreground">
                    {a.title}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                </div>
                <DeleteButton id={a.id} />
              </div>
            ))
          ) : (
            <p className="border border-dashed border-border bg-card/50 p-6 text-center font-mono text-sm text-muted-foreground">
              No directives on record.
            </p>
          )}
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
        await deleteAnnouncement(id)
        setBusy(false)
      }}
      className="shrink-0 text-muted-foreground hover:text-primary"
      aria-label="Rescind directive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
