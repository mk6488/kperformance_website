import { ReactNode, useState } from 'react';

type Props = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function CollapsibleSection({ title, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-lg bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-semibold text-brand-navy">{title}</span>
        <span className="text-sm text-slate-600">{open ? 'Hide' : 'Show'}</span>
      </button>
      {open ? <div className="px-4 pb-4 space-y-2 text-sm text-brand-charcoal">{children}</div> : null}
    </div>
  );
}
