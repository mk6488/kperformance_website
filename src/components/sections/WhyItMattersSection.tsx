import { Section } from '../ui/Section';

export function WhyItMattersSection() {
  return (
    <Section id="why-it-matters" variant="muted">
      <div className="grid gap-10 md:grid-cols-[5fr_6fr] md:gap-16 md:items-start">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-blue">
            Why it matters
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-brand-charcoal">
            Young athletes change fast.
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 text-base leading-relaxed">
          <p>
            Growth spurts, shifting training loads, technique, and the simple unpredictability of
            adolescence all shape how a child's body is adapting to their sport — and it isn't always
            obvious, even to an attentive parent or coach, exactly what a child needs physically at
            any given point.
          </p>
          <p>
            K Performance gives you a clearer picture: a structured read on where your child's
            physical development actually stands, and the specific things worth focusing on next —
            whatever sport they play.
          </p>
        </div>
      </div>
    </Section>
  );
}

export default WhyItMattersSection;
