import { Button } from '../ui/Button';
import { Section } from '../ui/Section';

export function HeroSection() {
  return (
    <Section
      className="bg-gradient-to-tr from-brand-navy to-brand-blue text-white"
      id="top"
    >
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              Soft Tissue Therapy • Sports Massage
            </p>
            <p className="text-base text-white/90">
              Hi, I&apos;m Mike — a soft tissue therapist and strength &amp; conditioning coach
              supporting young athletes and active people around Bristol.
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Soft Tissue Therapy &amp; Sports Massage in Bristol, specialising in young athletes
            </h1>
            <p className="text-lg text-white/85">
              Mobile treatments focused on recovery, performance, and confidence for youth and adult
              athletes. I come to you with tailored hands-on care and movement support.
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
            Mobile in and around Bristol • Safeguarding trained • Focused on young and developing
            athletes
          </p>
        </div>

        <div className="relative">
          <div className="aspect-[4/3] rounded-2xl bg-white/10 border border-white/15 backdrop-blur flex items-center justify-center">
            <div className="text-center px-6">
              <p className="text-sm uppercase tracking-[0.18em] text-white/70">Future imagery</p>
              <p className="text-lg font-semibold">Add athlete / treatment visuals here</p>
              <p className="text-sm text-white/80 mt-2">
                Placeholder panel for photography or brand illustration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default HeroSection;

