'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Church, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function PublicHeader({ nav, churchName }: { nav: { label: string; href: string }[]; churchName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Church className="h-6 w-6 text-primary" />
          <span>{churchName}</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <Link key={n.href + n.label} href={n.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === n.href ? 'text-primary' : 'text-muted-foreground'}`}>
              {n.label}
            </Link>
          ))}
          <Link href="/login" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Login</Link>
        </nav>
        <button className="btn-fx btn-fx-ghost p-2 md:hidden cursor-pointer" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <nav className="border-t bg-background p-4 md:hidden">
          {nav.map((n) => (
            <Link key={n.href + n.label} href={n.href} onClick={() => setOpen(false)}
              className="block min-h-[44px] py-3 text-sm font-medium text-muted-foreground hover:text-primary">
              {n.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="mt-2 block rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground">Login</Link>
        </nav>
      )}
    </header>
  );
}
