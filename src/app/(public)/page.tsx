import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Masuk ke Church Management System.',
};

/**
 * The root public route is intentionally kept outside the tenant renderer.
 * Tenant websites live under /site/[slug], while the application root opens login.
 */
export default function PublicHomePage() {
  redirect('/login');
}
