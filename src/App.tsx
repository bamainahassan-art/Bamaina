import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { EditModeBar } from './components/EditModeBar';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { SiteEditorModal } from './components/SiteEditorModal';
import { SiteContentProvider, useSiteContent } from './context/SiteContentContext';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { DivisionPage } from './pages/DivisionPage';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';
import { PageRoute } from './types/site';

const ROUTE_HASH_MAP: Record<PageRoute, string> = {
  home: '#home',
  about: '#about-us',
  livestock: '#livestock-farming',
  poultry: '#poultry-farming',
  'fish-farming': '#fish-farming',
  gallery: '#our-gallery',
  contact: '#contact-us',
};

const ROUTE_TITLES: Record<PageRoute, string> = {
  home: 'Baffa Njangirde Agro-Allied Farm | Growing Agriculture, Building Prosperity',
  about: 'About Us | Baffa Njangirde Agro-Allied Farm',
  livestock: 'Livestock Farming | Baffa Njangirde Agro-Allied Farm',
  poultry: 'Poultry Farming | Baffa Njangirde Agro-Allied Farm',
  'fish-farming': 'Fish Farming | Baffa Njangirde Agro-Allied Farm',
  gallery: 'Our Gallery | Baffa Njangirde Agro-Allied Farm',
  contact: 'Contact Us | Baffa Njangirde Agro-Allied Farm',
};

function parseRouteFromHash(): PageRoute {
  const hash = window.location.hash.toLowerCase();
  switch (hash) {
    case '#about':
    case '#about-us':
      return 'about';
    case '#livestock':
    case '#livestock-farming':
      return 'livestock';
    case '#poultry':
    case '#poultry-farming':
      return 'poultry';
    case '#fish-farming':
      return 'fish-farming';
    case '#gallery':
    case '#our-gallery':
      return 'gallery';
    case '#contact':
    case '#contact-us':
      return 'contact';
    default:
      return 'home';
  }
}

const AppShell: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(parseRouteFromHash);
  const { isEditMode, buildWhatsAppLink, content } = useSiteContent();

  useEffect(() => {
    const onHashChange = () => {
      setCurrentRoute(parseRouteFromHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.title = ROUTE_TITLES[currentRoute];
  }, [currentRoute]);

  const navigate = (route: PageRoute) => {
    setCurrentRoute(route);
    const targetHash = ROUTE_HASH_MAP[route];
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#14241B]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0E3B25] focus:text-white focus:rounded-md"
      >
        Skip to main content
      </a>

      <Navbar currentRoute={currentRoute} onNavigate={navigate} />

      <main id="main-content" className="flex-1">
        {currentRoute === 'home' && <HomePage onNavigate={navigate} />}
        {currentRoute === 'about' && <AboutPage onNavigate={navigate} />}
        {currentRoute === 'livestock' && (
          <DivisionPage divisionKey="livestock" onNavigate={navigate} />
        )}
        {currentRoute === 'poultry' && (
          <DivisionPage divisionKey="poultry" onNavigate={navigate} />
        )}
        {currentRoute === 'fish-farming' && (
          <DivisionPage divisionKey="fish-farming" onNavigate={navigate} />
        )}
        {currentRoute === 'gallery' && <GalleryPage />}
        {currentRoute === 'contact' && <ContactPage />}
      </main>

      <Footer onNavigate={navigate} />

      {/* Compact WhatsApp Quick-Chat Button when Edit Mode is off */}
      {!isEditMode && (
        <a
          href={buildWhatsAppLink(
            `Hello ${content.business.name}, I would like to make an enquiry.`
          )}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Baffa Njangirde Agro-Allied Farm on WhatsApp"
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#0E3B25] text-white border border-[#DFB14B]/70 shadow-lg hover:bg-[#145333] transition-transform duration-150 hover:scale-105"
        >
          <MessageCircle className="w-5 h-5 text-[#DFB14B]" aria-hidden="true" />
          <span className="hidden sm:inline text-xs font-semibold whitespace-nowrap">
            WhatsApp Us
          </span>
        </a>
      )}

      <EditModeBar />
      <SiteEditorModal />
    </div>
  );
};

export default function App() {
  return (
    <SiteContentProvider>
      <AppShell />
    </SiteContentProvider>
  );
}
