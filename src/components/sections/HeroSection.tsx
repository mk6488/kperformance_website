import heroImage from '../../assets/hero.png';
import { Button } from '../ui/Button';
import { Section } from '../ui/Section';

export function HeroSection() {
  return (
    <Section id="top" className="relative overflow-hidden bg-brand-navy text-white">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Youth athletes sprinting on a football pitch"
          className="h-full w-full object-cover scale-in"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/90 via-brand-navy/65 to-brand-blue/30" />
      </div>

      <div className="relative">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="space-y-7 max-w-3xl fade-up">
            <p className="inline-flex rounded-full border border-white/35 px-4 py-1 text-xs sm:text-sm tracking-wide text-white/90 bg-white/10 backdrop-blur">
              Now coaching from CrossFit Clifton · Bristol
            </p>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
                Youth Athlete Performance Coaching
                <span className="block text-brand-green">Built for Progress, Power & Confidence</span>
              </h1>
              <p className="text-base sm:text-xl text-white/90 max-w-2xl">
                K Performance helps youth athletes get stronger, move better, and perform with confidence.
                Soft tissue therapy is still available as secondary support for pain, niggles, and recovery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                className="w-full sm:w-auto"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore coaching pathways
              </Button>
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View new pricing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default HeroSection;
