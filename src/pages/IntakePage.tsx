import { Card } from '../components/ui/Card';
import { Section } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import IntakeWizard from '../components/intake/IntakeWizard';

export default function IntakePage() {
  return (
    <div className="bg-brand-offWhite text-brand-charcoal min-h-screen">
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-8">
          <SectionHeading
            align="left"
            title="New Patient Intake Form"
            subtitle="Save time and help Mike prepare before your first session. This quick intake covers your details, goals, and any important health notes."
          />

          <Card className="space-y-4">
            <p className="text-sm text-slate-600">
              If you need help while completing this form, please pause and contact Mike. You can also message
              via WhatsApp if you have a quick question.
            </p>
            <IntakeWizard />
          </Card>
        </div>
      </Section>
    </div>
  );
}
