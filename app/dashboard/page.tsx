import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from './actions'
import { Button } from '@/components/ui/button'
import { TrainingManager } from '@/components/dashboard/training-manager'
import { AnnouncementManager } from '@/components/dashboard/announcement-manager'
import { OfficerManager } from '@/components/dashboard/officer-manager'
import type { Announcement, Battalion, Officer, Training } from '@/lib/types'
import { LogOut, ShieldAlert, Home } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: officerRow } = await supabase
    .from('officers')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // Authenticated but not on the officer roster — deny console access.
  if (!officerRow) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="clip-corner max-w-md border border-primary/50 bg-card p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 text-xl font-bold uppercase tracking-wide text-foreground">
            Clearance Denied
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your credentials are valid but you are not on the officer roster. Contact
            High Command for commissioning.
          </p>
          <form action={signOut} className="mt-6">
            <Button type="submit" variant="outline" className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Disconnect
            </Button>
          </form>
        </div>
      </div>
    )
  }

  const officer = officerRow as Officer
  const isAdmin = officer.role === 'ADMIN'

  const [{ data: battalions }, { data: trainings }, { data: announcements }, { data: officers }] =
    await Promise.all([
      supabase.from('battalions').select('*').order('sort_order'),
      supabase.from('trainings').select('*').order('scheduled_at'),
      supabase.from('announcements').select('*').order('created_at', { ascending: false }),
      isAdmin
        ? supabase.from('officers').select('*').order('created_at')
        : Promise.resolve({ data: [] as Officer[] }),
    ])

  const battalionList = (battalions ?? []) as Battalion[]
  const allTrainings = (trainings ?? []) as Training[]
  const myBattalion = battalionList.find((b) => b.id === officer.battalion_id)

  // Officers only manage their own battalion's operations; admins manage all.
  const managedTrainings = isAdmin
    ? allTrainings
    : allTrainings.filter((t) => t.battalion_id === officer.battalion_id)

  return (
    <div className="min-h-screen">
      {/* Console header */}
      <header className="border-b border-border bg-sidebar">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/icu-emblem.png"
              alt="I.C.U emblem"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-primary">
                OFFICER CONSOLE
              </p>
              <h1 className="text-lg font-bold uppercase tracking-wide text-foreground">
                {officer.name}
              </h1>
            </div>
            <span
              className={`ml-2 border px-2 py-1 font-mono text-[10px] font-semibold tracking-widest ${
                isAdmin
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-secondary bg-secondary/30 text-secondary-foreground'
              }`}
            >
              {isAdmin ? 'HIGH COMMAND' : 'OFFICER'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2 bg-transparent">
              <Link href="/">
                <Home className="h-4 w-4" />
                Command Net
              </Link>
            </Button>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm" className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Disconnect
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        <div className="border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? 'You hold High Command clearance. You may issue directives, schedule any operation, and commission officers.'
              : myBattalion
                ? `You are commissioned to the ${myBattalion.name}. You may schedule and manage operations for your unit.`
                : 'You are not currently assigned to a battalion. Contact High Command for assignment.'}
          </p>
        </div>

        <TrainingManager
          battalions={battalionList}
          trainings={managedTrainings}
          isAdmin={isAdmin}
          officerBattalionId={officer.battalion_id}
        />

        {isAdmin ? (
          <>
            <AnnouncementManager announcements={(announcements ?? []) as Announcement[]} />
            <OfficerManager
              officers={(officers ?? []) as Officer[]}
              battalions={battalionList}
              currentOfficerId={officer.id}
            />
          </>
        ) : null}
      </main>
    </div>
  )
}
