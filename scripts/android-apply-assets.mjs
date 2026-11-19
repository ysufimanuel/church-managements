#!/usr/bin/env node
// Memasang icon launcher GetChurchly dan splash video ke project Android hasil
// `npx cap add android`. Idempotent: aman dijalankan berulang kali.
//
// Env opsional (untuk test): ANDROID_DIR, PROJECT_ROOT
import {
  cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(process.env.PROJECT_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..'));
const androidDir = resolve(process.env.ANDROID_DIR || join(root, 'android'));
const iconSrc = join(root, 'assets', 'GetChurchly-App-Icon', 'android-res');
const splashVideo = join(root, 'assets', 'GetChurchly_Splash_4.8s.mp4');
const SPLASH_BG = '#040710'; // warna latar video splash (diukur dari frame awal & akhir)

const fail = (msg) => { console.error(`✗ ${msg}`); process.exit(1); };
const log = (msg) => console.log(`✓ ${msg}`);
const warn = (msg) => console.warn(`! ${msg}`);

if (!existsSync(androidDir)) fail(`Folder android/ tidak ditemukan di ${androidDir}. Jalankan "npx cap add android" dulu.`);
if (!existsSync(iconSrc)) fail(`Folder icon tidak ditemukan: ${iconSrc}`);
if (!existsSync(splashVideo)) fail(`Video splash tidak ditemukan: ${splashVideo}`);

// appId dibaca dari capacitor.config.ts agar tidak hardcode di dua tempat.
const cfg = readFileSync(join(root, 'capacitor.config.ts'), 'utf8');
const appId = /appId:\s*['"]([^'"]+)['"]/.exec(cfg)?.[1];
if (!appId) fail('appId tidak ditemukan di capacitor.config.ts');

const main = join(androidDir, 'app', 'src', 'main');
const res = join(main, 'res');
const manifestPath = join(main, 'AndroidManifest.xml');
if (!existsSync(manifestPath)) fail(`AndroidManifest.xml tidak ditemukan: ${manifestPath}`);
mkdirSync(res, { recursive: true });

// 1. Icon launcher -----------------------------------------------------------
// Hapus semua ic_launcher* bawaan Capacitor (png/webp/xml, termasuk _round) agar
// tidak terjadi resource duplikat, lalu salin icon GetChurchly.
for (const dir of readdirSync(res)) {
  if (!dir.startsWith('mipmap-')) continue;
  for (const file of readdirSync(join(res, dir))) {
    if (file.startsWith('ic_launcher')) rmSync(join(res, dir, file), { force: true });
  }
}
cpSync(iconSrc, res, { recursive: true });
log('Icon launcher GetChurchly dipasang');

// 2. Splash video + tema ------------------------------------------------------
mkdirSync(join(res, 'raw'), { recursive: true });
cpSync(splashVideo, join(res, 'raw', 'getchurchly_splash.mp4'));

mkdirSync(join(res, 'values'), { recursive: true });
writeFileSync(join(res, 'values', 'getchurchly_splash.xml'), `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="splash_background">${SPLASH_BG}</color>
    <style name="Theme.GetChurchly.Splash" parent="@android:style/Theme.DeviceDefault.NoActionBar">
        <item name="android:windowBackground">@color/splash_background</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:statusBarColor">@color/splash_background</item>
        <item name="android:navigationBarColor">@color/splash_background</item>
    </style>
</resources>
`);
mkdirSync(join(res, 'values-v31'), { recursive: true });
writeFileSync(join(res, 'values-v31', 'getchurchly_splash.xml'), `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.GetChurchly.Splash" parent="@android:style/Theme.DeviceDefault.NoActionBar">
        <item name="android:windowBackground">@color/splash_background</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:statusBarColor">@color/splash_background</item>
        <item name="android:navigationBarColor">@color/splash_background</item>
        <item name="android:windowSplashScreenBackground">@color/splash_background</item>
    </style>
</resources>
`);

// Splash bawaan Capacitor (logo default) tampil sebentar saat MainActivity memuat
// WebView. Ganti dengan warna polos agar transisi dari video mulus.
const stylesPath = join(res, 'values', 'styles.xml');
if (existsSync(stylesPath)) {
  const styles = readFileSync(stylesPath, 'utf8');
  const next = styles.replace(
    /(<item name="android:background">)@drawable\/splash(<\/item>)/g,
    '$1@color/splash_background$2',
  );
  if (next !== styles) { writeFileSync(stylesPath, next); log('Splash bawaan Capacitor diganti warna polos'); }
  else if (!styles.includes('@color/splash_background')) warn('styles.xml: referensi @drawable/splash tidak ditemukan, dilewati');
} else warn('styles.xml tidak ditemukan, dilewati');
log('Splash video + tema dipasang');

// 3. SplashActivity -----------------------------------------------------------
const javaDir = join(main, 'java', ...appId.split('.'));
mkdirSync(javaDir, { recursive: true });
writeFileSync(join(javaDir, 'SplashActivity.java'), `package ${appId};

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.VideoView;

/** Memutar splash video lalu membuka MainActivity (Capacitor). */
public class SplashActivity extends Activity {
    private static final long FALLBACK_TIMEOUT_MS = 7000L;

    private final Handler handler = new Handler(Looper.getMainLooper());
    private boolean launched = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        hideSystemUi();

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.parseColor("${SPLASH_BG}"));

        VideoView video = new VideoView(this);
        root.addView(video, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT,
                Gravity.CENTER));
        setContentView(root);

        video.setOnPreparedListener(mp -> {
            mp.setLooping(false);
            mp.setVolume(0f, 0f);
        });
        video.setOnCompletionListener(mp -> goToMain());
        video.setOnErrorListener((mp, what, extra) -> {
            goToMain();
            return true;
        });
        video.setVideoURI(Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.getchurchly_splash));
        video.start();

        // Pengaman: jangan pernah terjebak di splash jika video gagal berjalan.
        handler.postDelayed(this::goToMain, FALLBACK_TIMEOUT_MS);
    }

    private void goToMain() {
        if (launched) return;
        launched = true;
        handler.removeCallbacksAndMessages(null);
        Intent next = new Intent(this, MainActivity.class);
        Intent current = getIntent();
        if (current != null) {
            next.setData(current.getData());
            if (current.getExtras() != null) next.putExtras(current.getExtras());
        }
        startActivity(next);
        finish();
    }

    private void hideSystemUi() {
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }

    @Override
    protected void onDestroy() {
        handler.removeCallbacksAndMessages(null);
        super.onDestroy();
    }
}
`);
log(`SplashActivity.java dibuat (${appId})`);

// 4. AndroidManifest ----------------------------------------------------------
let manifest = readFileSync(manifestPath, 'utf8');

// Icon bulat memakai icon adaptif yang sama (icon bulat bawaan Capacitor sudah dihapus).
manifest = manifest.replace(/android:roundIcon="@mipmap\/ic_launcher_round"/, 'android:roundIcon="@mipmap/ic_launcher"');

if (!manifest.includes('.SplashActivity')) {
  // MainActivity tidak lagi menjadi launcher; SplashActivity yang jadi pintu masuk.
  const mainBlock = /<activity\b[^>]*android:name="(?:[\w.]*\.)?MainActivity"[^>]*>[\s\S]*?<\/activity>/.exec(manifest);
  if (!mainBlock) fail('Deklarasi MainActivity tidak ditemukan di AndroidManifest.xml');
  const patchedMain = mainBlock[0].replace(/<intent-filter>[\s\S]*?<\/intent-filter>\s*/g,
    (f) => (f.includes('android.intent.category.LAUNCHER') ? '' : f));
  manifest = manifest.replace(mainBlock[0], patchedMain);

  const splashDecl = `
        <activity
            android:name=".SplashActivity"
            android:exported="true"
            android:noHistory="true"
            android:screenOrientation="portrait"
            android:theme="@style/Theme.GetChurchly.Splash">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
`;
  if (!manifest.includes('</application>')) fail('Tag </application> tidak ditemukan di AndroidManifest.xml');
  manifest = manifest.replace('</application>', `${splashDecl}\n    </application>`);
}

if (!manifest.includes('android.permission.INTERNET')) {
  manifest = manifest.replace('</manifest>', '    <uses-permission android:name="android.permission.INTERNET" />\n</manifest>');
}
writeFileSync(manifestPath, manifest);

// Verifikasi akhir: harus tepat satu launcher, yaitu SplashActivity.
const launcherCount = (manifest.match(/android\.intent\.category\.LAUNCHER/g) || []).length;
if (launcherCount !== 1) fail(`Jumlah LAUNCHER di manifest = ${launcherCount}, seharusnya 1`);
if (!/\.SplashActivity[\s\S]*?android\.intent\.category\.LAUNCHER/.test(manifest)) fail('LAUNCHER bukan milik SplashActivity');
log('AndroidManifest.xml dipatch (SplashActivity jadi launcher)');
console.log('\nSelesai: icon + splash siap untuk ./gradlew assembleDebug');
