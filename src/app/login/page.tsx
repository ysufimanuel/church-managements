'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import gsap from 'gsap';
import { Check, Church, Copy, Eye, EyeOff, LogIn, ShieldCheck, UserPlus, X } from 'lucide-react';
import { loginAction } from '@/lib/actions/auth';
import { LangProvider, LangSwitcher, useLang } from '@/components/lang-context';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { DEMO_ACCOUNTS } from '@/lib/demo-accounts';

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

function DemoDialog({ onClose, onUse }: { onClose: () => void; onUse: (email: string, password: string) => void }) {
  const { t } = useLang();
  const [copied, setCopied] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    panelRef.current?.focus();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && panelRef.current) {
      gsap.fromTo(panelRef.current, { autoAlpha: 0, y: 16, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: 'power3.out' });
    }
    return () => document.removeEventListener('keydown', esc);
  }, [onClose]);

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t('demo-accounts')}
        className="relative z-10 max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-[#0d131d] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.6)] outline-none sm:p-6"
      >
        <div className="mb-1 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-cyan-300" />
            <h2 className="text-lg font-semibold text-white">{t('demo-accounts')}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label={t('demo-close')} className="btn-fx btn-fx-ghost rounded-md p-1.5 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-4 text-xs text-slate-400">{t('demo-subtitle')}</p>

        <ul className="space-y-3">
          {DEMO_ACCOUNTS.map((a) => (
            <li key={a.role} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
              <p className="text-sm font-semibold text-cyan-200">{t(`role-${a.role}`)}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{t(`demo-desc-${a.role}`)}</p>
              <dl className="mt-3 space-y-1.5 text-xs">
                {([['email', a.email], ['password', a.password]] as const).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-2 rounded-lg bg-black/25 px-2.5 py-1.5">
                    <div className="min-w-0">
                      <dt className="text-[10px] uppercase tracking-wide text-slate-500">{t(k)}</dt>
                      <dd className="truncate font-mono text-slate-200">{v}</dd>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(`${a.role}-${k}`, v)}
                      aria-label={`${t('demo-copy')} ${t(k)}`}
                      className="btn-fx btn-fx-ghost shrink-0 rounded-md p-1.5 text-slate-400 hover:text-cyan-200"
                    >
                      {copied === `${a.role}-${k}` ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                ))}
              </dl>
              <button
                type="button"
                onClick={() => onUse(a.email, a.password)}
                className="btn-fx btn-fx-default mt-3 h-10 w-full rounded-xl bg-primary text-xs font-semibold text-primary-foreground"
              >
                {t('demo-use')} {t(`role-${a.role}`)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LoginForm() {
  const { t, lang } = useLang();
  const [demoOpen, setDemoOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [state, formAction] = useFormState(loginAction, null);
  const [showPass, setShowPass] = useState(false);
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
    <>
    <div
      ref={cardRef}
      className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-[28px] border border-white/[0.10] bg-white/[0.055] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-8"
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

      <div className="mb-5 flex justify-center sm:mb-6">
        <button
          type="button"
          ref={logoRef}
          onClick={() => setDemoOpen(true)}
          aria-label={t('demo-open-hint')}
          title={t('demo-open-hint')}
          className="btn-fx btn-fx-ghost flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.14)] hover:border-cyan-300/50 sm:h-16 sm:w-16"
        >
          <Church className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.6} />
        </button>
      </div>

      <div ref={headerRef} className="mb-7 space-y-1.5 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300/80">FLOCKLY</p>
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{t('app-title')}</h1>
        <p className="text-xs text-slate-400 sm:text-sm">{t('created-by')}</p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-4">
        <input type="hidden" name="lang" value={lang} />
        <div className="space-y-2">
          <Label htmlFor="username" className="ml-1 text-xs font-medium text-slate-300">
            {t('username')}
          </Label>
          <Input
            id="username"
            name="username"
            placeholder={t('username-placeholder')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
              placeholder={t('password-placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="h-12 rounded-xl border-white/10 bg-slate-950/35 px-4 pr-12 text-sm text-white placeholder:text-slate-500 focus-visible:border-cyan-300/60 focus-visible:ring-cyan-300/20"
            />
            <button
              type="button"
              onClick={() => setShowPass((visible) => !visible)}
              className="btn-fx btn-fx-ghost absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition-colors hover:text-cyan-200"
              aria-label={showPass ? t('hide-password') : t('show-password')}
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
          <span>{t('no-church-account')}</span>
          <Link href="/register" className="inline-flex items-center gap-1 font-semibold text-cyan-300 transition-colors hover:text-cyan-100 hover:underline">
            <UserPlus className="h-3.5 w-3.5" />
            {t('register-church')}
          </Link>
        </div>

        <div className="border-t border-white/[0.08] pt-4">
          <div className="flex justify-center">
            <LangSwitcher />
          </div>
        </div>
      </div>
    </div>
      {demoOpen && (
        <DemoDialog
          onClose={() => setDemoOpen(false)}
          onUse={(email, pass) => {
            setUsername(email);
            setPassword(pass);
            setDemoOpen(false);
          }}
        />
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <LangProvider>
      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#090d14] px-4 py-10 font-sans text-white selection:bg-cyan-300/30">
        <div aria-hidden="true" className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.16),transparent_70%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.18),transparent_70%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025]" />
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.02]" />

        <LoginForm />
      </main>
    </LangProvider>
  );
}
