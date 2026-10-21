import { createClient } from '@/lib/supabase/server';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const [{ data: nav }, { data: theme }, { data: church }] = await Promise.all([
    supabase.from('site_nav_items').select('*').eq('state', 'published').eq('visible', true).order('sort_order'),
    supabase.from('site_theme').select('*').eq('id', 1).maybeSingle(),
    supabase.from('church_profile').select('*').eq('id', 1).maybeSingle(),
  ]);

  const published = (theme?.published as any) || { primary_color: theme?.primary_color || '#00E5FF', font_family: theme?.font_family || 'Inter' };

  return (
    <div style={{
      ['--primary' as any]: hexToHsl(published.primary_color),
      ['--font-sans' as any]: `'${published.font_family}', system-ui, sans-serif`,
    }}>
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(published.font_family)}:wght@300;400;500;600;700&display=swap`} />
      <PublicHeader nav={nav || []} churchName={church?.nama || 'WKC Church'} />
      {children}
      <PublicFooter church={church} />
    </div>
  );
}

function hexToHsl(hex: string) {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16) / 255, g = parseInt(m.slice(2, 4), 16) / 255, b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
