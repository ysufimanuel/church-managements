import type { CapacitorConfig } from '@capacitor/cli';

// APK ini membungkus situs Vercel (Next.js + Supabase SSR memakai Server Actions
// dan middleware, jadi tidak bisa di-static-export). Ganti URL lewat env
// CAP_SERVER_URL saat build jika domain berubah.
const serverUrl = process.env.CAP_SERVER_URL || 'https://getchurchly.vercel.app';
const serverHost = new URL(serverUrl).host;

const config: CapacitorConfig = {
  appId: 'com.growthaxys.getchurchly',
  appName: 'GetChurchly',
  // Folder kecil berisi halaman fallback offline; bukan hasil build Next.js.
  webDir: 'www',
  backgroundColor: '#040710',
  server: {
    url: serverUrl,
    cleartext: false,
    androidScheme: 'https',
    allowNavigation: [serverHost, '*.supabase.co'],
    errorPath: 'offline.html',
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#040710',
  },
};

export default config;
