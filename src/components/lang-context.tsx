'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { translations, type Lang } from '@/lib/i18n';
import { translateServerMessage } from '@/lib/server-messages';
import { setCurrentLang } from '@/lib/lang-state';
import { WM_EN } from '@/lib/wm-en';

// Module-level copy of the active language so non-hook code (toasts, export builders) can localize.
let currentLang: Lang = 'en';
const syncLang = (l: Lang) => { currentLang = l; setCurrentLang(l); };
export const getLang = () => currentLang;
/** Translate a server-action message into the active UI language. */
/** Translate an Indonesian source literal (Web Manager UI) into English when the UI is English. */
export const tr = (s: string) => (currentLang === 'en' ? WM_EN[s] ?? s : s);
export const tm = (msg?: string | null) => translateServerMessage(currentLang, msg);

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; tm: (m?: string | null) => string }>({
  lang: 'en', setLang: () => {}, t: (k) => k, tm: (m) => m ?? '',
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  useEffect(() => {
    let saved: Lang = 'en';
    try {
      const v = localStorage.getItem('cmsLanguage');
      if (v === 'id' || v === 'en') saved = v;
    } catch {}
    syncLang(saved);
    setLangState(saved);
    document.documentElement.lang = saved;
  }, []);
  const setLang = (l: Lang) => {
    syncLang(l);
    setLangState(l);
    try { localStorage.setItem('cmsLanguage', l); } catch {}
    document.documentElement.lang = l;
  };
  const t = (k: string) => translations[lang][k] ?? translations.en[k] ?? k;
  return <LangContext.Provider value={{ lang, setLang, t, tm: (m) => translateServerMessage(lang, m) }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function LangSwitcher({ small }: { small?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div className="flex gap-1">
      {(['id', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`btn-fx btn-fx-row rounded px-2 py-1 text-xs font-medium cursor-pointer min-h-[32px] ${
            lang === l ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
