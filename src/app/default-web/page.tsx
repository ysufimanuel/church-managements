import type { Metadata } from 'next';
import DefaultWeb from '@/default-web/App';

export const metadata: Metadata = {
  title: 'Default Website Preview',
  description: 'Preview template website default WKC Church.',
  robots: { index: false, follow: false },
};

export default function DefaultWebPreviewPage() {
  return <DefaultWeb />;
}
