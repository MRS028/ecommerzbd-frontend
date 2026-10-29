import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export type AlertVariant = 'success' | 'error' | 'info' | 'warning';

interface AlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: AlertVariant;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
} as const;

const COLORS = {
  success: 'text-green-600 dark:text-green-400 bg-green-500/10',
  error: 'text-destructive bg-destructive/10',
  info: 'text-primary bg-primary/10',
  warning: 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10',
} as const;

export function AlertModal({
  open,
  onOpenChange,
  title,
  description,
  variant = 'info',
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  showCancel = false,
}: AlertModalProps) {
  const Icon = ICONS[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', COLORS[variant])}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-left">{title}</DialogTitle>
              {description && (
                <DialogDescription className="text-left mt-2">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          {showCancel && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {cancelText}
            </Button>
          )}
          <Button
            variant={variant === 'error' ? 'destructive' : 'default'}
            onClick={() => {
              onConfirm?.();
              onOpenChange(false);
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}