import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

export function AboutSection() {
  return (
    <Section id="about">
      <div className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="About"
          title="Hi, I'm Katie — soft tissue therapist and coach"
          subtitle="Solo practitioner with Level 5 Soft Tissue Therapy and Level 4 S&C, supporting young athletes, runners, and active people around Bristol."
          align="left"
        />

        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div className="rounded-2xl bg-brand-offWhite border border-slate-100 aspect-[4/3] flex items-center justify-center text-slate-500">
            Imagery or practitioner photo placeholder
          </div>

          <div className="space-y-4">
            <Card>
              <p className="text-slate-700 leading-relaxed">
                I blend hands-on treatment with movement coaching. Sessions are mobile, friendly, and
                designed to help you feel confident about your body — whether you’re competing, just
                starting out, or returning from injury.
              </p>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li>• Level 5 Soft Tissue Therapy</li>
                <li>• Level 4 Strength &amp; Conditioning</li>
                <li>• Experience with youth sport, academy pathways, and recreational athletes</li>
              </ul>
            </Card>

            <div className="rounded-xl border border-brand-green/40 bg-brand-green/10 p-4 text-sm text-brand-charcoal">
              <p className="font-semibold text-brand-navy">Safeguarding & working with under-18s</p>
              <p className="text-slate-700">
                DBS checked and safeguarding trained. Clear communication with parents/guardians and
                coaches to keep sessions supportive and transparent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default AboutSection;
