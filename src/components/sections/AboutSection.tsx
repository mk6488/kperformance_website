import { useIntersection } from '../../hooks/useIntersection';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

export function AboutSection() {
  const { ref: bioRef, visible: bioVisible } = useIntersection(0.08);
  const { ref: statRef, visible: statVisible } = useIntersection(0.1);

  return (
    <Section id="about" variant="muted">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="About"
          title="Hi, I'm Mike — I've spent years coaching young athletes"
          align="left"
        />

        <div className="grid gap-6 md:grid-cols-[3fr_2fr] md:items-start md:gap-10">

          {/* Bio + credentials + safeguarding — sits directly on section background */}
          <div
            ref={bioRef}
            className={`space-y-6 reveal ${bioVisible ? 'is-visible' : ''}`}
          >
            <p className="text-slate-700 leading-relaxed">
              Mike Katholnig has spent years coaching young athletes directly — including junior
              strength &amp; conditioning work at City of Bristol Rowing Club, working with 12–18
              year olds across full training cycles. That's where this assessment actually comes
              from: not a generic test battery, but a structured way of identifying the things
              years of hands-on coaching taught him to look for.
            </p>

            <ul className="space-y-1.5 text-sm text-slate-600">
              <li>• Level 4 Diploma Advanced Personal Training</li>
              <li>• Level 5 Diploma Soft Tissue Therapy</li>
              <li>• Level 2 British Rowing Coach</li>
              <li>• Fully insured</li>
            </ul>

            <div className="rounded-xl border border-brand-green/40 bg-brand-green/10 p-4 text-sm text-brand-charcoal">
              <h3 className="font-semibold text-brand-navy">Safeguarding &amp; working with under-18s</h3>
              <p className="mt-1 text-slate-700">
                DBS checked and safeguarding trained. Clear communication with parents, guardians, and
                coaches keeps sessions supportive and transparent.
              </p>
            </div>
          </div>

          {/* 7+ Years stat panel */}
          <div
            ref={statRef}
            className={`rounded-2xl bg-brand-navy text-white p-8 flex flex-col justify-center min-h-[180px] reveal reveal-delay-2 ${statVisible ? 'is-visible' : ''}`}
          >
            <p className="text-5xl font-black leading-none tracking-tight">7+ Years</p>
            <p className="mt-4 text-white/55 text-sm leading-relaxed">
              Coaching young athletes — including junior S&amp;C at City of Bristol Rowing Club.
            </p>
          </div>

        </div>
      </div>
    </Section>
  );
}

export default AboutSection;
