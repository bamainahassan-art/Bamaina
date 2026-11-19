import React, { useEffect, useState } from 'react';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { CartDrawer } from './components/CartDrawer';
import { EditModeBar } from './components/EditModeBar';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { SiteEditorModal } from './components/SiteEditorModal';
import { CartProvider, formatNgn, useCart } from './context/CartContext';
import { SiteContentProvider, useSiteContent } from './context/SiteContentContext';
import { AboutPage } from './pages/AboutPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ContactPage } from './pages/ContactPage';
import { DivisionPage } from './pages/DivisionPage';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';
import { PaymentRecordsPage } from './pages/PaymentRecordsPage';
import { PaymentStatusPages } from './pages/PaymentStatusPages';
import { PaystackTestCheckoutPage } from './pages/PaystackTestCheckoutPage';
import { PageRoute } from './types/site';

const ROUTE_HASH_MAP: Record<PageRoute, string> = {
  home: '#home',
  about: '#about-us',
  livestock: '#livestock-farming',
  poultry: '#poultry-farming',
  'fish-farming': '#fish-farming',
  gallery: '#our-gallery',
  contact: '#contact-us',
  checkout: '#checkout',
  'payment-success': '#payment-success',
  'payment-failed': '#payment-failed',
  'payment-pending': '#payment-pending',
  'paystack-test-checkout': '#paystack-test-checkout',
  'payment-records': '#payment-records',
};

const ROUTE_TITLES: Record<PageRoute, string> = {
  home: 'Baffa Njangirde Agro-Allied Farm | Growing Agriculture, Building Prosperity',
  about: 'About Us | Baffa Njangirde Agro-Allied Farm',
  livestock: 'Livestock Farming | Baffa Njangirde Agro-Allied Farm',
  poultry: 'Poultry Farming | Baffa Njangirde Agro-Allied Farm',
  'fish-farming': 'Fish Farming | Baffa Njangirde Agro-Allied Farm',
  gallery: 'Our Gallery | Baffa Njangirde Agro-Allied Farm',
  contact: 'Contact Us | Baffa Njangirde Agro-Allied Farm',
  checkout: 'Order & Checkout | Baffa Njangirde Agro-Allied Farm',
  'payment-success': 'Payment Successful | Baffa Njangirde Agro-Allied Farm',
  'payment-failed': 'Payment Failed | Baffa Njangirde Agro-Allied Farm',
  'payment-pending': 'Payment Pending | Baffa Njangirde Agro-Allied Farm',
  'paystack-test-checkout': 'Paystack Test Checkout | Baffa Njangirde Agro-Allied Farm',
  'payment-records': 'Payment Records & Setup | Baffa Njangirde Agro-Allied Farm',
};

function parseRouteAndParams(): { route: PageRoute; reference: string } {
  const rawHash = window.location.hash || '';
  const [hashPath, hashQuery = ''] = rawHash.split('?');
  const searchParams = new URLSearchParams(
    hashQuery || window.location.search.replace(/^\?/, '')
  );
  const reference =
    searchParams.get('reference') || searchParams.get('trxref') || '';

  switch (hashPath.toLowerCase()) {
    case '#about':
    case '#about-us':
      return { route: 'about', reference };
    case '#livestock':
    case '#livestock-farming':
      return { route: 'livestock', reference };
    case '#poultry':
    case '#poultry-farming':
      return { route: 'poultry', reference };
    case '#fish-farming':
      return { route: 'fish-farming', reference };
    case '#gallery':
    case '#our-gallery':
      return { route: 'gallery', reference };
    case '#contact':
    case '#contact-us':
      return { route: 'contact', reference };
    case '#checkout':
      return { route: 'checkout', reference };
    case '#payment-success':
      return { route: 'payment-success', reference };
    case '#payment-failed':
      return { route: 'payment-failed', reference };
    case '#payment-pending':
      return { route: 'payment-pending', reference };
    case '#paystack-test-checkout':
      return { route: 'paystack-test-checkout', reference };
    case '#payment-records':
      return { route: 'payment-records', reference };
    default:
      return { route: 'home', reference };
  }
}

const AppShell: React.FC = () => {
  const [{ route: currentRoute, reference }, setRouteState] = useState(
    parseRouteAndParams
  );
  const { isEditMode, buildWhatsAppLink, content } = useSiteContent();
  const { itemCount, subtotalNgn, openCart } = useCart();

  useEffect(() => {
    const onHashChange = () => {
      setRouteState(parseRouteAndParams());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.title = ROUTE_TITLES[currentRoute];
  }, [currentRoute]);

  const navigate = (route: PageRoute, query?: string) => {
    const baseHash = ROUTE_HASH_MAP[route];
    const nextHash = query ? `${baseHash}?${query}` : baseHash;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash);
    }
    setRouteState(parseRouteAndParams());
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

      <Navbar currentRoute={currentRoute} onNavigate={(r) => navigate(r)} />

      <main id="main-content" className="flex-1">
        {currentRoute === 'home' && <HomePage onNavigate={(r) => navigate(r)} />}
        {currentRoute === 'about' && <AboutPage onNavigate={(r) => navigate(r)} />}
        {currentRoute === 'livestock' && (
          <DivisionPage
            divisionKey="livestock"
            onNavigate={(r) => navigate(r)}
          />
        )}
        {currentRoute === 'poultry' && (
          <DivisionPage divisionKey="poultry" onNavigate={(r) => navigate(r)} />
        )}
        {currentRoute === 'fish-farming' && (
          <DivisionPage
            divisionKey="fish-farming"
            onNavigate={(r) => navigate(r)}
          />
        )}
        {currentRoute === 'gallery' && <GalleryPage />}
        {currentRoute === 'contact' && <ContactPage />}
        {currentRoute === 'checkout' && <CheckoutPage onNavigate={navigate} />}
        {currentRoute === 'paystack-test-checkout' && (
          <PaystackTestCheckoutPage
            reference={reference}
            onNavigate={navigate}
          />
        )}
        {(currentRoute === 'payment-success' ||
          currentRoute === 'payment-failed' ||
          currentRoute === 'payment-pending') && (
          <PaymentStatusPages
            route={currentRoute}
            reference={reference}
            onNavigate={navigate}
          />
        )}
        {currentRoute === 'payment-records' && <PaymentRecordsPage />}
      </main>

      <Footer onNavigate={(r) => navigate(r)} />

      {/* Compact Floating Cart & WhatsApp Buttons when Edit Mode is off */}
      {!isEditMode && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5">
          {itemCount > 0 && currentRoute !== 'checkout' && (
            <button
              type="button"
              onClick={openCart}
              aria-label="Open order cart"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#C8962E] text-[#082315] border border-[#0E3B25] shadow-lg hover:bg-[#DFB14B] transition-transform duration-150 hover:scale-105 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span className="text-xs font-bold tabular-nums whitespace-nowrap">
                Cart ({itemCount}) · {formatNgn(subtotalNgn)}
              </span>
            </button>
          )}
          <a
            href={buildWhatsAppLink(
              `Hello ${content.business.name}, I would like to make an enquiry.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Baffa Njangirde Agro-Allied Farm on WhatsApp"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#0E3B25] text-white border border-[#DFB14B]/70 shadow-lg hover:bg-[#145333] transition-transform duration-150 hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 text-[#DFB14B]" aria-hidden="true" />
            <span className="hidden sm:inline text-xs font-semibold whitespace-nowrap">
              WhatsApp Us
            </span>
          </a>
        </div>
      )}

      <CartDrawer onNavigate={(r) => navigate(r)} />
      <EditModeBar />
      <SiteEditorModal />
    </div>
  );
};

export default function App() {
  return (
    <SiteContentProvider>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </SiteContentProvider>
  );
}
