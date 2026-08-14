import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

export function AboutSection() {
  return (
    <Section id="about" variant="muted">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="About"
          title="Hi, I'm Mike — I've spent years coaching young athletes"
          align="left"
        />

        <div className="grid gap-6 md:grid-cols-[3fr_2fr] md:items-start md:gap-10">
          <div className="space-y-4">
            <Card>
              <p className="text-slate-700 leading-relaxed">
                Mike Katholnig has spent years coaching young athletes directly — including junior
                strength &amp; conditioning work at City of Bristol Rowing Club, working with 12–18
                year olds across full training cycles. That's where this assessment actually comes
                from: not a generic test battery, but a structured way of identifying the things
                years of hands-on coaching taught him to look for.
              </p>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li>• Level 4 Diploma Advanced Personal Training</li>
                <li>• Level 5 Diploma Soft Tissue Therapy</li>
                <li>• Level 2 British Rowing Coach</li>
                <li>• Fully insured</li>
              </ul>
            </Card>

            <div className="rounded-xl border border-brand-green/40 bg-brand-green/10 p-4 text-sm text-brand-charcoal">
              <h3 className="font-semibold text-brand-navy">Safeguarding &amp; working with under-18s</h3>
              <p className="text-slate-700">
                DBS checked and safeguarding trained. Clear communication with parents, guardians, and
                coaches keeps sessions supportive and transparent.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-brand-navy text-white p-8 flex flex-col justify-center min-h-[180px]">
            <p className="text-5xl font-bold leading-none tracking-tight">7+ Years</p>
            <p className="mt-3 text-white/70 text-sm leading-relaxed">
              Coaching young athletes — including junior S&amp;C at City of Bristol Rowing Club.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default AboutSection;
