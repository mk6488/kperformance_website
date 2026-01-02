import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const steps = [
  {
    title: 'Free chat / enquiry',
    description: '5–10 minutes to outline your sport, goals, and any pain so we decide next steps.',
  },
  {
    title: 'Assessment & session',
    description: '45–60 minutes (70 for a first session) with movement checks plus coaching or hands-on therapy, with clear explanations.',
  },
  {
    title: 'Follow-up plan & support',
    description: 'You’ll get a simple plan to follow; we’ll review progress next session if needed.',
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" variant="muted">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="How it works"
          title="Simple steps from enquiry to support"
          subtitle="A friendly first chat, then assessment-led coaching or therapy, and ongoing guidance that fits around school, training, or work."
        />

        <div className="flex flex-col gap-5 md:flex-row md:gap-8">
          {steps.map((step, index) => (
            <Card key={step.title} className="flex-1 flex gap-4 items-start">
              <div className="h-10 w-10 min-h-[2.5rem] min-w-[2.5rem] shrink-0 rounded-full bg-brand-navy text-white flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-brand-charcoal">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default HowItWorksSection;



