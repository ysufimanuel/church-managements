'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import gsap from 'gsap';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Church,
  Eye,
  EyeOff,
  Info,
} from 'lucide-react';
import { registerChurchAction } from '@/lib/actions/registration';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { LangProvider, LangSwitcher, useLang } from '@/components/lang-context';

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useLang();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="btn-fx btn-fx-default h-11 w-full rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-[0_0_22px_rgba(0,229,255,0.22)] transition-all hover:brightness-110 sm:h-12 sm:text-sm"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          {t('registering')}
        </>
      ) : (
        <>
          <CheckCircle2 className="h-4 w-4" />
          {t('register-submit')}
        </>
      )}
    </Button>
  );
}

function RegisterForm() {
  const { t, tm } = useLang();
  const [state, formAction] = useFormState(registerChurchAction, null);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [churchData, setChurchData] = useState({
    church_name: '',
    church_address: '',
    church_city: '',
    church_phone: '',
    church_email: '',
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);
  const firstStepRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set([cardRef.current, logoRef.current, headerRef.current], { clearProps: 'all' });
        return;
      }

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(cardRef.current, { autoAlpha: 0, y: 20, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.65 })
        .fromTo(logoRef.current, { autoAlpha: 0, scale: 0.7, rotate: -12 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(1.6)' }, '-=0.3')
        .fromTo(headerRef.current?.children || [], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.35 }, '-=0.2');
    }, cardRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!stepContentRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(
      stepContentRef.current,
      { autoAlpha: 0, x: step === 2 ? 18 : -18 },
      { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power2.out' }
    );
  }, [step]);

  useEffect(() => {
    if (!state?.error || !cardRef.current) return;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(cardRef.current, { x: -7 }, { x: 7, duration: 0.07, repeat: 5, yoyo: true, clearProps: 'x' });
      if (errorRef.current) {
        gsap.fromTo(errorRef.current, { autoAlpha: 0, y: -5 }, { autoAlpha: 1, y: 0, duration: 0.25 });
      }
    }
    setStep(2);
  }, [state?.error]);

  function goToAccountStep() {
    if (!firstStepRef.current?.querySelector('input:invalid')) {
      setStep(2);
      return;
    }
    const invalid = firstStepRef.current.querySelector('input:invalid') as HTMLInputElement | null;
    invalid?.reportValidity();
  }

  function updateChurchData(event: React.ChangeEvent<HTMLInputElement>) {
    setChurchData((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#090d14] px-4 py-8 font-sans text-white selection:bg-cyan-300/30 sm:py-10">
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-blue-600/15 blur-[110px]" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025]" />

      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-[460px] overflow-hidden rounded-[28px] border border-white/[0.10] bg-white/[0.055] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-8"
      >
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

        <div className="mb-5 flex justify-center sm:mb-6">
          <div ref={logoRef} className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.14)]">
            <Church className="h-7 w-7" strokeWidth={1.6} />
          </div>
        </div>

        <div ref={headerRef} className="mb-6 space-y-1.5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300/80">{t('get-started')}</p>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{t('register-church')}</h1>
          <p className="text-xs text-slate-400 sm:text-sm">{t('reg-subtitle')}</p>

          <div className="mx-auto flex max-w-[150px] items-center gap-2 pt-3" aria-label={t('step-of').replace('{n}', String(step))}>
            <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-cyan-400' : 'bg-white/15'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-cyan-400' : 'bg-white/15'}`} />
          </div>
          <p className="pt-1 text-[10px] text-slate-500">{t('step-of').replace('{n}', String(step))}</p>
        </div>

        <form action={formAction}>
          <div ref={stepContentRef}>
            {step === 1 ? (
              <div ref={firstStepRef} className="space-y-3.5">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300">{t('reg-step1')}</p>
                <Field label={t('church-name-label')} name="church_name" placeholder={t('ph-church')} required value={churchData.church_name} onChange={updateChurchData} />
                <Field label={t('church-address')} name="church_address" placeholder={t('ph-address')} required value={churchData.church_address} onChange={updateChurchData} />
                <div className="grid grid-cols-2 gap-2.5">
                  <Field label={t('city-label')} name="church_city" placeholder={t('ph-city')} required value={churchData.church_city} onChange={updateChurchData} />
                  <Field label={t('phone')} name="church_phone" type="tel" placeholder="021-xxxx" required value={churchData.church_phone} onChange={updateChurchData} />
                </div>
                <Field label={t('church-email')} name="church_email" type="email" placeholder="info@gereja.com" required value={churchData.church_email} onChange={updateChurchData} />

                <Button type="button" onClick={goToAccountStep} className="btn-fx btn-fx-default mt-3 h-11 w-full rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-[0_0_22px_rgba(0,229,255,0.22)] transition-all hover:brightness-110 sm:h-12 sm:text-sm">
                  {t('next-admin')} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3.5">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300">{t('reg-step2')}</p>
                {Object.entries(churchData).map(([name, value]) => (
                  <input key={name} type="hidden" name={name} value={value} />
                ))}
                <Field label={t('admin-name')} name="admin_name" placeholder={t('ph-fullname')} required autoComplete="name" />
                <Field label={t('username')} name="username" placeholder="username_admin" required autoComplete="username" />
                <Field label={t('email-login')} name="admin_email" type="email" placeholder="admin@gereja.com" required autoComplete="email" />
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="ml-1 text-[11px] font-medium text-slate-300">{t('password')}</Label>
                  <div className="relative">
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder={t('ph-pass-min')} minLength={6} required autoComplete="new-password" className="h-11 rounded-xl border-white/10 bg-slate-950/35 px-3.5 pr-11 text-xs text-white placeholder:text-slate-500 focus-visible:border-cyan-300/60 focus-visible:ring-cyan-300/20" />
                    <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="btn-fx btn-fx-ghost absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition-colors hover:text-cyan-200" aria-label={showPassword ? t('hide-password') : t('show-password')} aria-pressed={showPassword}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {state?.error && <p ref={errorRef} role="alert" aria-live="polite" className="rounded-xl border border-red-400/20 bg-red-500/10 px-3.5 py-3 text-center text-xs font-medium text-red-300">{tm(state.error)}</p>}
                {state?.success && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3.5 py-3 text-center text-xs font-medium text-emerald-300">{tm(state.success)}</p>}

                <div className="flex gap-2 pt-1">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="btn-fx btn-fx-ghost h-11 w-[38%] rounded-xl border-white/10 bg-white/[0.04] text-xs text-slate-300 hover:bg-white/10">
                    <ArrowLeft className="h-4 w-4" /> {t('back')}
                  </Button>
                  <div className="w-[62%]"><SubmitButton /></div>
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="mt-6 border-t border-white/[0.08] pt-4 text-center">
          <div className="mb-3 flex justify-center"><LangSwitcher /></div>
          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            {t('have-account')}
            <Link href="/login" className="font-semibold text-cyan-300 transition-colors hover:text-cyan-100 hover:underline">{t('login')}</Link>
          </p>
          <p className="mt-3 flex items-center justify-center gap-1 text-[10px] text-slate-500">
            <Info className="h-3 w-3" /> {t('reg-footer')}
          </p>
        </div>
      </div>
    </main>
  );
}

function Field({ label, name, type = 'text', ...props }: React.ComponentProps<typeof Input> & { label: string; name: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="ml-1 text-[11px] font-medium text-slate-300">{label}</Label>
      <Input id={name} name={name} type={type} {...props} className="h-11 rounded-xl border-white/10 bg-slate-950/35 px-3.5 text-xs text-white placeholder:text-slate-500 focus-visible:border-cyan-300/60 focus-visible:ring-cyan-300/20" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <LangProvider>
      <RegisterForm />
    </LangProvider>
  );
}
