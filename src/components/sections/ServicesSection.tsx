import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const services = [
  {
    title: 'Soft Tissue Therapy & Sports Massage',
    points: [
      'Reduce pain, tension, and overuse symptoms',
      'Improve mobility and tissue quality',
      'Support recovery around training and competitions',
    ],
  },
  {
    title: 'Injury rehabilitation & exercise guidance',
    points: [
      'Simple, effective rehab plans',
      'Return-to-play confidence',
      'Age-appropriate progressions for teen athletes',
    ],
  },
  {
    title: 'Strength & conditioning support',
    points: [
      'Strength foundations for growing athletes',
      'Movement quality and technique coaching',
      'Build resilience for sport and everyday life',
    ],
  },
  {
    title: 'Performance testing & movement screening',
    points: [
      'Quick, practical baseline tests',
      'Movement assessments for young athletes',
      'Clear feedback for athletes, parents, and coaches',
    ],
  },
  {
    title: 'Mobile home visits',
    points: [
      'Treatment delivered in the comfort of your home',
      'Ideal for busy families juggling school, work, and sport',
      'Flexible around training and travel',
    ],
  },
  {
    title: 'Education & workshops',
    points: [
      'Warm-up and recovery routines',
      'Everyday habits to support performance',
      'Injury-prevention ideas for teams and clubs',
    ],
  },
];

export function ServicesSection() {
  return (
    <Section id="services">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Services"
          title="Hands-on therapy, smart movement, clear guidance"
          subtitle="Mobile soft tissue therapy with clear communication. Sessions combine hands-on work, movement education, and simple take-home strategies."
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



