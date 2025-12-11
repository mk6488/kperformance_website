import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const steps = [
  {
    title: 'Free chat / enquiry',
    description: 'We discuss your sport, goals, and any current pain or concerns to decide the best next steps.',
  },
  {
    title: 'Assessment & treatment',
    description: 'Mobile visit with movement checks and hands-on soft tissue therapy targeted to you.',
  },
  {
    title: 'Follow-up plan & support',
    description: 'Clear advice, exercises, and checkpoints so you know what to do between sessions.',
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" variant="muted">
      <div className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="How it works"
          title="Simple steps from enquiry to support"
          subtitle="A friendly first chat, focused treatment, and ongoing guidance that fits around school, training, or work."
        />

        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          {steps.map((step, index) => (
            <Card key={step.title} className="flex-1 flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-brand-navy text-white flex items-center justify-center font-semibold">
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



