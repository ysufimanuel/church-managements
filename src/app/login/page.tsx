'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import gsap from 'gsap';
import { Church, Eye, EyeOff, LogIn, UserPlus, ShieldCheck, X } from 'lucide-react';
import { loginAction } from '@/lib/actions/auth';
import { LangProvider, LangSwitcher, useLang } from '@/components/lang-context';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useLang();

  return (
    <Button
      type="submit"
      className="btn-fx btn-fx-default mt-2 h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgba(0,229,255,0.22)] transition-all hover:brightness-110"
      disabled={pending}
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          {t('loading')}
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          {t('login')}
        </>
      )}
    </Button>
  );
}

function LoginForm() {
  const { t } = useLang();
  const [state, formAction] = useFormState(loginAction, null);
  const [showPass, setShowPass] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) {
        gsap.set([cardRef.current, logoRef.current, headerRef.current, formRef.current, footerRef.current], {
          clearProps: 'all',
        });
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .fromTo(cardRef.current, { autoAlpha: 0, y: 24, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 })
        .fromTo(logoRef.current, { autoAlpha: 0, scale: 0.7, rotate: -12 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.55, ease: 'back.out(1.6)' }, '-=0.35')
        .fromTo(headerRef.current?.children || [], { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: 0.09, duration: 0.4 }, '-=0.25')
        .fromTo(formRef.current?.children || [], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.4 }, '-=0.18')
        .fromTo(footerRef.current?.children || [], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.35 }, '-=0.15');
    }, cardRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!state?.error || !cardRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.fromTo(
      cardRef.current,
      { x: -7 },
      { x: 7, duration: 0.07, repeat: 5, yoyo: true, clearProps: 'x', ease: 'power1.inOut' }
    );
    if (errorRef.current) {
      gsap.fromTo(errorRef.current, { autoAlpha: 0, y: -5 }, { autoAlpha: 1, y: 0, duration: 0.25 });
    }
  }, [state?.error]);

  return (
    <div
      ref={cardRef}
      className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-[28px] border border-white/[0.10] bg-white/[0.055] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-8"
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

      <div className="mb-5 flex justify-center sm:mb-6">
        <button type="button" onClick={() => setDemoOpen((open) => !open)} aria-label={t('demo-accounts')} aria-expanded={demoOpen}
          ref={logoRef as React.RefObject<HTMLButtonElement>}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.14)] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 sm:h-16 sm:w-16">
          <Church className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.6} />
        </button>
      </div>

      <div ref={headerRef} className="mb-7 space-y-1.5 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300/80">FLOCKLY</p>
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{t('app-title')}</h1>
        <p className="text-xs text-slate-400 sm:text-sm">{t('app-subtitle')}</p>
        <p className="pt-1 text-[11px] font-medium tracking-wide text-cyan-300/80">{t('created-by')}</p>
      </div>

      {demoOpen && <section className="mb-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4 text-left" aria-label={t('demo-accounts')}>
        <div className="mb-3 flex items-center justify-between gap-2"><div className="flex items-center gap-2 text-sm font-semibold text-cyan-100"><ShieldCheck className="h-4 w-4" />{t('demo-accounts')}</div><button type="button" onClick={() => setDemoOpen(false)} aria-label={t('close')} className="rounded-lg p-1 text-slate-400 hover:bg-white/10"><X className="h-4 w-4" /></button></div>
        <p className="mb-3 text-[11px] leading-relaxed text-slate-300">{t('demo-intro')}</p>
        {[
          { role: 'User', email: 'usertest@gmail.com', password: 'user123', description: t('demo-user-desc') },
          { role: 'Admin', email: 'admintest@gmail.com', password: 'admin123', description: t('demo-admin-desc') },
          { role: 'Super Admin', email: 'ysufimanuel@gmail.com', password: 'super123', description: t('demo-super-desc') },
        ].map((demo) => <button key={demo.email} type="button" onClick={() => { if (usernameRef.current) usernameRef.current.value = demo.email; if (passwordRef.current) passwordRef.current.value = demo.password; setDemoOpen(false); }} className="mb-2 block w-full rounded-xl border border-white/10 bg-black/20 p-3 text-left transition-colors hover:border-cyan-300/40 hover:bg-white/[0.06]">
          <span className="mb-1 block text-xs font-bold text-cyan-200">{demo.role}</span><span className="block break-all text-xs text-white">{demo.email}</span><span className="mt-0.5 block text-xs text-slate-400">{t('password')}: {demo.password}</span><span className="mt-2 block text-[11px] leading-relaxed text-slate-400">{demo.description}</span>
        </button>)}
        <p className="mt-2 text-[10px] leading-relaxed text-slate-500">{t('demo-select-hint')}</p>
      </section>}
      <form ref={formRef} action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="ml-1 text-xs font-medium text-slate-300">
            {t('username')}
          </Label>
          <Input
            id="username"
            name="username"
            ref={usernameRef}
            placeholder={t('login-username-placeholder')}
            required
            autoComplete="username"
            className="h-12 rounded-xl border-white/10 bg-slate-950/35 px-4 text-sm text-white placeholder:text-slate-500 focus-visible:border-cyan-300/60 focus-visible:ring-cyan-300/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="ml-1 text-xs font-medium text-slate-300">
            {t('password')}
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPass ? 'text' : 'password'}
              ref={passwordRef}
              placeholder={t('login-password-placeholder')}
              required
              autoComplete="current-password"
              className="h-12 rounded-xl border-white/10 bg-slate-950/35 px-4 pr-12 text-sm text-white placeholder:text-slate-500 focus-visible:border-cyan-300/60 focus-visible:ring-cyan-300/20"
            />
            <button
              type="button"
              onClick={() => setShowPass((visible) => !visible)}
              className="btn-fx btn-fx-ghost absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition-colors hover:text-cyan-200"
              aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
              aria-pressed={showPass}
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end pt-0.5 text-xs">
          <span className="cursor-default text-cyan-300/90">{t('forgot-password')}</span>
        </div>

        {state?.error && (
          <p
            ref={errorRef}
            role="alert"
            aria-live="polite"
            className="rounded-xl border border-red-400/20 bg-red-500/10 px-3.5 py-3 text-center text-xs font-medium text-red-300"
          >
            {state.error}
          </p>
        )}

        <SubmitButton />
      </form>

      <div ref={footerRef} className="mt-6 space-y-4 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <span>Belum punya akun gereja?</span>
          <Link href="/register" className="inline-flex items-center gap-1 font-semibold text-cyan-300 transition-colors hover:text-cyan-100 hover:underline">
            <UserPlus className="h-3.5 w-3.5" />
            Daftar Gereja
          </Link>
        </div>

        <div className="border-t border-white/[0.08] pt-4"><div className="flex justify-center"><LangSwitcher /></div></div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <LangProvider>
      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#090d14] px-4 py-10 font-sans text-white selection:bg-cyan-300/30">
        <div aria-hidden="true" className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-blue-600/15 blur-[110px]" />
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025]" />
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.02]" />

        <LoginForm />
      </main>
    </LangProvider>
  );
}
