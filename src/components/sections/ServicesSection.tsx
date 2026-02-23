import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const performanceServices = [
  {
    title: 'Strength & power development',
    points: ['Age-appropriate loading and progressions', 'Programmes built around sport and school demands'],
  },
  {
    title: 'Speed, agility & movement',
    points: ['Acceleration, deceleration, and change-of-direction', 'Running mechanics and athletic movement quality'],
  },
  {
    title: 'Injury resilience',
    points: ['Build robust tissues and movement patterns', 'Plan training loads around growth and competition cycles'],
  },
  {
    title: 'Athlete confidence',
    points: ['Testing and progress tracking athletes understand', 'Clear communication with parent/guardian where needed'],
  },
];

const therapyServices = [
  {
    title: 'Soft tissue therapy add-on',
    points: ['Hands-on treatment for pain and tightness', 'Useful in-season support for busy youth athletes'],
  },
  {
    title: 'Recovery support',
    points: ['Mobility and tissue-care strategies', 'Simple plans to manage flare-ups and keep training'],
  },
];

export function ServicesSection() {
  return (
    <Section id="services">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Services"
          title="Coaching built for youth athletes"
          subtitle="Performance coaching leads the offer. Therapy remains available as targeted support when needed."
        />

        <div className="space-y-4">
          <h3 id="performance" className="text-xl font-semibold text-brand-navy">
            Youth Performance Coaching (Primary)
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr items-stretch">
            {performanceServices.map((service) => (
              <Card key={`perf-${service.title}`} className="h-full flex flex-col gap-4 hover-lift">
                <h4 className="text-lg font-semibold text-brand-charcoal">{service.title}</h4>
                <ul className="space-y-2 text-slate-600">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-green" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 id="therapy" className="text-xl font-semibold text-brand-navy/80">
            Soft Tissue Therapy (Secondary)
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 auto-rows-fr items-stretch">
            {therapyServices.map((service) => (
              <Card key={`therapy-${service.title}`} className="h-full flex flex-col gap-4 border-slate-200/80">
                <h4 className="text-lg font-semibold text-brand-charcoal">{service.title}</h4>
                <ul className="space-y-2 text-slate-600">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-blue" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default ServicesSection;
