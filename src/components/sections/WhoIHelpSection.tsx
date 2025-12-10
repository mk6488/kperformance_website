import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const people = [
  {
    title: 'Youth & teen athletes',
    description:
      'Developing bodies need the right mix of hands-on care and age-appropriate strength foundations. Ideal for rowers, runners, footballers, dancers, swimmers, and school-sport athletes.',
    accent: 'border-t-4 border-brand-navy',
  },
  {
    title: 'Adult recreational athletes',
    description:
      'Whether you train for health, competition, or enjoyment, I help you reduce pain, recover smarter, and move with confidence.',
    accent: 'border-t-4 border-brand-green',
  },
  {
    title: 'Active people with pain',
    description:
      'Everyday aches, overuse injuries, and workplace tension. Soft tissue therapy and movement coaching can help you get back to feeling normal again.',
    accent: 'border-t-4 border-brand-amber',
  },
  {
    title: 'Parents of young athletes',
    description:
      'Support for your child’s sport, with clear communication, safeguarding awareness, and age-appropriate loading so they can enjoy their sport and stay healthy.',
    accent: 'border-t-4 border-brand-blue',
  },
];

export function WhoIHelpSection() {
  return (
    <Section id="who-i-help" variant="muted">
      <div className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Who I help"
          title="Supporting athletes, parents, and active people"
          subtitle="Whether you&apos;re a teen in sport, a busy parent, or an active adult managing work and training, support is tailored to your context."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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

