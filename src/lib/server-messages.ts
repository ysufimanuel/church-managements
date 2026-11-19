import type { Lang } from '@/lib/i18n';
import { WM_EN } from '@/lib/wm-en';

// Server actions return messages in Indonesian (source language). On the client these are
// translated to the active UI language so English mode never shows Indonesian text.
const ID_TO_EN: Record<string, string> = {
  'Hanya Superadmin yang dapat menghapus data': 'Only a Super Admin can delete data',
  'Hanya Superadmin yang dapat menghapus peserta event': 'Only a Super Admin can remove event participants',
  'Hanya Superadmin yang dapat menghapus anggota komunitas': 'Only a Super Admin can remove group members',
  'Hanya Superadmin yang dapat memproses transaksi': 'Only a Super Admin can process transactions',
  'Akses ditolak': 'Access denied',
  'Unauthorized: session/profile tidak ditemukan': 'Unauthorized: session/profile not found',
  'Pesan kosong': 'Message is empty',
  'Penerima pesan tidak valid': 'Invalid message recipient',
  'Pengiriman ke grup atau penerima khusus belum didukung karena akun CMS belum terhubung ke data anggota.': 'Sending to groups or custom recipients is not supported yet because CMS accounts are not linked to member records.',
  'SUPABASE_SERVICE_ROLE_KEY belum diset': 'SUPABASE_SERVICE_ROLE_KEY is not set',
  'Password wajib untuk user baru': 'A password is required for new users',
  'User berasal dari gereja lain atau tidak ditemukan': 'User belongs to another church or was not found',
  'Superadmin tidak dapat menurunkan role akunnya sendiri': 'A Super Admin cannot demote their own account',
  'Tidak dapat menurunkan role Superadmin terakhir di gereja ini': 'Cannot demote the last Super Admin of this church',
  'Superadmin tidak dapat menghapus akunnya sendiri': 'A Super Admin cannot delete their own account',
  'Tidak dapat menghapus Superadmin terakhir di gereja ini': 'Cannot delete the last Super Admin of this church',
  'Nama gereja, nama admin, username, email, dan password minimal 6 karakter wajib diisi.': 'Church name, admin name, username, email, and a password of at least 6 characters are required.',
  'Gagal membuat data gereja.': 'Failed to create the church record.',
  'Gagal membuat akun superadmin.': 'Failed to create the super admin account.',
  'Gereja berhasil didaftarkan. Silakan login dengan akun superadmin Anda.': 'Church registered successfully. Please sign in with your super admin account.',
  'Registrasi gagal.': 'Registration failed.',
};

const PATTERNS: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Donasi tersimpan, tetapi total donatur gagal diperbarui: ([\s\S]*)$/, (m) => `Donation saved, but the donor total failed to update: ${m[1]}`],
  [/^Donasi terhapus, tetapi total donatur gagal diperbarui: ([\s\S]*)$/, (m) => `Donation deleted, but the donor total failed to update: ${m[1]}`],
  [/^Profil tersimpan, tetapi password gagal diperbarui: ([\s\S]*)$/, (m) => `Profile saved, but the password failed to update: ${m[1]}`],
  [/^Profil tersimpan, tetapi metadata autentikasi gagal diperbarui: ([\s\S]*)$/, (m) => `Profile saved, but auth metadata failed to update: ${m[1]}`],
  [/^Authorization failed: ([\s\S]*)$/, (m) => `Authorization failed: ${m[1].replace('session/profile tidak ditemukan', 'session/profile not found')}`],
];

const EN_TO_ID: Record<string, string> = {
  'Unknown server error': 'Terjadi kesalahan pada server',
};

export function translateServerMessage(lang: Lang, msg?: string | null): string {
  if (!msg) return '';
  if (lang === 'id') return EN_TO_ID[msg] ?? msg;
  if (ID_TO_EN[msg]) return ID_TO_EN[msg];
  if (WM_EN[msg]) return WM_EN[msg];
  for (const [re, fn] of PATTERNS) {
    const m = msg.match(re);
    if (m) return fn(m);
  }
  return msg;
}
