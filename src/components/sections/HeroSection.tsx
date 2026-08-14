import logoWhite from '../../assets/logo-white.png';
import { Button } from '../ui/Button';
import { Section } from '../ui/Section';

export function HeroSection() {
  return (
    <Section
      id="top"
      className="bg-gradient-to-br from-brand-navy to-brand-blue text-white !py-0"
    >
      <div className="flex flex-col items-center text-center gap-6 sm:gap-8 py-20 sm:py-24 md:py-32">

        {/* Logo mark */}
        <img
          src={logoWhite}
          alt="K Performance"
          className="h-16 w-16 sm:h-20 sm:w-20 object-contain hero-item hero-item-1"
        />

        {/* Typographic device */}
        <p className="text-[9px] sm:text-[11px] font-bold tracking-[0.5em] uppercase text-white/30 hero-item hero-item-2 -mt-2">
          Know your performance
        </p>

        {/* Main proposition — parent-facing, retained exactly */}
        <div className="space-y-4 sm:space-y-5 max-w-3xl hero-item hero-item-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight text-white">
            A clear picture of how your child is developing —
            and exactly what to work on next.
          </h1>
          <p className="text-base sm:text-lg text-white/65 font-normal leading-relaxed max-w-xl mx-auto">
            Not a printout of numbers you're left to interpret yourself — a structured assessment,
            explained in plain English.
          </p>
        </div>

        {/* Technical signature */}
        <p className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-white/30 hero-item hero-item-4">
          90 Min · Strength · Power · Movement · Fitness
        </p>

        {/* CTA */}
        <div className="hero-item hero-item-5">
          <Button
            variant="secondary"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-brand-navy border-white hover:bg-white/90 px-8"
          >
            Get in touch
          </Button>
        </div>

      </div>
    </Section>
  );
}

export default HeroSection;
