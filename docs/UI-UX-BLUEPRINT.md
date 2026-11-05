# WKC Church: Technical UI/UX Blueprint

Branch: `default-web` · Status: draft untuk implementasi · Tanggal: 5 Nov 2026

Dokumen ini menerjemahkan arah "modern, hangat, inklusif, berfokus pada komunitas" menjadi spesifikasi yang bisa langsung dikodekan. Pendamping: `docs/design-tokens.json` (sumber kebenaran token) dan `docs/tailwind.config.draft.ts` (konfigurasi Tailwind). Prototipe visual ada di canvas "WKC Church Landing Page".

**Kondisi repo saat ini.** Branch `default-web` hanya berisi skills (`skills/`, `.claude/skills/`, `.agents/skills/`, `skills-lock.json`). Belum ada `package.json`, `src/`, atau konfigurasi build. Artinya ini proyek baru, dan seluruh struktur di bagian 4 adalah usulan, bukan penyesuaian ke kode yang sudah ada.

---

## 1. Executive Visual Direction

**Satu kalimat:** ruang ibadah setelah lampu diredupkan. Gelap, tenang, dan hangat karena wajah orangnya, bukan karena warnanya.

| Aspek | Keputusan | Alasan |
|---|---|---|
| Mode | Dark Mode First, tanpa tema terang di v1 | Fotografi monokrom paling kuat di latar gelap, dan satu tema berarti satu set kontras yang diuji |
| Fotografi | Hitam-putih sinematik, kontras tinggi, subjek manusia, ruang negatif di sisi teks | Emosi dan keintiman datang dari foto, jadi UI tidak perlu dekorasi tambahan |
| Aksen | Cyan `#00E5FF`, dipakai hanya untuk yang bisa ditekan atau yang sedang terjadi | Aksen yang langka membuat CTA, tanggal, dan indikator live langsung terbaca |
| Tipografi | Plus Jakarta Sans, satu keluarga, bobot 400 sampai 800 | Hangat dan bulat tanpa terlihat seperti template; mendukung teks Indonesia dengan baik |
| Bentuk | Kartu radius 16px, tombol pill, badge tanggal 12px | Sudut membulat terasa ramah; hierarki dibedakan lewat ukuran, bukan lewat bayangan |
| Gerak | Hampir tidak ada. Respons tekan (scale 0.97), zoom foto 3% saat hover, selesai | Gerak yang sedikit terasa tulus. Lihat bagian 4.5 |

**Aturan yang menjaga arah ini tetap utuh:**

1. Cyan tidak pernah dipakai untuk dekorasi. Boleh: tombol primer, tautan aksi, nav aktif, bulan di badge tanggal, titik live.
2. Foto selalu monokrom. Jika foto berwarna masuk, terapkan `grayscale contrast-110` di kelas gambar.
3. Teks di atas foto selalu melewati scrim (`bg-scrim`). Jangan menaruh teks langsung di foto.
4. Satu elemen "berani" per layar. Di beranda: foto hero dan judulnya.
5. Placeholder wajib terlihat sebagai placeholder (`[Jabatan]`, `[Hari, jam]`) sampai konten asli ada. Jangan mengarang jam ibadah atau nomor kontak.

---

## 2. Design Token Registry

Sumber kebenaran: `docs/design-tokens.json`. Tabel di bawah ringkasannya.

### 2.1 Warna

| Token | Hex | Kelas Tailwind | Dipakai untuk | Kontras (di atas `bg`) |
|---|---|---|---|---|
| bg | `#0F1117` | `bg-bg` | Latar halaman | n/a |
| bg-deep | `#0B0D12` | `bg-bg-deep` | Seksi selang-seling | n/a |
| surface | `#1A1D24` | `bg-surface` | Kartu, panel | n/a |
| surface-raised | `#1E222A` | `bg-surface-raised` | Badge tanggal, ikon | n/a |
| line | `#2D3748` | `border-line` | Border, divider | dekoratif |
| ink | `#FFFFFF` | `text-ink` | Teks utama | 18.9:1 |
| ink-soft | `#CBD5E1` | `text-ink-soft` | Teks di atas foto | 12.7:1 |
| ink-muted | `#A0AEC0` | `text-ink-muted` | Paragraf sekunder | 8.4:1 |
| ink-faint | `#8794A8` | `text-ink-faint` | Caption, meta | 6.1:1 (5.5:1 di `surface`) |
| accent | `#00E5FF` | `bg-accent` `text-accent` | CTA, nav aktif, tanggal, live | 12.3:1 |
| accent-ink | `#0F1117` | `text-accent-ink` | Teks di atas tombol aksen | 12.3:1 |
| success | `#10B981` | `text-success` | Status berhasil | 7.4:1 |

Semua pasangan teks lolos WCAG AA (4.5:1). Jangan membuat abu-abu baru di luar tabel ini.

### 2.2 Tipografi

| Peran | Ukuran | Bobot | Line-height | Tracking | Kelas |
|---|---|---|---|---|---|
| H1 hero | clamp(36px, 5vw, 48px) | 700 | 1.1 | -0.03em | `text-h1` |
| H2 seksi | clamp(28px, 3vw, 32px) | 600 | 1.15 | -0.02em | `text-h2` |
| H3 kartu | 20px | 500 | 1.3 | -0.01em | `text-h3` |
| Body | 16px | 400 | 1.6 | 0 | `text-body` |
| Body kecil | 14px | 400 | 1.6 | 0 | `text-body-sm` |
| Caption | 12px | 400 | 1.5 | 0 | `text-caption` |
| Nav | 13px, huruf kapital | 600 | 1.2 | +0.06em | `text-nav uppercase` |

Tracking mengecil seiring ukuran membesar dan melebar pada teks kecil. Ini aturan dari skill `apple-design` (bagian Typography): jangan pakai satu nilai `letter-spacing` untuk semua ukuran. Lebar baris teks isi maksimal `65ch` (`max-w-prose`). Judul memakai `text-wrap: balance`.

### 2.3 Spasi, radius, layer

| Token | Nilai |
|---|---|
| Basis spasi | 4px; skala 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 96 |
| Gutter | 16px (mobile), 24px (≥560px) |
| Padding seksi | 56px (<560), 72px (<1024), 96px (≥1024) |
| Kontainer | `max-w-container` = 1200px |
| Radius | chip 10px · badge 12px · kartu 16px · pill 999px |
| Z-index | nav 20 · drawer 30 · modal 50 |

### 2.4 Gerak

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `ease-out-strong` | `cubic-bezier(0.23, 1, 0.32, 1)` | Semua transisi UI (default) |
| `ease-in-out-strong` | `cubic-bezier(0.77, 0, 0.175, 1)` | Elemen yang bergerak di layar |
| `ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | Drawer navigasi mobile |
| `duration-press` | 120ms | Respons tekan tombol |
| `duration-hover` | 150ms | Warna, border |
| `duration-drawer` | 300ms | Drawer (batas atas untuk UI) |
| `duration-media` | 400ms | Zoom foto saat hover (dekoratif, hanya pointer halus) |

Nilai-nilai ini diambil dari skill `animate` dan tidak boleh diganti dengan `ease-in` atau kurva bawaan browser.

---

## 3. Atomic Component Specifications

Pemisahan: **atom** (Button, Link, DateBadge, Logo), **molekul** (ConnectCard, EventCard, LeaderCard, ServiceRow, ContactRow), **organisme** (Navbar, MobileDrawer, Hero, SermonPlayer, MapContact, Footer).

### 3.1 Navbar (organisme)

**Anatomi:** `Logo` (kiri) · `NavLinks` (tengah/kanan) · `Button` "Jadwal ibadah" (kanan, ≥768px) · `BurgerButton` (<768px).

| Item | Spesifikasi |
|---|---|
| Posisi | `sticky top-0 z-nav`, tinggi minimal 72px |
| Material | `glass-nav` + `border-b border-line` (translusen, konten bergulir di bawahnya) |
| Menu | HOME, NEW TO WKC, CONNECT, GROW, MINISTRIES / RESOURCES |
| State aktif | Teks `ink` + garis bawah 2px `accent`. Ditentukan oleh scroll-spy (lihat 4.4), bukan hard-coded |
| State default | Teks `ink-muted`; hover (hanya `(hover:hover)`) → `ink` |
| Mobile | Di bawah 768px tautan disembunyikan; tombol burger 48×48 membuka `MobileDrawer` |
| A11y | `<nav aria-label>`, tautan aktif `aria-current="page"` (atau `"location"` untuk scroll-spy), burger punya `aria-expanded` dan `aria-label` yang berganti "Buka menu"/"Tutup menu" |

**MobileDrawer:** panel penuh lebar tepat di bawah navbar, tautan 52px tinggi, garis pemisah `line`. Menutup saat tautan dipilih, saat Escape, dan saat tap di luar. Muncul dari atas dan keluar ke atas (jalur simetris, skill `apple-design` bagian Spatial consistency). Durasi 200-300ms, `ease-drawer`. Dengan `prefers-reduced-motion`, ganti slide dengan cross-fade opacity.

### 3.2 Hero (organisme)

Foto monokrom penuh lebar, `min-h-[560px] md:min-h-[640px]`, teks rata kiri di dasar. Isi: H1, satu paragraf (maks 2 baris), dua tombol (primer "Learn More" ke `#about`, ghost "Lihat jadwal ibadah"), lalu baris fakta tiga kolom (Berdiri sejak 1995 · Jakarta Pusat · Ibadah Raya 1 & 2) dengan garis atas. Tinggi hero ditentukan konten ditambah `min-h`, bukan `100vh`. Jika kelak memakai tinggi layar, pakai `min-h-svh` (skill `mobile-native`), bukan `100vh`.

### 3.3 ConnectCard (molekul)

| Bagian | Spesifikasi |
|---|---|
| Wadah | `<a>` penuh kartu, `relative overflow-hidden rounded-card border border-line`, `min-h-[300px]`, konten rata bawah |
| Media | Foto monokrom `absolute inset-0 object-cover` + scrim di atasnya |
| Isi | `H3` nama grup + deskripsi 1-2 kalimat (`text-ink-soft`) |
| Hover | (hanya pointer halus) foto `scale-[1.03]` 400ms, border → `#43506A` |
| Active | Tidak berubah skala (kartu besar); cukup border |
| Grid | Desktop 6 kolom: 3 kartu span 2 lalu 2 kartu span 3. Tablet 2 kolom (kartu terakhir span 2). Mobile 1 kolom |
| Data | `{ id, title, description, image, href }` |

### 3.4 EventCard dan DateBadge (molekul/atom)

**DateBadge:** 64px lebar, `bg-surface-raised`, `border-line`, `rounded-badge`. Hari 24px/700 putih, bulan 12px/700 `accent` huruf kapital `tracking-[0.08em]`, di bawah hari. Contoh: **13** / NOV.

**EventCard:** `bg-surface border-line rounded-card p-6`. Baris atas: `DateBadge` + `H3` judul (sejajar tengah). Lalu deskripsi 1-2 kalimat dan tautan aksi "Daftar" (`text-accent`, tinggi sentuh 44px). Data: `{ id, startsAt: ISO, title, description, registerUrl }`. Hari dan bulan dihitung dari `startsAt` dengan locale `id-ID` dan zona waktu `Asia/Jakarta`, bukan diketik manual.

### 3.5 LeaderCard (molekul)

Foto potret rasio 4:5 monokrom, di bawahnya nama (`H3`) dan jabatan (`caption`, `ink-faint`). Grid 4 → 2 (<1024) → 1 (<560). Jabatan masih `[Jabatan]` sampai dikonfirmasi gereja.

### 3.6 SermonPlayer (organisme)

| Bagian | Spesifikasi |
|---|---|
| Thumbnail | Rasio 16:9, `rounded-card`, scrim ringan |
| Tombol play | Lingkaran 80px `bg-accent`, ikon segitiga `accent-ink`, di tengah. Tap target sudah jauh di atas 44px |
| Perilaku | **Facade:** hanya gambar sampai ditekan. Saat ditekan baru memuat `<iframe>` pemutar. Menghindari ratusan KB skrip pihak ketiga saat halaman dimuat |
| Meta | Label "Khotbah terbaru" (caption), judul (H3), pembicara dan tanggal |
| Aksesibilitas | `aria-label="Putar khotbah: {judul}"`, fokus berpindah ke pemutar setelah dimuat |
| Gerak | Tombol `:active` scale 0.95 (120ms). Tidak ada animasi masuk |

Pendamping di kolom kanan: kartu **Warta Jemaat Digital** (ikon dokumen, "Format PDF", tombol ghost "Unduh PDF") dan kartu **Galeri kegiatan** (grid 2×2 thumbnail persegi + tautan "Lihat semua foto").

### 3.7 MapContact dan ServiceRow (organisme/molekul)

**ServiceRow:** baris dalam satu kartu: nama ibadah (H3) + keterangan (caption) di kiri, jadwal di kanan. Baris "Live Streaming" membawa titik `accent` 8px sebagai indikator. Titik itu statis (tidak berdenyut) supaya tidak menjadi gerak dekoratif; bila ingin "sedang live", ganti dengan label teks "Live" saat siaran aktif.

**MapContact:** kartu peta rasio 16:10 bertema gelap, lalu satu kartu berisi tiga `ContactRow` (Alamat: "Gereja No. 123, Jakarta Pusat", WhatsApp, Email support), masing-masing ikon `accent` + label caption + nilai. Peta memakai pendekatan facade juga (gambar statis dulu, peta interaktif dimuat saat ditekan) atau tautan ke Google Maps. Nomor WhatsApp dan email adalah tautan `https://wa.me/…` dan `mailto:`; tampilkan juga sebagai teks agar bisa disalin.

### 3.8 Button dan Link (atom)

| Varian | Spesifikasi |
|---|---|
| `primary` | `bg-accent text-accent-ink`, `min-h-12 px-6 rounded-full font-semibold`. Hover: brightness 1.12 |
| `ghost` | `border border-line text-ink`. Hover: border `ink-muted` |
| `link` | `text-accent font-semibold`, `min-h-11` |
| Semua | `:active` → `scale-[0.97]`, `transition-[transform,filter,border-color] duration-press ease-out-strong`, `touch-manipulation`, fokus terlihat 2px `accent` |

---

## 4. Frontend Implementation Guide (repo `church-managements`, branch `default-web`)

### 4.1 Stack yang diusulkan

Vite + React 18 + TypeScript + Tailwind CSS 3.4 + React Router (atau satu halaman dengan anchor). Pustaka gerak: tidak ada di v1. Semua gerak yang direncanakan bisa dicapai dengan CSS transition. Tambahkan `motion` hanya jika kelak ada drawer yang bisa diseret atau animasi layout; keputusan itu mengikuti tabel "pilih alat" di skill `animate`.

Alasan Vite alih-alih Next.js: situs ini sebagian besar konten statis, tidak ada kebutuhan SSR yang jelas di spesifikasi. Jika SEO per halaman (khotbah, acara) menjadi prioritas, pindah ke Next.js tidak mengubah komponen di bawah, hanya lapisan routing dan data.

### 4.2 Struktur folder yang diusulkan

```
church-managements/            # branch default-web
├─ docs/
│  ├─ UI-UX-BLUEPRINT.md       # dokumen ini
│  ├─ design-tokens.json       # sumber kebenaran token
│  └─ tailwind.config.draft.ts # dipindah ke root sebagai tailwind.config.ts
├─ skills/  .claude/skills/  .agents/skills/  skills-lock.json   # sudah ada, jangan diubah
├─ public/
│  └─ photos/                  # foto monokrom (WebP/AVIF, sudah di-grayscale)
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ styles/index.css         # @tailwind + font + reduced-motion global
│  ├─ content/                 # data statis bertipe, mudah diedit non-developer
│  │  ├─ connect-groups.ts
│  │  ├─ events.ts
│  │  ├─ leaders.ts
│  │  ├─ services.ts
│  │  └─ sermons.ts
│  ├─ components/
│  │  ├─ ui/                   # atom: Button, Link, DateBadge, Logo, Icon
│  │  ├─ cards/                # molekul: ConnectCard, EventCard, LeaderCard, ServiceRow, ContactRow
│  │  └─ sections/             # organisme: Navbar, MobileDrawer, Hero, About, Leadership,
│  │                           #   NewToWkc, Connect, Grow, Resources, Schedule, Footer
│  ├─ hooks/
│  │  ├─ useScrollSpy.ts
│  │  └─ useReducedMotion.ts
│  └─ lib/
│     └─ format-date.ts        # Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta' })
├─ index.html                  # meta viewport, theme-color, font preload
├─ tailwind.config.ts
├─ postcss.config.js
├─ tsconfig.json
└─ package.json
```

### 4.3 Tipe data inti

```ts
export type ConnectGroup = { id: string; title: string; description: string; image: string; href: string }
export type WkcEvent     = { id: string; startsAt: string /* ISO 8601 */; title: string; description: string; registerUrl: string }
export type Leader       = { id: string; name: string; role: string; photo: string }
export type Service      = { id: string; name: string; kind: 'in-person' | 'live'; schedule: string; note?: string }
export type Sermon       = { id: string; title: string; speaker: string; date: string; videoId: string; thumbnail: string }
```

Konten yang belum diketahui (jabatan pemimpin, jam ibadah, nomor WhatsApp, email, jadwal kelas) tetap berupa string placeholder bertanda kurung siku di file `content/`. Menaruhnya di satu tempat membuat daftar "yang harus diisi gereja" mudah ditelusuri (`grep "\["`).

### 4.4 Logika kunci

**Scroll-spy untuk nav aktif.** `useScrollSpy(['home','new','connect','grow','resources'])` memakai `IntersectionObserver` dengan `rootMargin: '-40% 0px -55% 0px'`. Observer ini berjalan di luar siklus render React dan tidak memicu `setState` per frame (skill `animation-performance`: jangan animasi lewat state). `setState` hanya saat id aktif berubah.

**MobileDrawer.** State boolean `open`. Tutup pada: klik tautan, `Escape`, perubahan breakpoint ke ≥768px. Saat terbuka, `aria-expanded=true` pada burger. Tidak perlu focus trap karena drawer bukan modal dan tidak menutupi konten; fokus tetap berurutan.

**SermonPlayer facade.**

```tsx
const [loaded, setLoaded] = useState(false)
// !loaded → <button> berisi thumbnail + ikon play
// loaded  → <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`} allow="autoplay; encrypted-media" />
```

**Gambar.** Simpan WebP/AVIF yang sudah di-grayscale di `public/photos`. Hero memakai `fetchpriority="high"`, sisanya `loading="lazy"` dengan `width`/`height` eksplisit untuk mencegah layout shift. Selama foto asli belum ada, pakai kelas `bg-photo-placeholder`.

### 4.5 Gerak dan performa: pemetaan ke skills repo

Repo ini sudah membawa skills yang menentukan bagaimana UI ini boleh bergerak. Pemakaiannya:

| Skill | Dipakai untuk | Aturan yang diterapkan |
|---|---|---|
| `animate` | Setiap kali menambah gerak | Jalankan gerbang frekuensi dan tujuan dulu. Hanya `transform` dan `opacity`. Tanpa `transition: all`, tanpa `scale(0)`, tanpa `ease-in`. UI di bawah 300ms |
| `apple-design` | Navbar translusen, tipografi, drawer, reduced-motion | Material `backdrop-filter`; tracking per ukuran; jalur masuk-keluar simetris; `prefers-reduced-motion` berarti cross-fade, bukan nol |
| `mobile-native` | Semua yang disentuh di HP | `-webkit-tap-highlight-color: transparent`; hover dibungkus `@media (hover:hover)`; input 16px; `touch-action: manipulation`; `env(safe-area-inset-*)` dan `viewport-fit=cover`; `theme-color` `#0F1117`; uji di perangkat asli |
| `animation-performance` | Saat ada yang patah-patah | Diagnosis sebelum menambah `will-change`; hindari variabel CSS yang dianimasikan di induk; blur animasi di bawah 20px |
| `review-animations` | Sebelum merge PR yang menyentuh gerak | Cek daftar "Never Ship" |
| `improve-animations` / `remove-animations` | Audit berkala | Hapus gerak yang tidak punya tujuan |
| `animate-expo` | Tidak dipakai | Hanya untuk React Native; situs ini web |

**Gerak yang diizinkan di v1 (dan hanya ini):**

1. Tombol dan tombol play: `:active` scale 0.97/0.95, 120ms.
2. Kartu Connect: zoom foto 3% saat hover, 400ms, hanya `(hover:hover) and (pointer:fine)`.
3. Drawer mobile: masuk/keluar 200-300ms, `ease-drawer`.
4. Warna tautan nav: 150ms.

Tidak ada animasi muncul-saat-scroll, tidak ada parallax, tidak ada gerak otomatis. Alasannya: halaman ini dibaca berulang oleh jemaat yang sama, dan skill `animate` menyatakan gerak dekoratif di permukaan yang sering dilihat adalah alasan untuk tidak membangunnya.

### 4.6 Baseline `index.html`

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#0F1117" />
<meta name="color-scheme" content="dark" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

Jangan pernah memakai `user-scalable=no` atau `maximum-scale=1`.

### 4.7 Peta jalan

| Fase | Isi | Selesai bila |
|---|---|---|
| 0. Fondasi | `npm create vite`, pasang Tailwind, pindahkan `tailwind.config.draft.ts`, `index.html` baseline, font | Halaman kosong tampil gelap, font Plus Jakarta Sans termuat, `npm run build` hijau |
| 1. Atom | Button, Link, DateBadge, Logo, Icon | Semua varian dan state (hover, active, fokus) terlihat di halaman uji |
| 2. Shell | Navbar, MobileDrawer, Footer, scroll-spy | Nav aktif berubah saat menggulir; drawer bekerja dengan keyboard |
| 3. Seksi konten | Hero, NewToWkc, About, Leadership, Connect, Grow | Sesuai prototipe di 1360px, 768px, 390px |
| 4. Media dan lokasi | Resources (facade pemutar, PDF, galeri), Schedule, MapContact | Pemutar hanya memuat iframe saat ditekan; peta tidak memuat skrip saat awal |
| 5. Konten asli | Ganti semua placeholder `[ ]`, foto monokrom asli | `grep "\[" src/content` kosong |
| 6. Kualitas | Audit a11y, Lighthouse, uji di perangkat asli, `review-animations` | Lihat daftar di bawah |

**Pintu kualitas (target, ukur setelah fase 6):** Lighthouse Performance dan Accessibility ≥ 90 di mobile; LCP < 2.5s di 4G; CLS < 0.1; semua teks ≥ 4.5:1; semua target sentuh ≥ 44px; seluruh halaman dapat dioperasikan hanya dengan keyboard; diuji di satu iPhone dan satu Android asli (hover nyangkut, safe area, zoom input, URL bar tidak bisa diuji lewat emulasi).

---

## 5. Responsive Breakpoint Strategy (mobile-first)

Tulis kelas dasar untuk mobile, lalu tambahkan `sm:`, `md:`, `lg:`. Jangan pernah menulis `max-width` query di komponen baru.

| Breakpoint | Lebar | Peran |
|---|---|---|
| (dasar) | < 560px | Satu kolom, gutter 16px, padding seksi 56px |
| `sm` | ≥ 560px | Grid pemimpin 2 kolom, gutter 24px |
| `md` | ≥ 768px | Navbar penuh menggantikan burger; grid Connect dan Event 2 kolom |
| `lg` | ≥ 1024px | Layout desktop: grid Connect 6 kolom, Event 3 kolom, pemimpin 4 kolom, seksi dua kolom berdampingan, padding seksi 96px |
| `xl` | ≥ 1280px | Hanya mengunci kontainer 1200px; tidak ada perubahan struktur |

### 5.1 Perilaku per seksi

| Seksi | Mobile (<768) | Tablet (768-1023) | Desktop (≥1024) |
|---|---|---|---|
| Navbar | Logo + burger, drawer | Tautan penuh + CTA | Sama dengan tablet |
| Hero | `min-h` 560, fakta 1 kolom | `min-h` 640, fakta 3 kolom | Sama dengan tablet |
| Baru di WKC | 1 kolom | 3 kolom | 3 kolom |
| Tentang | 1 kolom: teks lalu visi/misi | 1 kolom | 2 kolom 5:7 |
| Kepemimpinan | 1 kolom (<560), 2 kolom (≥560) | 2 kolom | 4 kolom |
| Connect | 1 kolom | 2 kolom, kartu ke-5 span 2 | 6 kolom: 3 kartu span 2, 2 kartu span 3 |
| Grow | 1 kolom | 2 kolom, kartu ke-3 span 2 | 3 kolom |
| Resources | Pemutar lalu kartu PDF/galeri, 1 kolom | 1 kolom | 2 kolom 1.6:1 |
| Jadwal dan lokasi | Jadwal, renungan, peta, kontak berurutan | 1 kolom | 2 kolom berdampingan |

Catatan: pada mobile (<560px) grid pemimpin tetap 1 kolom sesuai spesifikasi awal. Jika foto potret terasa terlalu panjang saat diuji di HP, ubah rasio menjadi 1:1 di breakpoint dasar, bukan menambah kolom.

### 5.2 Aturan lintas breakpoint

1. Tidak ada scroll horizontal di lebar berapa pun. Elemen anak flex/grid yang berisi teks diberi `min-w-0`.
2. Layout app/hero memakai `svh` atau tinggi konten, tidak `100vh`.
3. Hover dibatasi pada perangkat yang bisa hover (`future.hoverOnlyWhenSupported`). Perangkat sentuh mendapat umpan balik lewat `:active`.
4. Safe area: navbar dan drawer memakai `pt-safe`/`px-safe`; footer memakai `pb-safe`.
5. Preferensi sistem dihormati: `prefers-reduced-motion` (drawer → cross-fade, hapus zoom foto), `prefers-contrast: more` (border `line` → `ink-faint`).
6. Uji di lebar 360, 390, 768, 1024, 1280, dan 1440.

---

## Lampiran A. Catatan keputusan

| Keputusan | Alasan | Bisa diubah bila |
|---|---|---|
| Plus Jakarta Sans, bukan Inter | Spesifikasi menyebut keduanya; Plus Jakarta Sans lebih hangat dan khas untuk konteks Indonesia | Tim desain menetapkan huruf lain |
| H1 maksimal 48px | Mengikuti angka di spesifikasi (36-48px). Dramatis datang dari foto, bukan ukuran huruf | Brand meminta hero tipografis |
| Tanpa tema terang | Spesifikasi "Dark Mode First"; satu tema mengurangi risiko kontras | Ada kebutuhan nyata (mis. cetak, preferensi jemaat) |
| Pemutar dan peta sebagai facade | Menjaga LCP dan menghindari pelacak pihak ketiga saat muat | Penyedia video/peta berubah |
| Konten kosong ditandai `[ ]` | Jam ibadah, kontak, dan jabatan belum diberikan | Konten asli tersedia |
| Tanggal kelas (13, 20, 27 Nov) | Hanya 13 Nov yang disebut di spesifikasi; dua lainnya contoh | Gereja memberi jadwal resmi |

## Lampiran B. Yang belum bisa dipastikan dari repo

- Belum ada kode web, jadi integrasi "ke arsitektur yang ada" belum dapat dilakukan. Bagian 4 adalah usulan awal.
- Belum ada aset foto. Placeholder gradien dipakai di prototipe.
- Belum ada keputusan hosting. Jika memakai Vercel, Vite dan Next.js sama-sama didukung tanpa perubahan di dokumen ini.
