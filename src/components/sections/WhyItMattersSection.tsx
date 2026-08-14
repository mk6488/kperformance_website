import { useIntersection } from '../../hooks/useIntersection';
import { Section } from '../ui/Section';

export function WhyItMattersSection() {
  const { ref: leftRef, visible: leftVisible } = useIntersection(0.1);
  const { ref: rightRef, visible: rightVisible } = useIntersection(0.1);

  return (
    <Section id="why-it-matters" variant="muted">
      <div className="grid gap-10 md:grid-cols-[5fr_6fr] md:gap-16 md:items-start">

        {/* Left — big editorial statement */}
        <div
          ref={leftRef}
          className={`space-y-3 reveal ${leftVisible ? 'is-visible' : ''}`}
        >
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
            Why it matters
          </p>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[0.95] tracking-tight text-brand-charcoal">
            Young athletes<br />change fast.
          </h2>
        </div>

        {/* Right — explanatory copy */}
        <div
          ref={rightRef}
          className={`space-y-5 text-slate-600 text-base leading-relaxed reveal reveal-delay-2 ${rightVisible ? 'is-visible' : ''}`}
        >
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
