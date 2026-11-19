'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/** Mobile: tabel jadi kartu ringkas (CSS .table-cards); label kolom dari <th> -> data-label. */
export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  const ref = React.useRef<HTMLTableElement>(null);
  React.useEffect(() => {
    const table = ref.current;
    if (!table) return;
    const label = () => {
      const heads = Array.from(table.querySelectorAll('thead th')).map((h) => h.textContent?.trim() ?? '');
      table.querySelectorAll('tbody tr').forEach((tr) => {
        Array.from(tr.children).forEach((td, i) => {
          if (heads[i] && td.getAttribute('data-label') !== heads[i]) td.setAttribute('data-label', heads[i]);
        });
      });
    };
    label();
    const mo = new MutationObserver(label);
    mo.observe(table, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);
  return (
    <div className="glass relative w-full overflow-auto rounded-card">
      <table ref={ref} className={cn('table-cards w-full caption-bottom text-sm', className)} {...props} />
    </div>
  );
}
export function THead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('[&_tr]:border-b bg-white/5', className)} {...props} />;
}
export function TBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}
export function TR({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('border-b transition-colors hover:bg-white/5', className)} {...props} />;
}
export function TH({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn('h-11 px-4 text-left align-middle font-medium text-muted-foreground', className)} {...props} />;
}
export function TD({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('p-4 align-middle', className)} {...props} />;
}
