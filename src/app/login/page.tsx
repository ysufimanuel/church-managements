'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '@/lib/actions/auth';
import { LangProvider, LangSwitcher, useLang } from '@/components/lang-context';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { Church, Eye, EyeOff, LogIn, Info } from 'lucide-react';
import { useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useLang();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      <LogIn className="h-4 w-4" /> {pending ? t('loading') : t('login')}
    </Button>
  );
}

function LoginForm() {
  const { t } = useLang();
  const [state, formAction] = useFormState(loginAction, null);
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-xl">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Church className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-xl font-bold">{t('app-title')}</h1>
        <p className="text-sm text-muted-foreground">{t('app-subtitle')}</p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">{t('username')}</Label>
          <Input id="username" name="username" placeholder="Masukkan username" required autoComplete="username" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t('password')}</Label>
          <div className="relative">
            <Input id="password" name="password" type={showPass ? 'text' : 'password'} placeholder="Masukkan password" required autoComplete="current-password" />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Toggle password">
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" name="remember" className="rounded border-input" /> {t('remember-me')}
          </label>
          <span className="text-primary">{t('forgot-password')}</span>
        </div>
        {state?.error && (
          <p className="rounded-md bg-destructive/20 px-3 py-2 text-sm text-destructive">{state.error}</p>
        )}
        <SubmitButton />
      </form>

      <p className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
        <Info className="h-3 w-3" /> {t('default-login')}
      </p>
      <div className="mt-4 flex justify-center"><LangSwitcher /></div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <LangProvider>
      <main className="flex min-h-dvh items-center justify-center bg-background p-4">
        <LoginForm />
      </main>
    </LangProvider>
  );
}
