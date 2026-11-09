'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { translations, type Lang } from '@/lib/i18n';

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: 'en', setLang: () => {}, t: (k) => k,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  useEffect(() => {
    const saved = (localStorage.getItem('cmsLanguage') as Lang) || 'en';
    setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('cmsLanguage', l);
  };
  const t = (k: string) => translations[lang][k] ?? k;
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
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
