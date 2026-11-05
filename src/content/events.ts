import type { WkcEvent } from './types'

// Hanya 13 Nov yang disebut di spesifikasi. Tanggal lain adalah contoh: ganti dengan jadwal resmi.
export const events: WkcEvent[] = [
  {
    id: 'alpha',
    startsAt: '2026-11-13T00:00:00+07:00',
    title: 'Kursus Alpha',
    description: 'Kursus pengenalan iman Kristen yang dijalani bersama, terbuka untuk siapa saja.',
    registerUrl: '#grow',
  },
  {
    id: 'emosi-sehat',
    startsAt: '2026-11-20T00:00:00+07:00',
    title: 'Kelas Tumbuh: Emosi Sehat',
    description: 'Belajar mengenali dan mengelola emosi dengan sehat berdasarkan prinsip Alkitab.',
    registerUrl: '#grow',
  },
  {
    id: 'lokakarya-alkitab',
    startsAt: '2026-11-27T00:00:00+07:00',
    title: 'Lokakarya Pendalaman Alkitab',
    description: 'Sesi lokakarya untuk membaca dan memahami Alkitab dengan lebih dalam.',
    registerUrl: '#grow',
  },
]
