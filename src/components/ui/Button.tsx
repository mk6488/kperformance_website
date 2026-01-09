import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  className?: string;
};

const baseClasses =
  'inline-flex items-center justify-center rounded-full font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 min-h-[44px]';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-navy text-white px-6 py-3 hover:bg-brand-blue focus-visible:outline-brand-blue shadow-sm',
  secondary:
    'border border-brand-navy text-brand-navy bg-white/90 px-6 py-3 hover:bg-slate-100 focus-visible:outline-brand-navy',
  ghost:
    'text-brand-navy px-4 py-2 hover:bg-brand-offWhite focus-visible:outline-brand-navy',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const classes = [baseClasses, variantClasses[variant], className]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} {...props} />;
}

export default Button;



