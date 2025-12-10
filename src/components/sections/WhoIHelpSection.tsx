import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const people = [
  {
    title: 'Youth & teen athletes',
    description: 'Building confidence, supporting growth, and keeping training safe for young performers.',
    accent: 'border-t-4 border-brand-navy',
  },
  {
    title: 'Adult recreational athletes',
    description: 'Balancing work, family, and sport with practical recovery and mobility strategies.',
    accent: 'border-t-4 border-brand-green',
  },
  {
    title: 'Active people with pain',
    description: 'Reducing day-to-day discomfort from training, desk time, or busy schedules.',
    accent: 'border-t-4 border-brand-amber',
  },
];

export function WhoIHelpSection() {
  return (
    <Section id="who-i-help" variant="muted">
      <div className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Who I help"
          title="Tailored support for athletes and active people"
          subtitle="Whether you’re developing as a young athlete or balancing training with life, I adjust treatment and education to your context."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {people.map((item) => (
            <Card key={item.title} className={`${item.accent} h-full`}>
              <h3 className="text-xl font-semibold text-brand-charcoal mb-2">{item.title}</h3>
              <p className="text-slate-600">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default WhoIHelpSection;
