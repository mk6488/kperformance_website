import { useState, ReactNode } from 'react';

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

type Props = {
  tabs: Tab[];
  defaultTabId?: string;
};

export function Tabs({ tabs, defaultTabId }: Props) {
  const initial = defaultTabId || (tabs.length > 0 ? tabs[0].id : '');
  const [active, setActive] = useState(initial);
  const activeTab = tabs.find((t) => t.id === active) || tabs[0];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active === t.id
                ? 'bg-white text-brand-navy border border-slate-200 shadow-sm'
                : 'bg-transparent text-slate-600 font-normal hover:text-brand-navy hover:bg-white/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{activeTab ? activeTab.content : null}</div>
    </div>
  );
}
