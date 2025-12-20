import type { ReactNode } from 'react';

type CardProps = {
  className?: string;
  children: ReactNode;
};

export function Card({ className = '', children }: CardProps) {
  const classes = [
    'rounded-xl bg-white shadow-sm border border-slate-100 p-5 sm:p-6',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}

export default Card;



