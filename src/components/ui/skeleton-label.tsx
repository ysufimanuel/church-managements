'use client';

import { useLang } from '@/components/lang-context';

/** Label tersembunyi (screen reader) untuk container skeleton aria-busy. */
export function SkeletonLabel() {
  const { t } = useLang();
  return <span role="status" className="sr-only">{t('loading')}</span>;
}
