import logoKCircle512 from '../../assets/logo-blue.png';
import { Button } from '../ui/Button';

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="mx-auto flex items-center justify-between max-w-6xl px-4 md:px-6 lg:px-8 py-3">
        <button
          type="button"
          onClick={() => scrollToId('top')}
          className="flex items-center gap-3"
        >
          <img
            src={logoKCircle512}
            alt="K Performance logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-lg font-semibold tracking-tight text-brand-navy">
            K Performance
          </span>
        </button>

        <Button onClick={() => scrollToId('contact')}>Get in touch</Button>
      </div>
    </header>
  );
}

export default Header;



