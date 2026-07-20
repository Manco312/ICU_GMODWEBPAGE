import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { TrainingItem } from '@/components/training-item'
import type { Battalion, Training } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function TrainingsPage() {
  const supabase = await createClient()

  const [{ data: trainings }, { data: battalions }] = await Promise.all([
    supabase.from('trainings').select('*').order('scheduled_at'),
    supabase.from('battalions').select('*').order('sort_order'),
  ])

  const all = (trainings ?? []) as Training[]
  const bmap = new Map((battalions as Battalion[] | null)?.map((b) => [b.id, b.name]))

  const upcoming = all.filter((t) => new Date(t.scheduled_at).getTime() > Date.now())
  const global = upcoming.filter((t) => !t.battalion_id)
  const perBattalion = upcoming.filter((t) => t.battalion_id)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14">
        <p className="font-mono text-xs tracking-[0.3em] text-primary">
          OPERATIONS BOARD
        </p>
        <h1 className="mt-2 text-4xl font-bold uppercase tracking-wide text-foreground">
          Training Operations
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          The full schedule of Grand Army training exercises. Army-wide operations
          are mandatory for all units; battalion operations are run by unit officers.
        </p>

        <section className="mt-10">
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold uppercase tracking-wide text-primary">
            Army-Wide Operations
          </h2>
          <div className="grid gap-3">
            {global.length ? (
              global.map((t) => <TrainingItem key={t.id} training={t} />)
            ) : (
              <EmptyNote>No army-wide operations scheduled.</EmptyNote>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 border-b border-border pb-2 text-xl font-bold uppercase tracking-wide text-foreground">
            Battalion Operations
          </h2>
          <div className="grid gap-3">
            {perBattalion.length ? (
              perBattalion.map((t) => (
                <TrainingItem
                  key={t.id}
                  training={t}
                  battalionName={bmap.get(t.battalion_id!) ?? 'Unknown Unit'}
                />
              ))
            ) : (
              <EmptyNote>No battalion operations scheduled.</EmptyNote>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="border border-dashed border-border bg-card/50 p-6 text-center font-mono text-sm text-muted-foreground">
      {children}
    </p>
  )
}
