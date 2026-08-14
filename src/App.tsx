import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { WhyItMattersSection } from './components/sections/WhyItMattersSection';
import { WhatActuallyHappensSection } from './components/sections/WhatActuallyHappensSection';
import { AssessmentOutputSection } from './components/sections/AssessmentOutputSection';
import { AboutSection } from './components/sections/AboutSection';
import { ContactSection } from './components/sections/ContactSection';
import PrivacyPolicy from './pages/PrivacyPolicy';
import IntakePage from './pages/IntakePage';
import CalculatorPage from './pages/CalculatorPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminApp from './pages/admin/AdminApp';
import AdminRoute from './components/intake/AdminRoute';
import IntakesList from './pages/admin/IntakesList';
import IntakeDetail from './pages/admin/IntakeDetail';

function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  if (pathname === '/admin/login') {
    return (
      <div className="bg-brand-offWhite text-brand-charcoal">
        <Header />
        <main className="space-y-0">
          <AdminLogin />
        </main>
        <Footer />
      </div>
    );
  }

  if (pathname === '/admin') {
    return (
      <div className="bg-brand-offWhite text-brand-charcoal">
        <Header />
        <main className="space-y-0">
          <AdminRoute>
            <AdminApp />
          </AdminRoute>
        </main>
        <Footer />
      </div>
    );
  }

  if (pathname === '/admin/intakes') {
    return (
      <div className="bg-brand-offWhite text-brand-charcoal">
        <Header />
        <main className="space-y-0">
          <AdminRoute>
            <IntakesList />
          </AdminRoute>
        </main>
        <Footer />
      </div>
    );
  }

  if (pathname === '/admin/clients') {
    const ClientsList = require('./pages/admin/ClientsList').default;
    return (
      <div className="bg-brand-offWhite text-brand-charcoal">
        <Header />
        <main className="space-y-0">
          <AdminRoute>
            <ClientsList />
          </AdminRoute>
        </main>
        <Footer />
      </div>
    );
  }

  if (pathname.startsWith('/admin/clients/')) {
    const ClientDetail = require('./pages/admin/ClientDetail').default;
    const emailKey = decodeURIComponent(pathname.replace('/admin/clients/', ''));
    return (
      <div className="bg-brand-offWhite text-brand-charcoal">
        <Header />
        <main className="space-y-0">
          <AdminRoute>
            <ClientDetail emailKey={emailKey} />
          </AdminRoute>
        </main>
        <Footer />
      </div>
    );
  }

  if (pathname.startsWith('/admin/intakes/')) {
    const intakeId = pathname.replace('/admin/intakes/', '');
    return (
      <div className="bg-brand-offWhite text-brand-charcoal">
        <Header />
        <main className="space-y-0">
          <AdminRoute>
            <IntakeDetail intakeId={intakeId} />
          </AdminRoute>
        </main>
        <Footer />
      </div>
    );
  }

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

  if (pathname === '/calculator') {
    return <CalculatorPage />;
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
        <WhyItMattersSection />
        <WhatActuallyHappensSection />
        <AssessmentOutputSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;



