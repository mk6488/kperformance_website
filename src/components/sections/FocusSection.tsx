import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';

export function FocusSection() {
  return (
    <Section>
      <div className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Choose your focus"
          title="Youth performance first, therapy alongside"
          subtitle="Pick the path that fits right now — we can blend both as needed."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="h-full space-y-3 border-t-4 border-brand-navy">
            <h3 className="text-xl font-semibold text-brand-charcoal">Youth Performance Coaching</h3>
            <ul className="space-y-2 text-slate-700">
              <li>• Strength &amp; conditioning for teen athletes</li>
              <li>• Movement quality + injury prevention</li>
              <li>• Testing + simple progress tracking</li>
              <li>• Confidence under training load</li>
            </ul>
            <Button
              className="w-full sm:w-auto"
              onClick={() => document.getElementById('performance')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Youth performance coaching
            </Button>
          </Card>

          <Card className="h-full space-y-3 border-t-4 border-brand-green">
            <h3 className="text-xl font-semibold text-brand-charcoal">Soft Tissue Therapy</h3>
            <ul className="space-y-2 text-slate-700">
              <li>• Pain/niggles support (sport + everyday)</li>
              <li>• Mobility + movement coaching</li>
              <li>• Recovery &amp; load management</li>
              <li>• Mobile home visits</li>
            </ul>
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => document.getElementById('therapy')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Soft tissue therapy
            </Button>
          </Card>
        </div>
      </div>
    </Section>
  );
}

export default FocusSection;
