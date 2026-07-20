import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { TrainingItem } from '@/components/training-item'
import type { Battalion, Officer, Training } from '@/lib/types'
import { ArrowLeft, ChevronsUp, ScrollText, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BattalionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: battalion } = await supabase
    .from('battalions')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!battalion) notFound()
  const unit = battalion as Battalion

  const [{ data: trainings }, { data: officers }] = await Promise.all([
    supabase
      .from('trainings')
      .select('*')
      .eq('battalion_id', unit.id)
      .order('scheduled_at'),
    supabase
      .from('officers')
      .select('*')
      .eq('battalion_id', unit.id)
      .order('created_at'),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Banner */}
      <section className="relative border-b border-border">
        <span
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ backgroundColor: unit.accent }}
          aria-hidden
        />
        <div className="hud-grid">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <Link
              href="/battalions"
              className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              ALL BATTALIONS
            </Link>
            <h1 className="mt-4 text-4xl font-bold uppercase tracking-wide text-foreground text-balance md:text-5xl">
              {unit.name}
            </h1>
            {unit.tagline ? (
              <p className="mt-2 text-lg italic text-primary">"{unit.tagline}"</p>
            ) : null}
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              {unit.description}
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-4 py-12 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          {/* Lore */}
          <section>
            <SubHeading icon={ScrollText}>Unit History</SubHeading>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {unit.lore}
            </p>
          </section>

          {/* Key figures */}
          <section>
            <SubHeading icon={Users}>Chain of Command</SubHeading>
            <div className="grid gap-3 sm:grid-cols-2">
              {unit.characters.map((c) => (
                <div key={c.name} className="border border-border bg-card p-4">
                  <p className="font-semibold uppercase tracking-wide text-foreground">
                    {c.name}
                  </p>
                  <p className="font-mono text-xs tracking-wider text-primary">
                    {c.role}
                  </p>
                  {c.note ? (
                    <p className="mt-2 text-sm text-muted-foreground">{c.note}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          {/* Operations */}
          <section>
            <SubHeading icon={ChevronsUp}>Scheduled Operations</SubHeading>
            <div className="grid gap-3">
              {(trainings as Training[] | null)?.length ? (
                (trainings as Training[]).map((t) => (
                  <TrainingItem key={t.id} training={t} battalionName={unit.name} />
                ))
              ) : (
                <p className="border border-dashed border-border bg-card/50 p-6 text-center font-mono text-sm text-muted-foreground">
                  No operations currently scheduled for this unit.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="border border-border bg-card p-5">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              RANK STRUCTURE
            </p>
            <ol className="mt-3 space-y-1.5">
              {unit.ranks.map((r, i) => (
                <li
                  key={r}
                  className="flex items-center gap-3 border-l-2 border-primary/40 pl-3 text-sm text-foreground"
                >
                  <span className="font-mono text-xs text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {r}
                </li>
              ))}
            </ol>
          </div>

          <div className="border border-border bg-card p-5">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              REGISTERED OFFICERS
            </p>
            {(officers as Officer[] | null)?.length ? (
              <ul className="mt-3 space-y-2">
                {(officers as Officer[]).map((o) => (
                  <li key={o.id} className="text-sm">
                    <span className="font-semibold text-foreground">{o.name}</span>
                    {o.rank ? (
                      <span className="ml-2 font-mono text-xs text-muted-foreground">
                        {o.rank}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No officers assigned on record.
              </p>
            )}
          </div>
        </aside>
      </main>

      <SiteFooter />
    </div>
  )
}

function SubHeading({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <h2 className="mb-4 flex items-center gap-2 border-b border-border pb-2 text-xl font-bold uppercase tracking-wide text-foreground">
      <Icon className="h-5 w-5 text-primary" />
      {children}
    </h2>
  )
}
