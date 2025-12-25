import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const services = [
  {
    title: 'Assessment',
    points: ['Movement checks, strength tests, and history to find the main drivers.', 'Clear explanation in plain English.'],
  },
  {
    title: 'Hands-on treatment',
    points: ['Soft tissue therapy and sports massage to reduce pain and improve movement.', 'Targeted techniques based on the assessment.'],
  },
  {
    title: 'Movement & exercise',
    points: ['Simple drills you can do at home or between sessions.', 'Progressions that fit your sport, schedule, and equipment.'],
  },
  {
    title: 'Plan & next steps',
    points: ['What to do this week to keep improving.', 'How to know if you’re on track, and when to adjust.'],
  },
  {
    title: 'Performance testing',
    points: ['Quick baselines for strength, mobility, and movement quality.', 'Feedback you can share with coaches or keep for your own tracking.'],
  },
  {
    title: 'Mobile sessions',
    points: ['I come to you—home, club, or pitch.', 'Set up to minimise disruption to family life and training.'],
  },
];

export function ServicesSection() {
  return (
    <Section id="services">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Services"
          title="What a session includes"
          subtitle="Every session combines assessment, hands-on treatment, movement work, and a clear plan you can follow between visits."
        />
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="h-full flex flex-col gap-4">
              <div>
                <h3 className="text-xl font-semibold text-brand-charcoal">{service.title}</h3>
              </div>
              <ul className="space-y-2 text-slate-600">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand-green" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default ServicesSection;



