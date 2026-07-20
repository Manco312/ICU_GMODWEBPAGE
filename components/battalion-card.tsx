import Link from 'next/link'
import type { Battalion } from '@/lib/types'
import { ChevronRight } from 'lucide-react'

export function BattalionCard({ battalion }: { battalion: Battalion }) {
  return (
    <Link
      href={`/battalions/${battalion.slug}`}
      className="group relative flex flex-col overflow-hidden border border-border bg-card p-5 transition-colors hover:border-primary/60"
    >
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: battalion.accent }}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            UNIT DOSSIER
          </p>
          <h3 className="mt-1 text-xl font-semibold uppercase tracking-wide text-foreground text-balance">
            {battalion.name}
          </h3>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
      </div>
      {battalion.tagline ? (
        <p className="mt-1 text-sm italic text-primary/90">"{battalion.tagline}"</p>
      ) : null}
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {battalion.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {battalion.ranks.slice(0, 3).map((r) => (
          <span
            key={r}
            className="border border-border bg-muted px-2 py-0.5 font-mono text-[10px] tracking-wider text-muted-foreground"
          >
            {r}
          </span>
        ))}
      </div>
    </Link>
  )
}
