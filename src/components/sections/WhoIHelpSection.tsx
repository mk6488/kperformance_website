import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const people = [
  {
    title: 'Youth & teen athletes',
    description:
      'Rowers, runners, footballers, dancers, swimmers, and school-sport athletes building strength and resilience, with parents kept in the loop.',
    accent: 'border-t-4 border-brand-navy',
  },
  {
    title: 'Adult recreational athletes',
    description: 'Active adults in sport who want to keep moving well — secondary to the youth focus.',
    accent: 'border-t-4 border-brand-green',
  },
  {
    title: 'Recurring niggles or pain',
    description: 'Stubborn aches from work, training, or past injuries that keep flaring when you load up again.',
    accent: 'border-t-4 border-brand-amber',
  },
  {
    title: 'Returning from injury',
    description: 'Getting back to sport after time out, with a plan that respects your sport, schedule, and goals.',
    accent: 'border-t-4 border-brand-blue',
  },
];

export function WhoIHelpSection() {
  return (
    <Section id="who-i-help" variant="muted">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Who I help"
          title="Supporting athletes, parents, and active people"
          subtitle="Youth athletes first, with clear communication for parents/guardians — and support for active adults when needed."
        />
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
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



