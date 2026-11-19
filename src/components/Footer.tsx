import React from 'react';
import { Mail, MapPin, MessageCircle, Pencil, Phone } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { PageRoute } from '../types/site';
import { ResilientImage } from './ResilientImage';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { content, isEditMode, toggleEditMode, openEditor, buildWhatsAppLink } =
    useSiteContent();
  const { business } = content;

  const handleLink = (route: PageRoute) => {
    onNavigate(route);
  };

  return (
    <footer className="bg-[#082315] text-white border-t border-[#DFB14B]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Summary */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#DFB14B]/70 bg-white shrink-0">
                <ResilientImage
                  src={business.emblemUrl}
                  alt={`${business.name} emblem`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight text-white">
                  {business.name}
                </h2>
                <p className="text-sm text-[#DFB14B] font-medium mt-0.5">
                  {business.slogan}
                </p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed max-w-md">
              Nigerian agricultural enterprise dedicated to livestock farming, poultry
              production, and fish farming with quality care and customer satisfaction.
            </p>
          </div>

          {/* Site Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold text-[#DFB14B]">Navigation</h3>
            <ul className="space-y-2 text-sm text-white/80">
              {(
                [
                  { route: 'home', label: 'Home' },
                  { route: 'about', label: 'About Us' },
                  { route: 'livestock', label: 'Livestock Farming' },
                  { route: 'poultry', label: 'Poultry Farming' },
                  { route: 'fish-farming', label: 'Fish Farming' },
                  { route: 'gallery', label: 'Our Gallery' },
                  { route: 'checkout', label: 'Order & Checkout' },
                  { route: 'payment-records', label: 'Payment Records & Setup' },
                  { route: 'contact', label: 'Contact Us' },
                ] as { route: PageRoute; label: string }[]
              ).map((item) => (
                <li key={item.route}>
                  <button
                    type="button"
                    onClick={() => handleLink(item.route)}
                    className="hover:text-[#DFB14B] transition-colors cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold text-[#DFB14B]">Contact Information</h3>
            <div className="space-y-3 text-sm text-white/85">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#DFB14B] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{business.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#DFB14B] shrink-0" aria-hidden="true" />
                <a
                  href={business.phoneHref}
                  className="hover:text-[#DFB14B] transition-colors tabular-nums"
                >
                  {business.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle
                  className="w-4 h-4 text-[#DFB14B] shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#DFB14B] transition-colors tabular-nums"
                >
                  WhatsApp: {business.whatsappNumber}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#DFB14B] shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${business.email}`}
                  className="hover:text-[#DFB14B] transition-colors break-all"
                >
                  {business.email}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={buildWhatsAppLink(
                  'Hello Baffa Njangirde Agro-Allied Farm, I would like to make an enquiry.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C8962E] text-[#082315] text-sm font-semibold hover:bg-[#DFB14B] transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Site Management Controls */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/70">
          <p>
            © {new Date().getFullYear()} {business.name}. {business.location}.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={toggleEditMode}
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-[#DFB14B] transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isEditMode ? 'Exit Edit Mode' : 'Edit Website Content'}</span>
            </button>
            <button
              type="button"
              onClick={() => openEditor({ type: 'manager', initialTab: 'products' })}
              className="text-white/80 hover:text-[#DFB14B] transition-colors cursor-pointer"
            >
              Manage Products & Gallery
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
