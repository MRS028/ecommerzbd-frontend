// src/shared/hooks/useAlert.ts
import { useCallback, useState } from 'react';
import type { AlertVariant } from '@/shared/components/common/AlertModal';

export interface AlertState {
  open: boolean;
  title: string;
  description?: string;
  variant: AlertVariant;
}

const INITIAL: AlertState = {
  open: false,
  title: '',
  variant: 'info',
};

export function useAlert() {
  const [alert, setAlert] = useState<AlertState>(INITIAL);

  const show = useCallback(
    (opts: { title: string; description?: string; variant?: AlertVariant }) => {
      setAlert({
        open: true,
        title: opts.title,
        description: opts.description,
        variant: opts.variant ?? 'info',
      });
    },
    []
  );

  const hide = useCallback(
    () => setAlert((s) => ({ ...s, open: false })),
    []
  );

  return { alert, show, hide };
}