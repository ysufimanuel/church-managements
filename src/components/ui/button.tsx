import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
type Size = 'default' | 'sm' | 'lg' | 'icon';

const variants: Record<Variant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-white/10 border border-white/10 text-secondary-foreground hover:bg-white/15',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-white/20 bg-white/5',
  ghost: 'hover:bg-white/10',
};
const sizes: Record<Size, string> = {
  default: 'h-10 px-4 py-2', sm: 'h-9 px-3 text-sm', lg: 'h-11 px-8', icon: 'h-10 w-10',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant; size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-[44px] md:min-h-0 cursor-pointer',
        'btn-fx', `btn-fx-${variant}`,
        variants[variant], sizes[size], className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
