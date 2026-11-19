const TZ = 'Asia/Jakarta'

/** "13" dan "NOV" dari tanggal ISO, dihitung di zona waktu Jakarta. */
export function dayMonth(iso: string): { day: string; month: string } {
  const d = new Date(iso)
  const day = new Intl.DateTimeFormat('id-ID', { day: 'numeric', timeZone: TZ }).format(d)
  const month = new Intl.DateTimeFormat('id-ID', { month: 'short', timeZone: TZ })
    .format(d)
    .replace('.', '')
    .toUpperCase()
  return { day, month }
}
