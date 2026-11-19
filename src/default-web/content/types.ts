export type ConnectGroup = {
  id: string
  title: string
  description: string
  image?: string
  fx: number
  fy: number
  href: string
}

export type WkcEvent = {
  id: string
  /** ISO 8601 dengan offset, mis. 2026-11-13T00:00:00+07:00 */
  startsAt: string
  title: string
  description: string
  registerUrl: string
}

export type Leader = {
  id: string
  name: string
  role: string
  photo?: string
  fx: number
  fy: number
}

export type Service = {
  id: string
  name: string
  kind: 'in-person' | 'live'
  note: string
  schedule: string
}

export type Sermon = {
  id: string
  title: string
  speaker: string
  date: string
  /** ID video YouTube. Kosong = belum tersedia. */
  videoId: string
  thumbnail?: string
}
