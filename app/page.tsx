import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AnnouncementCard } from '@/components/announcement-card'
import { TrainingItem } from '@/components/training-item'
import { BattalionCard } from '@/components/battalion-card'
import { Button } from '@/components/ui/button'
import type { Announcement, Battalion, Training } from '@/lib/types'
import { ArrowRight, ShieldAlert } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: announcements }, { data: battalions }, { data: globalTrainings }] =
    await Promise.all([
      supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3),
      supabase.from('battalions').select('*').order('sort_order'),
      supabase
        .from('trainings')
        .select('*')
        .is('battalion_id', null)
        .order('scheduled_at'),
    ])

  const list = (battalions ?? []) as Battalion[]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <Image
          src="/republic-hero.png"
          alt="Clone troopers in formation aboard a Republic warship"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
          <span className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs tracking-widest text-primary">
            <ShieldAlert className="h-3.5 w-3.5" />
            REPUBLIC COMMAND NET // ACTIVE
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold uppercase leading-tight tracking-wide text-foreground text-balance md:text-6xl">
            I.C.U — Grand Army of the Republic
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            The unified command network of the I.C.U. forces. Review general
            directives, study battalion dossiers, and track Grand Army training
            operations across every front of the war.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/battalions">
                View Battalions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary/40 bg-transparent"
            >
              <Link href="/general">General Information</Link>
            </Button>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14">
        {/* ANNOUNCEMENTS */}
        <SectionHeading
          index="01"
          title="Command Directives"
          subtitle="Latest transmissions from I.C.U High Command"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {(announcements as Announcement[] | null)?.length ? (
            (announcements as Announcement[]).map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))
          ) : (
            <EmptyNote>No active directives on the net.</EmptyNote>
          )}
        </div>

        {/* GLOBAL TRAININGS */}
        <div className="mt-16">
          <SectionHeading
            index="02"
            title="Army-Wide Operations"
            subtitle="Training exercises mandatory across all battalions"
          />
          <div className="grid gap-3">
            {(globalTrainings as Training[] | null)?.length ? (
              (globalTrainings as Training[]).map((t) => (
                <TrainingItem key={t.id} training={t} />
              ))
            ) : (
              <EmptyNote>No army-wide operations scheduled.</EmptyNote>
            )}
          </div>
        </div>

        {/* BATTALIONS */}
        <div className="mt-16">
          <SectionHeading
            index="03"
            title="Battalions & Divisions"
            subtitle="Every unit under the I.C.U banner"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((b) => (
              <BattalionCard key={b.id} battalion={b} />
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

function SectionHeading({
  index,
  title,
  subtitle,
}: {
  index: string
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-3">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm text-primary">{index}</span>
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wide text-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
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
