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
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 min-h-[70vh] flex items-center pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="space-y-6 max-w-3xl">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                Soft Tissue Therapy • Sports Massage
              </p>
              <p className="text-base text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] text-white/90">
                Hi, I&apos;m Mike — a soft tissue therapist and strength &amp; conditioning coach
                supporting young athletes and active people around Bristol.
              </p>
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
                Soft Tissue Therapy &amp; Sports Massage in Bristol
              </h1>
              <p className="text-lg text-white/85">
                Mobile treatment, movement coaching, and recovery support — brought directly to your
                home. You don&apos;t need a clinic; you just need the right help, at the right time.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Book a session
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                WhatsApp me
              </Button>
            </div>
            <p className="text-sm text-white/80">
              Great for teens in sport, adult athletes, and anyone managing pain or niggles.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default HeroSection;



