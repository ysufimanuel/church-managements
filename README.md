# Church CMS — Next.js 14 + Supabase

Rekonstruksi total **Church Management System V6** (base-code vanilla JS/Firebase) menjadi aplikasi web modern berbasis SEO: **Next.js App Router + Tailwind CSS + shadcn-style UI + Supabase (PostgreSQL, Auth, Realtime)**. Bilingual ID/EN, RBAC 3 level, dan modul baru **Web Manager** (no-code CMS situs publik).

---

## 1) Arsitektur Folder & File

```
church-cms/
├── supabase/
│   └── schema.sql                 # DDL + RLS + trigger realtime + seed data
├── src/
│   ├── middleware.ts              # Guard auth untuk /dashboard
│   ├── app/
│   │   ├── layout.tsx             # Root layout + metadata SEO + Toaster
│   │   ├── sitemap.ts / robots.ts # SEO
│   │   ├── globals.css            # Design tokens dark theme (WKC)
│   │   ├── login/page.tsx         # Login bilingual (username→email)
│   │   ├── (public)/              # SITUS PUBLIK (SEO, ISR 60s)
│   │   │   ├── layout.tsx         # Header/nav dari DB + tema dinamis
│   │   │   ├── page.tsx           # Home (sections dari Web Manager)
│   │   │   ├── events/ tentang/ kontak/
│   │   └── dashboard/
│   │       ├── layout.tsx         # Shell: sidebar + header + notif realtime
│   │       ├── page.tsx           # Statistik + chart (recharts)
│   │       ├── members/ families/ groups/ events/ attendance/
│   │       ├── donations/ finance/ volunteers/ communication/
│   │       ├── reports/ users/ web-manager/
│   ├── components/
│   │   ├── ui/                    # Button, Input, Card, Table, Modal, Tabs, Switch
│   │   ├── dashboard/             # Client components per modul + charts + shell
│   │   ├── public/                # Header, footer, MediaFrame, SectionRenderer
│   │   └── lang-context.tsx       # Provider bilingual (localStorage cmsLanguage)
│   └── lib/
│       ├── supabase/              # client.ts (browser) / server.ts / middleware.ts
│       ├── actions/               # SERVER ACTIONS per modul (auth, members, …, webmanager)
│       ├── i18n.ts                # Kamus ID/EN (dipindah 1:1 dari base-code)
│       ├── rbac.ts                # Hierarki akses user/admin/superadmin
│       ├── export.ts              # Export CSV/XLS/TXT/Print-PDF
│       └── utils.ts               # cn, formatRupiah, ratioToPadding, normalizeMediaUrl
└── .env.example
```

## 2) Skema Database PostgreSQL (Supabase)

File `supabase/schema.sql` berisi:

- **Tabel inti** (1:1 dengan `defaultData` base-code): `profiles`, `church_profile`, `members`, `families` + `family_members`, `groups` + `group_members`, `events` + `event_participants`, `attendance`, `donors`, `donations`, `volunteers`, `volunteer_assignments`, `announcements`, `messages`, `broadcasts`, `activities`, `notifications`, `finance_settings`, `finance_categories`, `finance_transactions`, `approval_history`.
- **Tabel Web Manager**: `site_nav_items` (label/visibility/order), `site_theme` (warna + font, draft/published), `site_media` (kind, url, rasio dinamis, layer overlay/front, posisi, lat/lng map), `site_sections` (page, type, sort, `content` draft vs `published`, enabled).
- **RLS ketat per role**:
  - `user` → SELECT saja (view only).
  - `admin` → SELECT/INSERT/UPDATE; transaksi finance otomatis **pending**; TIDAK bisa DELETE; TIDAK bisa approve.
  - `superadmin` → full akses + approve/reject + user management.
- **Trigger realtime**: perubahan data (members/events/donations/groups/finance/announcements/volunteers) → insert ke `activities` + `notifications`; pesan baru → notifikasi ke penerima. `messages`, `notifications`, `activities` terdaftar di `supabase_realtime` publication.
- **Seed data** identik dengan base-code (5 jemaat, 3 grup, 3 event, kategori finance, nav publik, hero/info lokasi default).

## 3) Server Actions

Semua mutasi lewat Next.js Server Actions di `src/lib/actions/` — tanpa REST API terpisah:

| File | Aksi |
|---|---|
| `auth.ts` | `loginAction` (username→email), `logoutAction` |
| `members.ts` / `families.ts` / `groups.ts` / `events.ts` | CRUD + kelola anggota grup/keluarga + peserta event (member & manual) |
| `attendance.ts` | `checkInMember` (upsert harian), hapus (superadmin) |
| `donations.ts` | CRUD donasi + update agregat donatur |
| `finance.ts` | Transaksi (admin→pending, superadmin→auto-approved), `approveTransaction`, `rejectTransaction`, kategori, saldo awal |
| `volunteers.ts` | CRUD relawan (member/eksternal) + penugasan |
| `communication.ts` | `sendMessage`, pengumuman, broadcast (draft/send), mark-read notifikasi |
| `users.ts` | Buat/edit/hapus user via Admin API (superadmin, butuh service role key) |
| `webmanager.ts` | Nav (CRUD + toggle visibility + custom label), tema (draft/publish), media, section draft & `publishSections` |

Setiap action memanggil `requireRole(...)` di server — RBAC ditegakkan dua lapis (action + RLS Postgres).

## 4) Komponen UI Front-end

- **UI kit** (`src/components/ui/`): Button, Input/Textarea/Label/Select, Card, Badge, Table, Modal (Esc/backdrop close), Switch, Tabs — styling shadcn dengan token dark WKC (`#0F1117`, card `#1A1D24`, aksen `#00E5FF`).
- **Dynamic Ratio Media** (`MediaFrame`): rasio `16:9, 19:9, 1:1, 4:3, 4:5, 2:3, 9:16, 2:9, 32:91` via padding-top aspect box; auto-normalisasi URL Google Drive→direct image, YouTube/Vimeo→embed; map selalu **1:1** dengan titik koordinat (`lat,lng` → Google Maps embed); layer **overlay/front** dan posisi objek (atas/bawah/kiri/kanan/tengah).
- **Dashboard**: stat cards, chart recharts (kehadiran, distribusi jemaat, pemasukan/pengeluaran, per kategori), tabel + search/filter/export, modal form per modul.
- **Web Manager 3 sub-tab**: Header & Navigasi (toggle visibility + custom label), Tampilan & Tema (color picker, font selector Poppins/Inter/Roboto/Montserrat, Media Link Manager dengan auto-preview), Editor Halaman (Hero/Event Feed/Info & Lokasi/Media/Map/RichText + **Live Preview iframe** + tombol **Publish/Draft**).
- **Editor Visual** (tab pertama Web Manager, untuk admin non-teknis): pratinjau halaman di tengah, klik bagian mana pun untuk mengedit di panel kanan, daftar bagian dengan drag & drop / tombol naik-turun, sembunyikan / gandakan / hapus (hapus hanya Superadmin), tambah bagian lewat galeri berbahasa sederhana, pratinjau HP/Tablet/Komputer, **autosave** ke draf, dan tombol **Publikasikan** per halaman. Tab "Editor Halaman (Lanjutan)" tetap tersedia untuk pengaturan detail. Detail teknis: `components/dashboard/visual-editor*.tsx`, jembatan klik di `components/public/preview-bridge.tsx` (aktif hanya pada `?preview=draft&edit=1` di dalam iframe), dan server action `saveSectionContent` / `reorderSections` / `setSectionEnabled` di `lib/actions/webmanager.ts`.
- **Situs publik** mengikuti `design-template.md`: dark-mode-first, hero dengan overlay, kartu event dengan badge tanggal, info lokasi + peta 1:1, navbar sticky dengan highlight aktif, responsif mobile (drawer).

## 5) Real-time & Notifikasi

- **Supabase Realtime** channel `postgres_changes`:
  - `notifications` → `NotificationBell`: badge + dropdown + **toast instan** saat ada notifikasi baru (chat masuk atau perubahan data dari trigger DB).
  - `messages` → chat masuk langsung muncul di jendela percakapan tanpa refresh.
- Trigger Postgres `log_activity()` dan `notify_new_message()` membuat event notifikasi di server side — berlaku untuk semua klien.

## 6) Panduan Deployment Vercel + Supabase

1. **Supabase**
   - Buat project di [supabase.com](https://supabase.com).
   - Buka **SQL Editor** → jalankan seluruh isi `supabase/schema.sql`.
   - Buat user awal: **Authentication → Users → Add User** dengan email `admin@gereja.com`, password `admin123`, dan di *User Metadata* isi:
     ```json
     { "nama": "Administrator", "username": "admin", "role": "superadmin" }
     ```
     (trigger `handle_new_user` otomatis membuat profile-nya). Buat juga user view-only `user@gereja.com` dengan metadata `{ "nama": "User View", "username": "userview", "role": "user" }`.
   - Salin **Project URL**, **anon key**, dan **service_role key** dari Settings → API.
2. **Lokal**
   ```bash
   cp .env.example .env.local   # isi 3 key di atas + NEXT_PUBLIC_SITE_URL
   npm install
   npm run dev                  # http://localhost:3000
   ```
3. **Vercel**
   - Push repo ke GitHub → Import di Vercel (framework: Next.js, otomatis terdeteksi).
   - Tambahkan env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`.
   - Deploy. Halaman publik menggunakan ISR (revalidate 60 dtk) → Core Web Vitals hijau (statis + streaming server components, gambar lazy, tanpa JS berat di publik).
4. **Realtime**: aktif secara default di Supabase; pastikan tabel `messages`, `notifications`, `activities` ada di publication (sudah di-handle schema.sql).

---

## Pemetaan Fitur Base-code → Stack Baru (Zero Feature Loss)

| Base-code (app.js) | Implementasi baru |
|---|---|
| Multi-language ID/EN (`translations`) | `lib/i18n.ts` + `LangProvider` |
| Login username/password, session | Supabase Auth + middleware guard |
| RBAC user/admin/superadmin (`canEdit/canDelete/canApprove`) | `lib/rbac.ts` + RLS Postgres |
| Dashboard stats + Chart.js | Server-aggregated stats + recharts |
| Members CRUD + search/filter + export 5 format | `members/` + `lib/export.ts` (CSV/XLS/TXT/print-PDF) |
| Families, Groups (+showPhone, kelola anggota) | `families/`, `groups/` |
| Events + status + peserta manual | `events/` |
| Attendance check-in + data + laporan | `attendance/` |
| Donations + ringkasan + filter bulan | `donations/` |
| Finance (saldo, pemasukan/pengeluaran, kategori, laporan, **approval pending/approved/rejected + history**) | `finance/` |
| Volunteers (member/eksternal, jadwal, penugasan) | `volunteers/` |
| Communication (broadcast draft/send, chat 1:1, pengumuman penting/expiry) | `communication/` |
| Reports 4 jenis + save-as multi format + print | `reports/` |
| User Management | `users/` (superadmin only) |
| Notifikasi + badge + mark read | Realtime `NotificationBell` |
| Backup/restore/clear data | Digantikan eksport CSV/XLS + Supabase backup otomatis (PITR di dashboard Supabase) |
| **Baru: Web Manager 3 tab** (nav, tema+media rasio dinamis+map, section builder + live preview + publish/draft) | `dashboard/web-manager/` |

## Catatan

- Email broadcast membuat notifikasi in-app; untuk pengiriman email nyata, hubungkan `saveBroadcast` ke provider (Resend/SMTP) — titik integrasi sudah ditandai di kode.
- Login memakai username → lookup email ke tabel `profiles`, lalu `signInWithPassword`.


## UI and UX updates

- Dashboard profile photo upload is stored in the private server-managed Supabase Storage workflow and displayed in the account avatar.
- English is the default locale; Indonesian and English remain the only supported languages.
- Login logo opens role-based demo account details and fills the selected credentials. Demo access descriptions explain each role's permissions.
- Shared dashboard skeleton primitives keep loading placeholders close to the dashboard content layout; global search uses matching result placeholders.
- Search results use feature-specific icons, and mobile navigation supports touch-drag magnification with reduced-motion and mobile rendering safeguards.
