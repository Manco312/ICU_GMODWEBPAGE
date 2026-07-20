import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AnnouncementCard } from '@/components/announcement-card'
import type { Announcement } from '@/lib/types'
import { Flag, Scale, Swords, Target } from 'lucide-react'

export const dynamic = 'force-dynamic'

const doctrine = [
  {
    icon: Flag,
    title: 'Mandate',
    body: 'The I.C.U operates as a unified arm of the Grand Army of the Republic, sworn to defend the Galactic Senate, uphold the rule of law, and repel Separatist aggression across every sector.',
  },
  {
    icon: Swords,
    title: 'Doctrine',
    body: 'Combined-arms warfare. Battalions coordinate infantry, armor, air, and fleet assets under Jedi command to achieve decisive, disciplined victories with minimal loss of life.',
  },
  {
    icon: Scale,
    title: 'Code of Conduct',
    body: 'Every trooper answers to the chain of command. Loyalty, honor, and restraint define I.C.U forces. War crimes and dishonor are met with immediate tribunal.',
  },
  {
    icon: Target,
    title: 'Readiness',
    body: "All units maintain constant combat readiness. Regular army-wide and battalion operations keep the force sharp and prepared for deployment on a moment's notice.",
  },
]

export default async function GeneralPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
  const announcements = (data ?? []) as Announcement[]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14">
        <p className="font-mono text-xs tracking-[0.3em] text-primary">
          REPUBLIC BRIEFING
        </p>
        <h1 className="mt-2 text-4xl font-bold uppercase tracking-wide text-foreground">
          General Information
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          Standing orders, doctrine, and the founding principles of the I.C.U forces
          of the Galactic Republic. This node is open to all personnel and citizens.
        </p>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          {doctrine.map((d) => {
            const Icon = d.icon
            return (
              <div key={d.title} className="border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="text-lg font-bold uppercase tracking-wide text-foreground">
                    {d.title}
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {d.body}
                </p>
              </div>
            )
          })}
        </section>

        <section className="mt-16">
          <div className="mb-6 border-b border-border pb-3">
            <h2 className="text-2xl font-bold uppercase tracking-wide text-foreground">
              Command Directives Archive
            </h2>
            <p className="text-sm text-muted-foreground">
              Full log of transmissions from I.C.U High Command
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {announcements.length ? (
              announcements.map((a) => (
                <AnnouncementCard key={a.id} announcement={a} />
              ))
            ) : (
              <p className="font-mono text-sm text-muted-foreground">
                No directives archived.
              </p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
