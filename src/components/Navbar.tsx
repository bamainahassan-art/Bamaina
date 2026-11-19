import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { PageRoute } from '../types/site';
import { ResilientImage } from './ResilientImage';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { content } = useSiteContent();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDivisionActive =
    currentRoute === 'livestock' ||
    currentRoute === 'poultry' ||
    currentRoute === 'fish-farming';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleNav = (route: PageRoute) => {
    setServicesOpen(false);
    setMobileOpen(false);
    onNavigate(route);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#0E3B25]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNav('home');
          }}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus-visible:rounded-md"
        >
          <span className="w-9 h-9 rounded-full overflow-hidden border border-[#C8962E]/50 bg-[#0E3B25] shrink-0">
            <ResilientImage
              src={content.business.emblemUrl}
              alt={`${content.business.name} emblem`}
              className="w-full h-full object-cover"
            />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-[#0E3B25] group-hover:text-[#145333] transition-colors whitespace-nowrap shrink-0">
            {content.business.shortName}
          </span>
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#2A4135]"
        >
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentRoute === 'home'
                ? 'border-[#C8962E] text-[#0E3B25] font-semibold'
                : 'border-transparent hover:text-[#0E3B25] hover:border-[#C8962E]/50'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => handleNav('about')}
            className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentRoute === 'about'
                ? 'border-[#C8962E] text-[#0E3B25] font-semibold'
                : 'border-transparent hover:text-[#0E3B25] hover:border-[#C8962E]/50'
            }`}
          >
            About Us
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-haspopup="menu"
              onClick={() => setServicesOpen((prev) => !prev)}
              className={`py-1.5 border-b-2 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isDivisionActive
                  ? 'border-[#C8962E] text-[#0E3B25] font-semibold'
                  : 'border-transparent hover:text-[#0E3B25] hover:border-[#C8962E]/50'
              }`}
            >
              <span>Our Services</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-150 ${
                  servicesOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {servicesOpen && (
              <div
                role="menu"
                aria-label="Farm divisions"
                className="absolute left-0 top-full mt-2 w-56 bg-white border border-[#0E3B25]/15 rounded-lg shadow-lg py-1.5 z-50"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleNav('livestock')}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    currentRoute === 'livestock'
                      ? 'bg-[#F4F7F5] text-[#0E3B25] font-semibold'
                      : 'text-[#2A4135] hover:bg-[#F4F7F5] hover:text-[#0E3B25]'
                  }`}
                >
                  Livestock Farming
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleNav('poultry')}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    currentRoute === 'poultry'
                      ? 'bg-[#F4F7F5] text-[#0E3B25] font-semibold'
                      : 'text-[#2A4135] hover:bg-[#F4F7F5] hover:text-[#0E3B25]'
                  }`}
                >
                  Poultry Farming
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleNav('fish-farming')}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    currentRoute === 'fish-farming'
                      ? 'bg-[#F4F7F5] text-[#0E3B25] font-semibold'
                      : 'text-[#2A4135] hover:bg-[#F4F7F5] hover:text-[#0E3B25]'
                  }`}
                >
                  Fish Farming
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleNav('gallery')}
            className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentRoute === 'gallery'
                ? 'border-[#C8962E] text-[#0E3B25] font-semibold'
                : 'border-transparent hover:text-[#0E3B25] hover:border-[#C8962E]/50'
            }`}
          >
            Our Gallery
          </button>
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('contact')}
            className={`hidden md:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentRoute === 'contact'
                ? 'bg-[#C8962E] text-[#082315]'
                : 'bg-[#0E3B25] text-white hover:bg-[#145333]'
            }`}
          >
            Contact Us
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#0E3B25]/15 text-[#0E3B25] hover:bg-[#F4F7F5] cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#0E3B25]/10 px-4 py-4 space-y-1 shadow-lg">
          {(
            [
              { route: 'home', label: 'Home' },
              { route: 'about', label: 'About Us' },
              { route: 'livestock', label: 'Livestock Farming' },
              { route: 'poultry', label: 'Poultry Farming' },
              { route: 'fish-farming', label: 'Fish Farming' },
              { route: 'gallery', label: 'Our Gallery' },
              { route: 'contact', label: 'Contact Us' },
            ] as { route: PageRoute; label: string }[]
          ).map((item) => (
            <button
              key={item.route}
              type="button"
              onClick={() => handleNav(item.route)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentRoute === item.route
                  ? 'bg-[#0E3B25] text-white'
                  : 'text-[#14241B] hover:bg-[#F4F7F5]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
