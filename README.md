# WKC Church Website

Vite + React + TypeScript + Tailwind CSS 3.4. Dark Mode First.

```bash
npm install
npm run dev      # http://localhost:5173 (juga bisa diakses dari HP lewat IP LAN)
npm run build
```

- Desain dan keputusan: `docs/UI-UX-BLUEPRINT.md`
- Token: `docs/design-tokens.json` (sumber kebenaran), diterapkan di `tailwind.config.ts`
- Konten yang bisa diedit tanpa menyentuh komponen: `src/content/`
- Placeholder yang masih harus diisi gereja: `grep -rn "\[" src/content`
- Skills motion dan mobile di `skills/` dipakai sebagai aturan saat menambah animasi atau menyentuh perilaku HP
