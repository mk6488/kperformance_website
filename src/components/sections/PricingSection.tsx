import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const tiers = [
  {
    duration: 'Soft tissue therapy (Under 18)',
    price: '£45',
    notes: 'Juniors (under 18). Per session.',
  },
  {
    duration: 'Soft tissue therapy (Adult 18+)',
    price: '£65',
    notes: 'Adults (18+). Per session.',
  },
  {
    duration: 'Performance Coaching (Youth Athletes Only)',
    price: '£45',
    notes: 'Youth athletes only. Per session.',
  },
];

export function PricingSection() {
  return (
    <Section id="pricing">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Pricing & locations"
          title="Simple, transparent pricing"
          subtitle="Youth-first pricing for soft tissue therapy and performance coaching. Mobile within Bristol; we’ll confirm travel if you’re further out."
        />

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.duration} className="h-full flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-brand-charcoal">{tier.duration}</h3>
              <p className="text-3xl font-semibold text-brand-navy">{tier.price}</p>
              <p className="text-slate-600">{tier.notes}</p>
            </Card>
          ))}
        </div>

        <p className="text-sm text-slate-700">
          Block bookings and group sessions are available on request — please get in touch.
        </p>

        <p className="text-sm text-slate-600">
          All sessions are delivered at your home. Travel within Bristol is included; small additional fees may apply for locations outside the city.
        </p>
      </div>
    </Section>
  );
}

export default PricingSection;



