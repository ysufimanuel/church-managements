import type { Metadata, Viewport } from 'next';
import './globals.css';
import './default-web.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: { default: 'WKC Church — Church Management System', template: '%s | WKC Church CMS' },
  description: 'Sistem Manajemen Gereja Digital — kelola jemaat, event, keuangan, relawan, dan komunikasi dalam satu platform.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'WKC Church CMS',
    description: 'Sistem Manajemen Gereja Digital',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F1117',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
