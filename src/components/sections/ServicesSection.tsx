import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const services = [
  {
    title: 'Soft Tissue Therapy & Sports Massage',
    points: ['Reduce pain & tightness', 'Aid recovery between sessions', 'Prepare for competition'],
  },
  {
    title: 'Injury Rehab & Exercise',
    points: ['Assessment & movement coaching', 'Progressions tailored to your sport', 'Return-to-play confidence'],
  },
  {
    title: 'Strength & Conditioning Support',
    points: ['Strength foundations for developing athletes', 'Power, speed, and robustness', 'Safe load management'],
  },
  {
    title: 'Mobile Home Visits',
    points: ['I bring the treatment table', 'Flexible around training & school', 'Covering Bristol and nearby'],
  },
  {
    title: 'Event / Match Day Cover',
    points: ['Pre-event prep', 'Pitch-side soft tissue support', 'Warm-up and cooldown guidance'],
  },
  {
    title: 'Education & Workshops',
    points: ['Warm-up routines', 'Recovery habits', 'Injury-prevention tips for teams'],
  },
  {
    title: 'Performance testing & movement screening',
    points: [
      'Simple movement screens for young athletes',
      'Baseline testing to track progress',
      'Clear feedback for athletes, parents, and coaches',
    ],
  },
];

export function ServicesSection() {
  return (
    <Section id="services">
      <div className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Services"
          title="Hands-on treatment with practical coaching"
          subtitle="Mobile soft tissue therapy with clear communication. Sessions combine hands-on work, movement education, and simple take-home strategies."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

