import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const steps = [
  {
    title: 'Enquiry + athlete goals',
    description: 'Quick call to understand sport, training age, and current goals.',
  },
  {
    title: 'Performance assessment',
    description: 'Movement, strength, and performance baseline to tailor the right coaching plan.',
  },
  {
    title: 'Structured coaching progression',
    description: 'Weekly coaching with clear progression and optional therapy support when required.',
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" variant="muted">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="How it works"
          title="A clear coaching journey"
          subtitle="Built to make progress simple for youth athletes and parents."
        />

        <div className="flex flex-col gap-5 md:flex-row md:gap-8">
          {steps.map((step, index) => (
            <Card key={step.title} className="flex-1 flex gap-4 items-start hover-lift">
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
