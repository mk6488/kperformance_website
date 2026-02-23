import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

export function AboutSection() {
  return (
    <Section id="about">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="About coach Mike"
          title="Long-term athlete development, not quick fixes"
          subtitle="I coach youth athletes to become stronger, faster, and more resilient with age-appropriate structure and clear support."
          align="left"
        />

        <div className="grid gap-6 md:grid-cols-2 md:items-start md:gap-8">
          <Card className="space-y-4 hover-lift">
            <p className="text-slate-700 leading-relaxed">
              My work combines strength and conditioning principles with practical coaching for real athletes in school,
              academy, and club environments. Sessions are designed to create robust movement quality, confidence,
              and measurable progression.
            </p>
            <ul className="space-y-2 text-slate-700">
              <li>• Level 4 Strength &amp; Conditioning</li>
              <li>• Level 5 Soft Tissue Therapy</li>
              <li>• Youth sport and athlete pathway experience</li>
            </ul>
          </Card>

          <div className="space-y-4">
            <Card className="border-brand-green/30 bg-brand-green/5">
              <h3 className="font-semibold text-brand-navy">Safeguarding & under-18 support</h3>
              <p className="text-slate-700 mt-2">
                DBS checked and safeguarding trained. Parent/guardian communication stays clear and consistent throughout.
              </p>
            </Card>
            <Card className="border-brand-blue/30 bg-brand-blue/5">
              <h3 className="font-semibold text-brand-navy">Secondary therapy support available</h3>
              <p className="text-slate-700 mt-2">
                Soft tissue therapy remains available to support recovery, pain management, and return-to-training confidence.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default AboutSection;
