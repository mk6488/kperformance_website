import { Section } from '../../components/ui/Section';
import { Card } from '../../components/ui/Card';
import { SectionHeading } from '../../components/ui/SectionHeading';

export default function AdminApp() {
  return (
    <Section id="admin" variant="muted">
      <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-6">
        <SectionHeading title="Admin dashboard" subtitle="Placeholder" align="left" />
        <Card>
          <p className="text-slate-700">Admin dashboard (placeholder)</p>
        </Card>
      </div>
    </Section>
  );
}
