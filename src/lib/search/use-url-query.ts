'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';

/** useState('') yang terisi dari ?q= (hasil pencarian global) dan ikut berubah saat q berubah. */
export function useUrlQuery() {
  const param = useSearchParams()?.get('q') ?? '';
  const [value, setValue] = React.useState(param);
  React.useEffect(() => { setValue(param); }, [param]);
  return [value, setValue] as const;
}
