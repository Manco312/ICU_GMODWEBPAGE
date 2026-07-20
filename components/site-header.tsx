import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ShieldCheck, LogIn } from 'lucide-react'

export async function SiteHeader() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-sidebar/90 backdrop-blur supports-[backdrop-filter]:bg-sidebar/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/icu-emblem.png"
            alt="I.C.U Republic emblem"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <div className="leading-none">
            <span className="block font-mono text-xs tracking-[0.35em] text-primary">
              I.C.U
            </span>
            <span className="block text-sm font-semibold tracking-widest text-foreground">
              GRAND ARMY NET
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/">Command</NavLink>
          <NavLink href="/general">General Info</NavLink>
          <NavLink href="/battalions">Battalions</NavLink>
          <NavLink href="/trainings">Operations</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild size="sm" className="gap-2">
              <Link href="/dashboard">
                <ShieldCheck className="h-4 w-4" />
                Officer Console
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="gap-2 border-primary/40 bg-transparent"
            >
              <Link href="/auth/login">
                <LogIn className="h-4 w-4" />
                Officer Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-sm px-3 py-2 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
    >
      {children}
    </Link>
  )
}
