import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const performanceServices = [
  {
    title: 'Programming & S&C',
    points: ['Strength foundations for teen athletes', 'Age-appropriate loading with clear progressions'],
  },
  {
    title: 'Movement quality',
    points: ['Technique support for running, jumping, and change of direction', 'Warm-up and prep routines built for school/club demands'],
  },
  {
    title: 'Testing & tracking',
    points: ['Simple baselines for strength, power, and mobility', 'Shared progress updates for parents/guardians'],
  },
  {
    title: 'Injury risk reduction',
    points: ['Load management guidance around sport and exams', 'Confidence under training load'],
  },
];

const therapyServices = [
  {
    title: 'Assessment-led treatment',
    points: ['Movement checks and history to find what matters most', 'Soft tissue therapy and sports massage targeting your goals'],
  },
  {
    title: 'Movement coaching',
    points: ['Simple drills to support recovery and mobility', 'Progressions that fit your sport, schedule, and equipment'],
  },
  {
    title: 'Recovery & load support',
    points: ['Plans to balance training, work, and life', 'Advice for managing flare-ups and niggles'],
  },
  {
    title: 'Mobile visits',
    points: ['Delivered at home or pitch/club where appropriate', 'Set up to minimise disruption for families'],
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
          <div id="performance" className="h-full flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-brand-navy">Youth Performance Coaching</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 auto-rows-fr items-stretch">
              {performanceServices.map((service) => (
                <Card key={service.title} className="h-full flex flex-col gap-4">
                  <div>
                    <h4 className="text-xl font-semibold text-brand-charcoal">{service.title}</h4>
                  </div>
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

          <div id="therapy" className="h-full flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-brand-navy">Soft Tissue Therapy</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 auto-rows-fr items-stretch">
              {therapyServices.map((service) => (
                <Card key={service.title} className="h-full flex flex-col gap-4">
                  <div>
                    <h4 className="text-xl font-semibold text-brand-charcoal">{service.title}</h4>
                  </div>
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
        </div>
      </div>
    </Section>
  );
}

export default ServicesSection;



