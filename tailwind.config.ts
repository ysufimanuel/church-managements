import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1280px' } },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        bg: { DEFAULT: '#0F1117', deep: '#0B0D12' },
        surface: { DEFAULT: 'rgba(255,255,255,0.06)', raised: 'rgba(255,255,255,0.10)' },
        line: 'rgba(255,255,255,0.14)',
        ink: { DEFAULT: '#FFFFFF', soft: '#CBD5E1', muted: '#A0AEC0', faint: '#8794A8' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))', ink: '#0F1117' },
        success: '#10B981',
      },
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
      spacing: { 'section-sm': '56px', 'section-md': '72px', 'section-lg': '96px' },
      zIndex: { nav: '20', drawer: '30', modal: '50' },
      transitionTimingFunction: {
        'out-strong': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out-strong': 'cubic-bezier(0.77, 0, 0.175, 1)',
        drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      transitionDuration: { press: '120ms', hover: '150ms', popover: '200ms', drawer: '300ms', media: '400ms' },
      backgroundImage: {
        'photo-placeholder': 'radial-gradient(90% 70% at 70% 20%, #4A505C 0%, #252933 42%, #101218 100%)',
        scrim: 'linear-gradient(to top, rgba(15,17,23,0.94) 0%, rgba(15,17,23,0.35) 55%, rgba(15,17,23,0.05) 100%)',
      },
      boxShadow: { glass: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)' },
      keyframes: {
        'sx-wipe': { from: { clipPath: 'inset(0 100% 0 0)' }, to: { clipPath: 'inset(0 0 0 0)' } },
        'drawer-in': { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: { 'drawer-in': 'drawer-in 200ms cubic-bezier(0.32, 0.72, 0, 1) both' },
      borderRadius: {
        chip: '10px', badge: '12px', card: '16px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate'), plugin(({ addBase, addUtilities }) => {
    addBase({
      '.default-web-site input, .default-web-site textarea, .default-web-site select': { fontSize: '16px' },
      '.default-web-site button, .default-web-site a, .default-web-site [role="button"]': { touchAction: 'manipulation' },
      '.default-web-site button, .default-web-site [role="button"]': { userSelect: 'none', WebkitUserSelect: 'none' },
      '.default-web-site :focus-visible': { outline: '2px solid #00E5FF', outlineOffset: '3px' },
    });
    addUtilities({
      '.pt-safe': { paddingTop: 'env(safe-area-inset-top, 0px)' },
      '.pb-safe': { paddingBottom: 'env(safe-area-inset-bottom, 0px)' },
      '.px-safe': { paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' },
      '.glass-nav': { backgroundColor: 'rgba(15,17,23,0.55)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', borderBottom: '1px solid rgba(255,255,255,0.12)' },
    });
  })],
};
export default config;
