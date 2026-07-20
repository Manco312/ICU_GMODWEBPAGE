import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LoginForm } from '@/components/login-form'
import { ArrowLeft } from 'lucide-react'

export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <Image
        src="/republic-hero.png"
        alt=""
        fill
        priority
        className="object-cover opacity-20"
        aria-hidden
      />
      <div className="absolute inset-0 bg-background/80" />
      <div className="hud-grid absolute inset-0 opacity-60" aria-hidden />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          RETURN TO COMMAND NET
        </Link>

        <div className="clip-corner border border-border bg-card p-8">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/icu-emblem.png"
              alt="I.C.U emblem"
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
            />
            <p className="mt-4 font-mono text-[10px] tracking-[0.35em] text-primary">
              RESTRICTED // OFFICERS ONLY
            </p>
            <h1 className="mt-1 text-2xl font-bold uppercase tracking-wide text-foreground">
              Officer Authentication
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Command console access is limited to commissioned officers. Enlisted
              personnel and citizens do not require credentials.
            </p>
          </div>

          <div className="mt-6">
            <LoginForm />
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-[11px] leading-relaxed text-muted-foreground">
          Accounts are issued by High Command. There is no public registration.
        </p>
      </div>
    </div>
  )
}
