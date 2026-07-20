'use client'

import { useActionState, useState } from 'react'
import { createOfficer, removeOfficer } from '@/app/dashboard/actions'
import type { Battalion, Officer } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserPlus, Trash2, ShieldCheck, Shield } from 'lucide-react'

export function OfficerManager({
  officers,
  battalions,
  currentOfficerId,
}: {
  officers: Officer[]
  battalions: Battalion[]
  currentOfficerId: string
}) {
  const [state, formAction, pending] = useActionState(createOfficer, {})
  const bmap = new Map(battalions.map((b) => [b.id, b.name]))

  return (
    <section>
      <h2 className="mb-5 border-b border-border pb-2 text-2xl font-bold uppercase tracking-wide text-foreground">
        Officer Roster
      </h2>
      <p className="-mt-3 mb-5 text-sm text-muted-foreground">
        Only officers hold accounts. Commission new officers here — enlisted personnel
        and citizens browse the public net without credentials.
      </p>

      <div className="grid gap-6 lg:grid-cols-5">
        <form
          action={formAction}
          key={state.success}
          className="border border-border bg-card p-5 lg:col-span-2"
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground">
            <UserPlus className="h-4 w-4 text-primary" />
            Commission Officer
          </h3>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="o-name">Name / Callsign</Label>
              <Input id="o-name" name="name" required placeholder="Commander Cody" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="o-email">Email (Login ID)</Label>
              <Input id="o-email" name="email" type="email" required placeholder="cody@icu.rep" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="o-password">Access Code</Label>
              <Input
                id="o-password"
                name="password"
                type="text"
                required
                placeholder="Min. 6 characters"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="o-rank">Rank</Label>
              <Input id="o-rank" name="rank" placeholder="Marshal Commander" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="o-role">Clearance</Label>
                <Select name="role" defaultValue="OFFICER">
                  <SelectTrigger id="o-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OFFICER">Officer</SelectItem>
                    <SelectItem value="ADMIN">High Command</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="o-battalion">Battalion</Label>
                <Select name="battalion_id" defaultValue="NONE">
                  <SelectTrigger id="o-battalion">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Unassigned</SelectItem>
                    {battalions.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              {pending ? 'Commissioning…' : 'Commission'}
            </Button>
          </div>
        </form>

        <div className="grid gap-3 lg:col-span-3">
          {officers.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between gap-3 border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center border ${
                    o.role === 'ADMIN'
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border bg-muted text-muted-foreground'
                  }`}
                >
                  {o.role === 'ADMIN' ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : (
                    <Shield className="h-4 w-4" />
                  )}
                </span>
                <div>
                  <p className="font-semibold uppercase tracking-wide text-foreground">
                    {o.name}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {o.rank ? `${o.rank} · ` : ''}
                    {o.battalion_id ? bmap.get(o.battalion_id) ?? 'Unit' : 'Unassigned'}
                    {o.role === 'ADMIN' ? ' · HIGH COMMAND' : ''}
                  </p>
                </div>
              </div>
              {o.id === currentOfficerId ? (
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                  YOU
                </span>
              ) : (
                <RemoveButton id={o.id} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RemoveButton({ id }: { id: string }) {
  const [busy, setBusy] = useState(false)
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={busy}
      onClick={async () => {
        setBusy(true)
        await removeOfficer(id)
        setBusy(false)
      }}
      className="shrink-0 text-muted-foreground hover:text-primary"
      aria-label="Decommission officer"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
