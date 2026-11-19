import React from 'react';
import { ArrowRight, MapPin, MessageCircle, Phone } from 'lucide-react';
import { EditableSectionWrapper } from '../components/EditableSectionBar';
import { ResilientImage } from '../components/ResilientImage';
import { useSiteContent } from '../context/SiteContentContext';
import { DivisionKey, PageRoute } from '../types/site';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { content, buildWhatsAppLink } = useSiteContent();
  const {
    business,
    homeHero,
    homeIntro,
    homeCommitment,
    homeCtaBanner,
    divisions,
    gallery,
  } = content;

  const divisionList: { key: DivisionKey; indexLabel: string }[] = [
    { key: 'livestock', indexLabel: '01' },
    { key: 'poultry', indexLabel: '02' },
    { key: 'fish-farming', indexLabel: '03' },
  ];

  return (
    <div>
      {/* 1. Hero Section */}
      <EditableSectionWrapper label="Hero Section" target={{ type: 'homeHero' }}>
        <section className="relative min-h-[600px] lg:min-h-[640px] flex items-center bg-[#082315] text-white overflow-hidden">
          <div className="absolute inset-0">
            <ResilientImage
              src={homeHero.heroImage}
              alt={homeHero.heroImageAlt}
              className="w-full h-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#082315]/95 via-[#082315]/80 to-[#082315]/45"
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-medium text-[#DFB14B]">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{homeHero.eyebrow}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Livestock · Poultry · Fish Farming</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.12] tracking-tight text-white max-w-3xl">
                  {homeHero.headline}
                </h1>

                <p className="font-display italic text-xl sm:text-2xl text-[#DFB14B]">
                  {business.slogan}
                </p>

                <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl">
                  {homeHero.welcomeMessage}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href={buildWhatsAppLink(
                      `Hello ${business.name}, I would like to make an enquiry.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#C8962E] text-[#082315] font-semibold text-sm sm:text-base hover:bg-[#DFB14B] transition-colors shadow-sm whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-5 h-5" aria-hidden="true" />
                    <span>{homeHero.primaryCtaLabel}</span>
                  </a>

                  <a
                    href={business.phoneHref}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-white/10 border border-white/30 text-white font-semibold text-sm sm:text-base hover:bg-white/20 transition-colors whitespace-nowrap shrink-0 tabular-nums"
                  >
                    <Phone className="w-4 h-4 text-[#DFB14B]" aria-hidden="true" />
                    <span>{homeHero.secondaryCtaLabel}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => onNavigate('checkout')}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-[#0E3B25] border border-[#C8962E] text-[#DFB14B] font-semibold text-sm hover:bg-[#145333] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Order & Pay Now</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#F2DFB0] hover:text-white underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Send Enquiry</span>
                  </button>
                </div>
              </div>

              {/* Official Farm Emblem Showcase */}
              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <div className="bg-white/95 p-4 rounded-2xl border border-[#DFB14B]/60 shadow-xl max-w-[260px] w-full text-center">
                  <div className="aspect-square w-full overflow-hidden rounded-xl bg-white">
                    <ResilientImage
                      src={business.emblemUrl}
                      alt={`${business.name} official emblem`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="mt-3 text-xs font-semibold text-[#0E3B25]">
                    {business.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </EditableSectionWrapper>

      {/* 2. Enterprise Introduction */}
      <EditableSectionWrapper label="Introduction" target={{ type: 'homeIntro' }}>
        <section className="py-16 lg:py-20 bg-white border-b border-[#0E3B25]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5 space-y-3">
                <p className="text-xs font-semibold tracking-wide text-[#8A6110]">
                  {homeIntro.subheading}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0E3B25] leading-tight">
                  {homeIntro.heading}
                </h2>
              </div>
              <div className="lg:col-span-7 space-y-5 text-base text-[#354B3E] leading-relaxed">
                <p>{homeIntro.bodyPrimary}</p>
                <p>{homeIntro.bodySecondary}</p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('about')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E3B25] hover:text-[#8A6110] transition-colors cursor-pointer"
                  >
                    <span>Read More About Our Farm</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </EditableSectionWrapper>

      {/* 3. Three Core Business Activities */}
      <section className="py-16 lg:py-24 bg-[#F4F7F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#0E3B25]/12 pb-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#8A6110]">
                Core Agricultural Operations
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0E3B25]">
                Our Farm Divisions
              </h2>
            </div>
            <p className="text-sm text-[#354B3E] max-w-md">
              Explore our three active agricultural branches: livestock farming, poultry
              production, and fish farming.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {divisionList.map(({ key, indexLabel }) => {
              const div = divisions[key];
              return (
                <article
                  key={key}
                  className="bg-white rounded-xl border border-[#0E3B25]/12 overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1"
                >
                  <div>
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#0E3B25]">
                      <ResilientImage
                        src={div.imageUrl}
                        alt={div.imageAlt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#8A6110]">
                        <span className="tabular-nums">{indexLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>Agricultural Division</span>
                      </div>
                      <h3 className="font-display text-2xl font-bold text-[#0E3B25]">
                        {div.title}
                      </h3>
                      <p className="text-sm text-[#354B3E] leading-relaxed">
                        {div.subtitle}
                      </p>
                      <p className="text-sm text-[#4A6153] leading-relaxed">
                        {div.overview}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-[#0E3B25]/8 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onNavigate(key)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E3B25] hover:text-[#8A6110] transition-colors cursor-pointer"
                    >
                      <span>Explore {div.title}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <a
                      href={buildWhatsAppLink(
                        `Hello ${business.name}, I have an enquiry about ${div.title}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#8A6110] hover:text-[#0E3B25] transition-colors whitespace-nowrap"
                    >
                      WhatsApp Enquiry
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Guiding Standards */}
      <EditableSectionWrapper
        label="Guiding Standards"
        target={{ type: 'homeCommitment' }}
      >
        <section className="py-16 lg:py-20 bg-white border-y border-[#0E3B25]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-semibold text-[#8A6110]">
                {homeCommitment.subheading}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0E3B25]">
                {homeCommitment.heading}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {homeCommitment.pillars.map((pillar) => (
                <div
                  key={pillar.id}
                  className="p-6 rounded-xl border border-[#0E3B25]/12 bg-[#F4F7F5]/60 space-y-3"
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
      </EditableSectionWrapper>

      {/* 5. Gallery Preview Strip */}
      <section className="py-16 lg:py-20 bg-[#F4F7F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-[#8A6110]">Farm Operations</p>
              <h2 className="font-display text-3xl font-bold text-[#0E3B25]">
                From Our Gallery
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('gallery')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0E3B25]/25 bg-white text-sm font-semibold text-[#0E3B25] hover:bg-[#0E3B25] hover:text-white transition-colors cursor-pointer whitespace-nowrap w-fit"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {gallery.slice(0, 4).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate('gallery')}
                className="group text-left bg-white rounded-xl border border-[#0E3B25]/12 overflow-hidden cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#0E3B25]">
                  <ResilientImage
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-xs font-medium text-[#8A6110]">{item.category}</p>
                  <p className="font-display text-base font-bold text-[#0E3B25] truncate">
                    {item.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Direct Enquiry CTA Banner */}
      <EditableSectionWrapper label="CTA Banner" target={{ type: 'homeCtaBanner' }}>
        <section className="py-16 bg-[#0E3B25] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs font-semibold text-[#DFB14B]">
                {business.location} · Tel: {business.phoneDisplay}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
                {homeCtaBanner.heading}
              </h2>
              <p className="text-base text-white/85 leading-relaxed">
                {homeCtaBanner.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <a
                href={buildWhatsAppLink(
                  `Hello ${business.name}, I would like to enquire about your farm produce.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#C8962E] text-[#082315] font-semibold text-sm hover:bg-[#DFB14B] transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>{homeCtaBanner.whatsappButtonLabel}</span>
              </a>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white text-[#0E3B25] font-semibold text-sm hover:bg-[#F2DFB0] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{homeCtaBanner.contactButtonLabel}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </EditableSectionWrapper>
    </div>
  );
};
