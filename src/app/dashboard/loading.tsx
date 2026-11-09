export default function DashboardLoading() {
  return (
    <main aria-busy="true" aria-label="Memuat halaman" className="space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <div className="h-7 w-44 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-64 max-w-full animate-pulse rounded bg-muted/70" />
      </div>

      <section aria-label="Memuat ringkasan" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-4 h-9 w-9 animate-pulse rounded-lg bg-muted" />
            <div className="mb-2 h-3 w-20 animate-pulse rounded bg-muted/70" />
            <div className="h-7 w-24 max-w-full animate-pulse rounded bg-muted" />
          </div>
        ))}
      </section>

      <section aria-label="Memuat grafik" className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="min-h-64 rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="mb-6 h-5 w-36 animate-pulse rounded bg-muted" />
            <div className="flex h-40 items-end gap-3">
              {Array.from({ length: 7 }, (_, j) => (
                <div key={j} className="flex-1 animate-pulse rounded-t-md bg-muted/70" style={{ height: `${35 + ((j * 17) % 55)}%` }} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section aria-label="Memuat aktivitas" className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="mb-5 h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="space-y-4">
              {Array.from({ length: 4 }, (_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-muted" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-muted/70" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
