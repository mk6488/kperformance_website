import { useIntersection } from '../../hooks/useIntersection';
import { Section } from '../ui/Section';

export function AssessmentOutputSection() {
  const { ref, visible } = useIntersection(0.2);

  return (
    <Section variant="navy">
      <div
        ref={ref}
        className={`grid grid-cols-2 reveal ${visible ? 'is-visible' : ''}`}
      >

        {/* 2 strengths */}
        <div className="border-r border-white/10 pr-8 sm:pr-14 md:pr-20">
          <p className="text-[5.5rem] sm:text-[7rem] md:text-[9rem] font-black leading-none tracking-tighter text-white">
            2
          </p>
          <p className="mt-4 text-[10px] sm:text-xs font-bold tracking-[0.28em] uppercase text-white/70">
            Genuine strengths
          </p>
          <p className="mt-1 text-sm text-white/35">
            Named specifically
          </p>
        </div>

        {/* 3 priorities */}
        <div className="pl-8 sm:pl-14 md:pl-20">
          <p className="text-[5.5rem] sm:text-[7rem] md:text-[9rem] font-black leading-none tracking-tighter text-brand-green">
            3
          </p>
          <p className="mt-4 text-[10px] sm:text-xs font-bold tracking-[0.28em] uppercase text-white/70">
            Priorities
          </p>
          <p className="mt-1 text-sm text-white/35">
            Most worth working on next
          </p>
        </div>

      </div>
    </Section>
  );
}

export default AssessmentOutputSection;
