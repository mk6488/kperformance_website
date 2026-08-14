import { Card } from '../ui/Card';
import { Section } from '../ui/Section';

const steps = [
  {
    anchor: (
      <div className="flex flex-col items-start">
        <span className="text-5xl font-bold text-brand-navy leading-none">90</span>
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-brand-navy/60 mt-1">
          Minutes
        </span>
      </div>
    ),
    heading: 'A structured assessment in Leigh Woods',
    body: "Based in a dedicated testing space, with nearby Ashton Court used for the endurance test. You're there throughout.",
  },
  {
    anchor: (
      <span className="text-base font-semibold text-brand-navy leading-snug">
        We<br />measure
      </span>
    ),
    heading: 'Strength, symmetry, power, and movement',
    body: 'Left/right strength symmetry using a force dynamometer, jump and sprint performance, a movement screen, and a fitness test scaled to your child\'s own sport.',
  },
  {
    anchor: (
      <span className="text-4xl font-bold text-brand-green leading-none">
        Result
      </span>
    ),
    heading: 'A written report — not just numbers',
    body: "Two genuine strengths, the three things most worth working on next, and why those three specifically. Something you can hand straight to their coach, or simply keep for yourselves.",
  },
];

export function WhatActuallyHappensSection() {
  return (
    <Section id="what-happens">
      <div className="flex flex-col gap-12">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-blue">
            What actually happens
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-brand-charcoal">
            One session. A structured read on where your child stands.
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-slate-100">
          {steps.map((step, i) => (
            <div key={i} className="grid grid-cols-[8rem_1fr] gap-6 py-8 first:pt-0 last:pb-0 items-start">
              <div className="pt-1">{step.anchor}</div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-brand-charcoal">{step.heading}</h3>
                <p className="text-slate-600 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.15em] uppercase text-slate-400">
          <span>Assess</span>
          <span>→</span>
          <span>Understand</span>
          <span>→</span>
          <span>Next Steps</span>
        </div>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-green mb-3">
            In the report
          </p>
          <ul className="space-y-2 text-slate-700">
            <li>• Two genuine strengths, named specifically</li>
            <li>• The three priorities most worth working on next</li>
            <li>• Why those three, explained in plain English</li>
            <li>• Numbers with context — not just a printout</li>
          </ul>
        </Card>
      </div>
    </Section>
  );
}

export default WhatActuallyHappensSection;
