/**
 * WKC Church: tailwind.config.ts
 *
 * Target: Tailwind CSS 3.4+. Dark Mode First: tidak ada tema terang,
 * jadi warna didefinisikan langsung tanpa varian `dark:`.
 * Nilai mengikuti docs/design-tokens.json. Ubah di sana dulu, lalu di sini.
 *
 * Catatan Tailwind v4: pindahkan blok `theme.extend` ke `@theme { ... }`
 * di CSS. `hoverOnlyWhenSupported` tidak diperlukan karena v4 sudah
 * mengompilasi `hover:` ke `@media (hover: hover)`.
 */
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],

  // Skill mobile-native: hover hanya untuk perangkat yang benar-benar bisa hover,
  // supaya tidak ada hover "nyangkut" setelah tap di HP.
  future: { hoverOnlyWhenSupported: true },

  theme: {
    screens: {
      sm: '560px', // 1 kolom -> 2 kolom untuk grid kecil (pemimpin)
      md: '768px', // navbar penuh, grid kartu 2 kolom
      lg: '1024px', // layout desktop multi-kolom
      xl: '1280px',
    },

    extend: {
      colors: {
        bg: { DEFAULT: '#0F1117', deep: '#0B0D12' },
        surface: { DEFAULT: '#1A1D24', raised: '#1E222A' },
        line: '#2D3748',
        ink: {
          DEFAULT: '#FFFFFF',
          soft: '#CBD5E1',
          muted: '#A0AEC0',
          faint: '#8794A8',
        },
        accent: {
          DEFAULT: '#00E5FF',
          ink: '#0F1117',
        },
        success: '#10B981',
      },

      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'sans-serif',
        ],
      },

      // [size, { lineHeight, letterSpacing, fontWeight }]
      // Tracking mengecil seiring ukuran naik (skill apple-design, bagian Typography).
      fontSize: {
        h1: ['clamp(2.25rem, 5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        h2: ['clamp(1.75rem, 3vw, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        h3: ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '500' }],
        body: ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        caption: ['0.75rem', { lineHeight: '1.5' }],
        nav: ['0.8125rem', { lineHeight: '1.2', letterSpacing: '0.06em', fontWeight: '600' }],
      },

      maxWidth: { container: '1200px', prose: '65ch' },

      borderRadius: {
        chip: '10px',
        badge: '12px',
        card: '16px',
      },

      spacing: {
        'section-sm': '56px',
        'section-md': '72px',
        'section-lg': '96px',
      },

      zIndex: { nav: '20', drawer: '30', modal: '50' },

      transitionTimingFunction: {
        'out-strong': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out-strong': 'cubic-bezier(0.77, 0, 0.175, 1)',
        drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      transitionDuration: {
        press: '120ms',
        hover: '150ms',
        popover: '200ms',
        drawer: '300ms',
        media: '400ms',
      },

      backgroundImage: {
        // Placeholder foto monokrom sampai aset asli tersedia.
        'photo-placeholder':
          'radial-gradient(90% 70% at 70% 20%, #4A505C 0%, #252933 42%, #101218 100%)',
        // Scrim untuk teks di atas foto (kartu Connect, hero).
        scrim: 'linear-gradient(to top, rgba(15,17,23,0.94) 0%, rgba(15,17,23,0.35) 55%, rgba(15,17,23,0.05) 100%)',
      },

      // Drawer mobile: masuk dari atas, 200ms. Keluar tanpa animasi (elemen dilepas dari DOM).
      keyframes: {
        'drawer-in': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'drawer-in': 'drawer-in 200ms cubic-bezier(0.32, 0.72, 0, 1) both',
      },
    },
  },

  plugins: [
    plugin(({ addBase, addUtilities }) => {
      addBase({
        html: {
          backgroundColor: '#0F1117',
          color: '#FFFFFF',
          WebkitTapHighlightColor: 'transparent', // mobile-native: hilangkan flash tap
          WebkitTextSizeAdjust: '100%',
          colorScheme: 'dark',
        },
        // mobile-native: input minimal 16px agar iOS tidak zoom saat fokus
        'input, textarea, select': { fontSize: '16px' },
        // mobile-native: tap tanpa delay + kontrol tidak ikut ter-seleksi saat long-press
        'button, a, [role="button"]': { touchAction: 'manipulation' },
        'button, [role="button"]': { userSelect: 'none', WebkitUserSelect: 'none' },
        ':focus-visible': { outline: '2px solid #00E5FF', outlineOffset: '3px' },
      })

      addUtilities({
        // Safe area: dipakai di navbar, drawer, dan bar bawah (butuh viewport-fit=cover).
        '.pt-safe': { paddingTop: 'env(safe-area-inset-top, 0px)' },
        '.pb-safe': { paddingBottom: 'env(safe-area-inset-bottom, 0px)' },
        '.px-safe': {
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)',
        },
        // Material translusen untuk navbar (apple-design, bagian Materials).
        '.glass-nav': {
          backgroundColor: 'rgba(15,17,23,0.78)',
          backdropFilter: 'blur(16px) saturate(160%)',
          WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        },
      })
    }),
  ],
}

export default config
