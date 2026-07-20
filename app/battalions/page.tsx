import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BattalionCard } from '@/components/battalion-card'
import type { Battalion } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function BattalionsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('battalions').select('*').order('sort_order')
  const battalions = (data ?? []) as Battalion[]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14">
        <p className="font-mono text-xs tracking-[0.3em] text-primary">
          ORDER OF BATTLE
        </p>
        <h1 className="mt-2 text-4xl font-bold uppercase tracking-wide text-foreground">
          I.C.U Battalions
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
          Every division, corps, and squad serving under the I.C.U banner. Select a
          unit to review its dossier, chain of command, and active operations.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {battalions.map((b) => (
            <BattalionCard key={b.id} battalion={b} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
