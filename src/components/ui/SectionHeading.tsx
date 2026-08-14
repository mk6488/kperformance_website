type SectionHeadingProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({
  title,
  eyebrow,
  subtitle,
  align = 'center',
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col gap-2 sm:gap-3 ${alignment}`}>
      {eyebrow ? (
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-brand-blue">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl sm:text-3xl font-semibold text-brand-charcoal">{title}</h2>
      {subtitle ? <p className="text-base text-slate-600 max-w-3xl">{subtitle}</p> : null}
    </div>
  );
}

export default SectionHeading;



