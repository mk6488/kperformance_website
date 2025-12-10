import type { ReactNode } from 'react';

type SectionVariant = 'default' | 'muted' | 'dark';

type SectionProps = {
  id?: string;
  variant?: SectionVariant;
  className?: string;
  children: ReactNode;
};

const variantClasses: Record<SectionVariant, string> = {
  default: 'bg-white',
  muted: 'bg-brand-offWhite',
  dark: 'bg-brand-slate text-white',
};

export function Section({ id, variant = 'default', className = '', children }: SectionProps) {
  const wrapperClasses = [variantClasses[variant], 'py-16 md:py-20', className]
    .filter(Boolean)
    .join(' ');

  return (
    <section id={id} className={wrapperClasses}>
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export default Section;
