import logoKCircle512 from '../../assets/logo-k-circle-512.png';
import { useState } from 'react';
import { Button } from '../ui/Button';

const navLinks = [
  { label: 'Who I Help', id: 'who-i-help' },
  { label: 'Services', id: 'services' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'About', id: 'about' },
  { label: 'Pricing', id: 'pricing' },
  { label: 'Contact', id: 'contact' },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (id: string) => {
    scrollToId(id);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="mx-auto flex items-center justify-between max-w-6xl px-4 md:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollToId('top')}
            className="flex items-center gap-3"
          >
            <img
              src={logoKCircle512}
              alt="K Performance logo"
              className="h-10 w-10 rounded-full"
            />

            <div className="flex flex-col items-start leading-tight">
              <span className="text-lg font-semibold tracking-tight text-brand-navy">
                K Performance
              </span>
              <span className="mt-0.5 hidden text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-navy/70 sm:block">
                Soft Tissue Therapy • Sports Massage
              </span>
            </div>
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-brand-charcoal">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className="hover:text-brand-blue transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <Button onClick={() => handleNavClick('contact')}>Book a session</Button>
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <Button variant="ghost" onClick={() => handleNavClick('contact')} className="text-sm">
            Book
          </Button>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            className="p-2 h-10 w-10 rounded-md border border-slate-200 text-brand-charcoal"
          >
            <span className="sr-only">Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className="text-left text-brand-charcoal hover:text-brand-blue transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <Button onClick={() => handleNavClick('contact')}>Book a session</Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Header;



