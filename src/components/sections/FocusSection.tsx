import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';

export function FocusSection() {
  return (
    <Section>
      <div className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Performance-first model"
          title="Your main lane is youth athletic development"
          subtitle="We now lead with athlete coaching and keep soft tissue therapy available as secondary support."
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card className="h-full space-y-4 border-t-4 border-brand-navy hover-lift">
            <h3 className="text-xl font-semibold text-brand-charcoal">Primary: Youth performance coaching</h3>
            <ul className="space-y-2 text-slate-700">
              <li>• Age-appropriate strength and conditioning</li>
              <li>• Speed mechanics, movement quality, and robust foundations</li>
              <li>• Confidence, consistency, and long-term athlete development</li>
              <li>• 1:1, 2:1, and small-group coaching options</li>
            </ul>
            <Button className="w-full sm:w-auto" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
              See coaching services
            </Button>
          </Card>

          <Card className="h-full space-y-4 border-t-4 border-brand-green hover-lift">
            <h3 className="text-xl font-semibold text-brand-charcoal">Secondary: Soft tissue therapy</h3>
            <ul className="space-y-2 text-slate-700">
              <li>• Hands-on treatment for aches, pain, and niggles</li>
              <li>• Recovery support around sport demands</li>
              <li>• Mobility and load-management advice</li>
              <li>• Useful add-on for athletes in high training blocks</li>
            </ul>
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => document.getElementById('therapy')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See therapy support
            </Button>
          </Card>
        </div>
      </div>
    </Section>
  );
}

export default FocusSection;
