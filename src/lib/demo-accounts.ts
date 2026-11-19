// Demo accounts shown on the login page. Keep all credentials in this one file.
export type DemoRole = 'user' | 'admin' | 'superadmin';

export const DEMO_ACCOUNTS: { role: DemoRole; email: string; password: string }[] = [
  { role: 'user', email: 'usertest@gmail.com', password: 'user123' },
  { role: 'admin', email: 'admintest@gmail.com', password: 'admin123' },
  { role: 'superadmin', email: 'ysufimanuel@gmail.com', password: 'super123' },
];

export const DEMO_EMAILS = DEMO_ACCOUNTS.map((a) => a.email.toLowerCase());
export const isDemoEmail = (email?: string | null) => !!email && DEMO_EMAILS.includes(email.toLowerCase());
