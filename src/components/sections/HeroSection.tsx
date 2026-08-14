import logoKCircle from '../../assets/logo-white.png';
import { Button } from '../ui/Button';
import { Section } from '../ui/Section';

export function HeroSection() {
  return (
    <Section id="top" className="bg-gradient-to-br from-brand-navy to-brand-blue text-white">
      <div className="flex flex-col items-center text-center gap-6 py-6 md:py-10">
        <img
          src={logoKCircle}
          alt="K Performance"
          className="h-36 w-36 rounded-full"
        />

        <div className="space-y-4 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-white">
            A clear picture of how your child is developing — and exactly what to work on next.
          </h1>
          <p className="text-base sm:text-lg text-white/80 font-normal">
            Not a printout of numbers you're left to interpret yourself — a structured assessment, explained in plain English.
          </p>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60">
            90 Min · Strength · Power · Movement · Fitness
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-white text-brand-navy border-white hover:bg-white/90"
        >
          Get in touch
        </Button>
      </div>
    </Section>
  );
}

export default HeroSection;
