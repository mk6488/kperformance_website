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
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              active === t.id ? 'bg-brand-navy text-white' : 'bg-white text-brand-navy border border-slate-200'
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
