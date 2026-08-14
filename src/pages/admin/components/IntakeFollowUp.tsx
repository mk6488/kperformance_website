import { Button } from '../../../components/ui/Button';

type Props = {
  followUpTemplates: Record<string, any>;
  copyMessage: string | null;
  replacements: { name: string; email: string };
  clientEmail?: string;
  copyFollowUp: (id: keyof typeof followUpTemplates) => Promise<{ body: string; subject: string } | undefined>;
  fillTemplate: (template: string, replacements: Record<string, string>) => string;
  makeMailto: (subject: string, body: string, to?: string) => string;
};

// Note: followUpTemplates is passed directly; typings kept permissive to avoid refactor of caller types.
export function IntakeFollowUp({
  followUpTemplates,
  copyMessage,
  replacements,
  clientEmail,
  copyFollowUp,
  fillTemplate,
  makeMailto,
}: Props) {
  const keys = Object.keys(followUpTemplates) as Array<keyof typeof followUpTemplates>;

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-brand-navy">Follow-up</h3>
      <div className="flex flex-wrap gap-2">
        {keys.map((id) => {
          const t: any = (followUpTemplates as any)[id];
          const label = t?.label || String(id);
          return (
            <Button
              key={String(id)}
              type="button"
              variant="secondary"
              className="text-sm"
              onClick={async () => {
                const filled = await copyFollowUp(id);
                if (filled) {
                  // noop; copyFollowUp handles status and toast
                }
              }}
            >
              {label}
            </Button>
          );
        })}
      </div>
      {copyMessage ? <p className="text-sm text-green-700">{copyMessage}</p> : null}
      <p className="text-xs text-slate-600">
        Templates copy to clipboard; status updates apply automatically when relevant. Optionally open your email client after
        copying.
      </p>
      <div className="grid sm:grid-cols-3 gap-2 text-xs">
        {keys.map((id) => {
          const t: any = (followUpTemplates as any)[id];
          const body = fillTemplate(t.body, replacements);
          const subject = fillTemplate(t.subject, replacements);
          return (
            <a
              key={`${String(id)}-mailto`}
              href={makeMailto(subject, body, clientEmail)}
              className="text-brand-blue hover:underline"
            >
              Open email: {t.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
