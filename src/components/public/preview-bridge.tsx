'use client';

import { useEffect } from 'react';

/**
 * Jembatan antara halaman preview Draft (di dalam iframe Visual Editor) dan editor di luarnya.
 * Hanya aktif jika halaman dibuka di dalam iframe dengan ?preview=draft&edit=1.
 *
 * - Klik pada bagian halaman  -> kirim { type: 'wm:select', id } ke editor
 * - Editor mengirim { type: 'wm:focus', id, scroll } -> bagian itu diberi highlight
 * - Link di dalam preview dinonaktifkan agar admin tidak tersasar keluar dari halaman yang sedang diedit
 * - Posisi scroll dipertahankan saat preview dimuat ulang setelah autosave
 */
export function PreviewBridge() {
  useEffect(() => {
    if (window.parent === window) return;
    const origin = window.location.origin;

    const style = document.createElement('style');
    style.setAttribute('data-wm-bridge', 'true');
    style.textContent = `
      [data-section-id]{cursor:pointer;outline:2px solid transparent;outline-offset:-2px;scroll-margin-top:96px;transition:outline-color .15s ease}
      [data-section-id]:hover{outline-color:rgba(0,229,255,.75)}
      [data-section-id][data-wm-selected="true"]{outline:3px solid #00E5FF;outline-offset:-3px}
      [data-section-id]::after{content:'Klik untuk edit';position:absolute;top:10px;right:10px;z-index:60;padding:6px 12px;border-radius:999px;background:#00E5FF;color:#0F1117;font:600 12px/1 system-ui,sans-serif;opacity:0;pointer-events:none;transition:opacity .15s ease}
      [data-section-id]:hover::after{opacity:1}
      [data-section-id][data-wm-selected="true"]::after{content:'Sedang diedit';opacity:1}
      @media (prefers-reduced-motion:reduce){[data-section-id],[data-section-id]::after{transition:none}}
    `;
    document.head.appendChild(style);

    const scrollKey = `wm-scroll:${window.location.pathname}`;
    try {
      const saved = Number(window.sessionStorage.getItem(scrollKey));
      if (saved > 0) requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, saved)));
    } catch {
      /* sessionStorage bisa tidak tersedia; abaikan */
    }
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        try { window.sessionStorage.setItem(scrollKey, String(window.scrollY)); } catch { /* abaikan */ }
      });
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('a')) event.preventDefault();
      const section = target.closest('[data-section-id]') as HTMLElement | null;
      if (!section) return;
      const id = Number(section.dataset.sectionId);
      if (Number.isSafeInteger(id)) window.parent.postMessage({ type: 'wm:select', id }, origin);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== origin || event.source !== window.parent) return;
      const data = event.data as { type?: string; id?: number | null; scroll?: boolean } | null;
      if (!data || data.type !== 'wm:focus') return;
      document.querySelectorAll('[data-wm-selected]').forEach((node) => node.removeAttribute('data-wm-selected'));
      if (data.id == null) return;
      const el = document.querySelector(`[data-section-id="${String(Number(data.id))}"]`);
      if (!el) return;
      el.setAttribute('data-wm-selected', 'true');
      if (data.scroll) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 80 || rect.top > window.innerHeight - 80) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onClick, true);
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: 'wm:ready' }, origin);

    return () => {
      style.remove();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('message', onMessage);
    };
  }, []);

  return null;
}
