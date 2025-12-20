import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { WhoIHelpSection } from './components/sections/WhoIHelpSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { AboutSection } from './components/sections/AboutSection';
import { PricingSection } from './components/sections/PricingSection';
import { ContactSection } from './components/sections/ContactSection';
import PrivacyPolicy from './pages/PrivacyPolicy';
import IntakePage from './pages/IntakePage';

function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  if (pathname === '/intake') {
    return (
      <div className="bg-brand-offWhite text-brand-charcoal">
        <Header />
        <main className="space-y-0">
          <IntakePage />
        </main>
        <Footer />
      </div>
    );
  }

  if (pathname === '/privacy') {
    return (
      <div className="bg-brand-offWhite text-brand-charcoal">
        <Header />
        <main className="space-y-0">
          <PrivacyPolicy />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-brand-offWhite text-brand-charcoal">
      <Header />
      <main className="space-y-0">
        <HeroSection />
        <WhoIHelpSection />
        <ServicesSection />
        <HowItWorksSection />
        <AboutSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;



