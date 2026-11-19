import React from 'react';
import { ArrowRight, MapPin, MessageCircle, Phone } from 'lucide-react';
import { EditableSectionWrapper } from '../components/EditableSectionBar';
import { ResilientImage } from '../components/ResilientImage';
import { useSiteContent } from '../context/SiteContentContext';
import { PageRoute } from '../types/site';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { content, buildWhatsAppLink } = useSiteContent();
  const { about, business } = content;

  return (
    <EditableSectionWrapper label="About Us Page" target={{ type: 'about' }}>
      <div>
        {/* Page Hero */}
        <section className="bg-[#0E3B25] text-white py-16 lg:py-20 border-b border-[#DFB14B]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <p className="text-xs font-semibold text-[#DFB14B]">
              {business.location}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl">
              {about.heroTitle}
            </h1>
            <p className="text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed">
              {about.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Enterprise Overview */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-5">
                <p className="text-xs font-semibold text-[#8A6110]">
                  Nigerian Agricultural Enterprise
                </p>
                <h2 className="font-display text-3xl font-bold text-[#0E3B25]">
                  {about.overviewHeading}
                </h2>
                <div className="space-y-4 text-base text-[#354B3E] leading-relaxed">
                  <p>{about.overviewParagraphOne}</p>
                  <p>{about.overviewParagraphTwo}</p>
                  <p>{about.overviewParagraphThree}</p>
                </div>

                {/* Purpose Callout */}
                <div className="mt-6 p-6 rounded-xl border border-[#C8962E]/40 bg-[#F4F7F5] space-y-2">
                  <p className="text-xs font-semibold text-[#8A6110]">
                    {about.missionHeading}
                  </p>
                  <p className="font-display text-lg font-medium text-[#0E3B25] leading-relaxed">
                    {about.missionStatement}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#0E3B25]/15 bg-[#0E3B25]">
                  <ResilientImage
                    src={about.imageUrl}
                    alt={about.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 rounded-xl border border-[#0E3B25]/12 bg-[#F4F7F5] flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#C8962E] bg-white shrink-0">
                    <ResilientImage
                      src={business.emblemUrl}
                      alt={`${business.name} emblem`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-bold text-[#0E3B25]">
                      {business.name}
                    </h3>
                    <p className="text-sm text-[#8A6110] font-medium">
                      {business.slogan}
                    </p>
                    <p className="text-xs text-[#354B3E] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0E3B25]" aria-hidden="true" />
                      <span>{business.location}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="py-16 lg:py-20 bg-[#F4F7F5] border-t border-[#0E3B25]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-semibold text-[#8A6110]">Our Commitment</p>
              <h2 className="font-display text-3xl font-bold text-[#0E3B25]">
                {about.pillarsHeading}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {about.pillars.map((pillar) => (
                <div
                  key={pillar.id}
                  className="bg-white p-6 rounded-xl border border-[#0E3B25]/12 space-y-3"
                >
                  <span className="inline-block font-display text-2xl font-bold text-[#C8962E] tabular-nums">
                    {pillar.number}.
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#0E3B25]">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#354B3E] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Direct Connection */}
        <section className="py-14 bg-white border-t border-[#0E3B25]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h2 className="font-display text-2xl font-bold text-[#0E3B25]">
                Explore Our Three Agricultural Divisions
              </h2>
              <p className="text-sm text-[#354B3E]">
                View Livestock Farming, Poultry Farming, Fish Farming, or get in touch directly.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('livestock')}
                className="px-4 py-2.5 rounded-lg border border-[#0E3B25]/20 text-sm font-semibold text-[#0E3B25] hover:bg-[#F4F7F5] cursor-pointer"
              >
                Livestock
              </button>
              <button
                type="button"
                onClick={() => onNavigate('poultry')}
                className="px-4 py-2.5 rounded-lg border border-[#0E3B25]/20 text-sm font-semibold text-[#0E3B25] hover:bg-[#F4F7F5] cursor-pointer"
              >
                Poultry
              </button>
              <button
                type="button"
                onClick={() => onNavigate('fish-farming')}
                className="px-4 py-2.5 rounded-lg border border-[#0E3B25]/20 text-sm font-semibold text-[#0E3B25] hover:bg-[#F4F7F5] cursor-pointer"
              >
                Fish Farming
              </button>
              <a
                href={buildWhatsAppLink(
                  `Hello ${business.name}, I would like to learn more about your farm.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0E3B25] text-white text-sm font-semibold hover:bg-[#145333]"
              >
                <MessageCircle className="w-4 h-4 text-[#DFB14B]" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
              <a
                href={business.phoneHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C8962E] text-[#082315] text-sm font-semibold hover:bg-[#DFB14B] tabular-nums"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>{business.phoneDisplay}</span>
              </a>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E3B25] hover:text-[#8A6110] px-2 cursor-pointer"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </EditableSectionWrapper>
  );
};
