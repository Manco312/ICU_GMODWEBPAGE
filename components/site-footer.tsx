export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-sidebar">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-center text-xs text-muted-foreground">
        <p className="font-mono tracking-widest text-primary">
          {'// ENCRYPTED REPUBLIC COMMAND NET // CLEARANCE VARIES BY NODE //'}
        </p>
        <p>
          Property of the Grand Army of the Republic — I.C.U Command. Unauthorized
          access to restricted nodes is a violation of the Military Creation Act.
        </p>
        <p className="text-muted-foreground/60">
          For the Republic. For the Chancellor. For the galaxy.
        </p>
      </div>
    </footer>
  )
}
