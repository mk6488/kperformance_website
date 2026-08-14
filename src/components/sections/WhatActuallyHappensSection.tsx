import { useIntersection } from '../../hooks/useIntersection';
import { Card } from '../ui/Card';
import { Section } from '../ui/Section';

export function WhatActuallyHappensSection() {
  const { ref: headRef, visible: headVisible } = useIntersection(0.1);
  const { ref: stepsRef, visible: stepsVisible } = useIntersection(0.05);
  const { ref: trajRef, visible: trajVisible } = useIntersection(0.2);
  const { ref: cardRef, visible: cardVisible } = useIntersection(0.15);

  return (
    <Section id="what-happens" variant="charcoal">
      <div className="flex flex-col gap-14 md:gap-16">

        {/* Heading */}
        <div
          ref={headRef}
          className={`space-y-2 reveal ${headVisible ? 'is-visible' : ''}`}
        >
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
            What actually happens
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            One session. A structured read on where your child stands.
          </h2>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="relative">

          {/* Vertical connector — desktop only */}
          <div
            className="absolute left-[5.25rem] top-4 bottom-4 w-px hidden sm:block"
            style={{ background: 'rgba(255,255,255,0.07)' }}
            aria-hidden="true"
          />

          <div className="flex flex-col divide-y" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>

            {/* Step 1 — 90 MINUTES */}
            <div className={`grid grid-cols-1 sm:grid-cols-[10.5rem_1fr] gap-3 sm:gap-10 py-10 first:pt-0 items-start reveal ${stepsVisible ? 'is-visible' : ''} reveal-delay-1`}>
              <div className="flex flex-col items-start">
                <span className="text-7xl sm:text-8xl font-black text-white leading-none tracking-tighter">
                  90
                </span>
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 mt-1.5">
                  Minutes
                </span>
              </div>
              <div className="space-y-1.5 sm:pt-2">
                <h3 className="text-lg font-semibold text-white">A structured assessment in Leigh Woods</h3>
                <p className="text-white/60 leading-relaxed">
                  Based in a dedicated testing space, with nearby Ashton Court used for the endurance
                  test. You're there throughout.
                </p>
              </div>
            </div>

            {/* Step 2 — We measure */}
            <div className={`grid grid-cols-1 sm:grid-cols-[10.5rem_1fr] gap-3 sm:gap-10 py-10 items-start reveal ${stepsVisible ? 'is-visible' : ''} reveal-delay-2`}>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-blue/60 mb-0.5">
                  We
                </span>
                <span className="text-4xl sm:text-5xl font-black text-white leading-none">
                  measure
                </span>
              </div>
              <div className="space-y-1.5 sm:pt-1">
                <h3 className="text-lg font-semibold text-white">Strength, symmetry, power, and movement</h3>
                <p className="text-white/60 leading-relaxed">
                  Left/right strength symmetry using a force dynamometer, jump and sprint performance,
                  a movement screen, and a fitness test scaled to your child's own sport.
                </p>
              </div>
            </div>

            {/* Step 3 — Result */}
            <div className={`grid grid-cols-1 sm:grid-cols-[10.5rem_1fr] gap-3 sm:gap-10 py-10 last:pb-0 items-start reveal ${stepsVisible ? 'is-visible' : ''} reveal-delay-3`}>
              <div>
                <span className="text-5xl sm:text-6xl font-black text-brand-green leading-none">
                  Result
                </span>
              </div>
              <div className="space-y-1.5 sm:pt-1">
                <h3 className="text-lg font-semibold text-white">A written report — not just numbers</h3>
                <p className="text-white/60 leading-relaxed">
                  Two genuine strengths, the three things most worth working on next, and why those
                  three specifically. Something you can hand straight to their coach, or simply keep
                  for yourselves.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ASSESS → UNDERSTAND → NEXT STEPS trajectory */}
        <div
          ref={trajRef}
          className={`reveal ${trajVisible ? 'is-visible' : ''}`}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/35 shrink-0">Assess</span>
            <div
              className={`flex-1 h-px trajectory-line ${trajVisible ? 'is-visible' : ''}`}
              style={{ background: 'rgba(255,255,255,0.12)', animationDelay: '0.2s' }}
              aria-hidden="true"
            />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/35 shrink-0">Understand</span>
            <div
              className={`flex-1 h-px trajectory-line ${trajVisible ? 'is-visible' : ''}`}
              style={{ background: 'rgba(255,255,255,0.12)', animationDelay: '0.5s' }}
              aria-hidden="true"
            />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/35 shrink-0">Next Steps</span>
          </div>
        </div>

        {/* In the report card — white card pops against dark */}
        <div
          ref={cardRef}
          className={`reveal ${cardVisible ? 'is-visible' : ''}`}
        >
          <Card>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-green mb-4">
              In the report
            </p>
            <ul className="space-y-2.5 text-slate-700">
              <li className="flex gap-2.5">
                <span className="text-brand-green shrink-0">—</span>
                Two genuine strengths, named specifically
              </li>
              <li className="flex gap-2.5">
                <span className="text-brand-green shrink-0">—</span>
                The three priorities most worth working on next
              </li>
              <li className="flex gap-2.5">
                <span className="text-brand-green shrink-0">—</span>
                Why those three, explained in plain English
              </li>
              <li className="flex gap-2.5">
                <span className="text-brand-green shrink-0">—</span>
                Numbers with context — not just a printout
              </li>
            </ul>
          </Card>
        </div>

      </div>
    </Section>
  );
}

export default WhatActuallyHappensSection;
