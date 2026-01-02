import heroImage from '../../assets/hero.png';
import { Button } from '../ui/Button';
import { Section } from '../ui/Section';

export function HeroSection() {
  return (
    <Section id="top" className="relative overflow-hidden bg-brand-navy text-white">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Three teenage athletes sprinting on a football pitch during training"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/90 via-brand-navy/70 to-brand-blue/40" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-brand-navy/40" />
      </div>

      <div className="relative">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 pt-14 pb-10 md:pt-20 md:pb-16">
            <div className="space-y-6 max-w-2xl">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
                Youth Performance Coaching &amp; Soft Tissue Therapy in Bristol
              </h1>
              <p className="text-base sm:text-lg text-white/85">
                K Performance supports youth athletes and active individuals with tailored performance coaching and hands-on soft tissue therapy.
              </p>
              <p className="text-sm text-white/80">Safeguarding trained. Parents/guardians welcome.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                className="w-full sm:w-auto"
                onClick={() => document.getElementById('performance')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore youth performance coaching
              </Button>
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => document.getElementById('therapy')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore soft tissue therapy
              </Button>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-white/80">
                Great for teen athletes, adults in sport, and anyone managing pain or niggles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default HeroSection;



