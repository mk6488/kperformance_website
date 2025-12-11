import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

export function AboutSection() {
  return (
    <Section id="about">
      <div className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="About"
          title="Hi, I’m Mike — soft tissue therapist and strength coach"
          subtitle="I help young athletes, active adults, and busy families stay healthy, recover quickly, and feel confident in their sport."
          align="left"
        />

        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div className="rounded-2xl bg-brand-offWhite border border-slate-100 aspect-[4/3] flex items-center justify-center text-slate-500">
            Imagery or practitioner photo placeholder
          </div>

          <div className="space-y-4">
            <Card>
              <p className="text-slate-700 leading-relaxed">
                I blend evidence-based soft tissue therapy with simple, effective movement coaching.
                Sessions are mobile, friendly, and designed to help you feel confident in your body —
                whether you&apos;re competing, juggling sport around school and exams, or returning from
                injury.
              </p>
              <p className="text-slate-700 leading-relaxed mt-3">
                I&apos;ve worked for years with junior athletes across Bristol, including school and club
                programmes. I understand how demanding training and growth phases can be, and how
                important it is to support athletes in a way that&apos;s age-appropriate, clear, and
                practical.
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
                DBS checked and safeguarding trained. Clear communication with parents, guardians, and
                coaches keeps sessions supportive and transparent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default AboutSection;



