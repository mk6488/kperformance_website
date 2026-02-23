import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const people = [
  {
    title: 'Teen athletes chasing performance',
    description:
      'Football, rugby, athletics, dance, and multi-sport athletes who want to move better, get stronger, and perform with confidence.',
    accent: 'border-t-4 border-brand-navy',
  },
  {
    title: 'Parents seeking expert support',
    description: 'Families wanting safe, structured, and age-appropriate coaching with clear progress feedback.',
    accent: 'border-t-4 border-brand-green',
  },
  {
    title: 'Athletes returning from setbacks',
    description: 'Support for rebuilding load tolerance, movement quality, and confidence after pain or interruption.',
    accent: 'border-t-4 border-brand-blue',
  },
  {
    title: 'Active adults (limited slots)',
    description: 'Secondary offer for adults who need coaching or therapy support around sport and training.',
    accent: 'border-t-4 border-brand-amber',
  },
];

export function WhoIHelpSection() {
  return (
    <Section id="who-i-help" variant="muted">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Who I help"
          title="Youth athletes are the priority"
          subtitle="Coaching is designed around developing young athletes first, with parents and guardians included throughout."
        />
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {people.map((item) => (
            <Card key={item.title} className={`${item.accent} h-full hover-lift`}>
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
