'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { Church, ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { registerChurchAction } from '@/lib/actions/registration';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      <UserPlus className="h-4 w-4" /> {pending ? 'Mendaftarkan...' : 'Daftarkan Gereja'}
    </Button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerChurchAction, null);

  return (
    <main className="min-h-dvh bg-background p-4">
      <div className="mx-auto flex min-h-dvh w-full max-w-3xl items-center justify-center py-8">
        <div className="w-full rounded-2xl border bg-card p-6 shadow-xl md:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Church className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Daftar Gereja</h1>
            <p className="mt-1 text-sm text-muted-foreground">Buat akun untuk gereja Anda</p>
          </div>

          <form action={formAction} className="space-y-7">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Data Gereja</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nama Gereja" name="church_name" placeholder="Gereja Kristen Indonesia" required />
                <Field label="Alamat" name="church_address" placeholder="Jl. Gereja No. 1" />
                <Field label="Kota" name="church_city" placeholder="Jakarta" />
                <Field label="Telepon" name="church_phone" placeholder="021-12345678" />
                <Field label="Email Gereja" name="church_email" type="email" placeholder="info@gereja.com" />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Akun Super Admin</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nama Admin" name="admin_name" placeholder="Nama lengkap" required />
                <Field label="Username" name="username" placeholder="username_admin" required autoComplete="username" />
                <Field label="Email (untuk login)" name="admin_email" type="email" placeholder="admin@gereja.com" required autoComplete="email" />
                <Field label="Password" name="password" type="password" placeholder="Minimal 6 karakter" minLength={6} required autoComplete="new-password" />
              </div>
            </section>

            {state?.error && <p className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">{state.error}</p>}
            {state?.success && <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{state.success}</p>}

            <SubmitButton />
          </form>

          <div className="mt-5 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, name, type = 'text', ...props }: React.ComponentProps<typeof Input> & { label: string; name: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} {...props} />
    </div>
  );
}
