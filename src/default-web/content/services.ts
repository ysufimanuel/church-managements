import type { Service } from './types'

// schedule masih placeholder: jam ibadah dan platform belum diberikan.
export const services: Service[] = [
  { id: 'raya-1', name: 'Ibadah Raya 1', kind: 'in-person', note: 'Tatap muka', schedule: '[Hari, jam]' },
  { id: 'raya-2', name: 'Ibadah Raya 2', kind: 'in-person', note: 'Tatap muka', schedule: '[Hari, jam]' },
  { id: 'live', name: 'Live Streaming', kind: 'live', note: 'Ikuti dari rumah', schedule: '[Platform]' },
]

export const address = 'Gereja No. 123, Jakarta Pusat'
export const whatsapp = '[Nomor WhatsApp]'
export const email = '[Alamat email]'
