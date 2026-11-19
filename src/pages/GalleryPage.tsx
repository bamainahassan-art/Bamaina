import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { EditableSectionWrapper } from '../components/EditableSectionBar';
import { ResilientImage } from '../components/ResilientImage';
import { useSiteContent } from '../context/SiteContentContext';
import { GalleryCategory } from '../types/site';

const CATEGORIES: ('All' | GalleryCategory)[] = [
  'All',
  'Livestock Farming',
  'Poultry Farming',
  'Fish Farming',
  'Farm Grounds',
];

export const GalleryPage: React.FC = () => {
  const { content, isEditMode, openEditor } = useSiteContent();
  const { gallery, galleryIntro, business } = content;
  const [selectedCategory, setSelectedCategory] = useState<'All' | GalleryCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems =
    selectedCategory === 'All'
      ? gallery
      : gallery.filter((item) => item.category === selectedCategory);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredItems.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + filteredItems.length) % filteredItems.length
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, filteredItems.length]);

  const activePhoto =
    lightboxIndex !== null ? filteredItems[lightboxIndex] || null : null;

  return (
    <div>
      {/* Header */}
      <EditableSectionWrapper
        label="Gallery Header"
        target={{ type: 'galleryIntro' }}
      >
        <section className="bg-[#0E3B25] text-white py-16 border-b border-[#DFB14B]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <p className="text-xs font-semibold text-[#DFB14B]">
              {business.name} · {business.location}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold">
              {galleryIntro.heading}
            </h1>
            <p className="text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed">
              {galleryIntro.subtitle}
            </p>
          </div>
        </section>
      </EditableSectionWrapper>

      {/* Filter & Grid */}
      <section className="py-14 lg:py-20 bg-[#F4F7F5] min-h-[520px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Segmented Filter Control */}
            <div
              role="tablist"
              aria-label="Filter gallery by farm division"
              className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-lg border border-[#0E3B25]/12 w-fit"
            >
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setLightboxIndex(null);
                  }}
                  className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-[#0E3B25] text-white'
                      : 'text-[#2A4135] hover:text-[#0E3B25] hover:bg-[#F4F7F5]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {isEditMode && (
              <button
                type="button"
                onClick={() => openEditor({ type: 'manager', initialTab: 'gallery' })}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0E3B25] text-white text-xs font-semibold hover:bg-[#145333] cursor-pointer whitespace-nowrap w-fit"
              >
                <Plus className="w-4 h-4 text-[#DFB14B]" aria-hidden="true" />
                <span>Manage Gallery Photos</span>
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#0E3B25]/12 p-12 text-center space-y-2">
              <p className="font-display text-xl font-bold text-[#0E3B25]">
                No photos in this category
              </p>
              <p className="text-sm text-[#354B3E]">
                Select another category or add new photographs using the Gallery Manager.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, idx) => (
                <article
                  key={item.id}
                  className="bg-white rounded-xl border border-[#0E3B25]/12 overflow-hidden flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className="group relative aspect-[4/3] w-full overflow-hidden bg-[#0E3B25] cursor-pointer text-left"
                  >
                    <ResilientImage
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </button>
                  <div className="p-5 space-y-1.5 flex-1">
                    <p className="text-xs font-semibold text-[#8A6110]">
                      {item.category}
                    </p>
                    <h2 className="font-display text-lg font-bold text-[#0E3B25]">
                      {item.title}
                    </h2>
                    <p className="text-sm text-[#354B3E] leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Viewer */}
      {activePhoto && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {filteredItems.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + filteredItems.length) %
                      filteredItems.length
                  )
                }
                className="absolute left-3 sm:left-6 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() =>
                  setLightboxIndex((lightboxIndex + 1) % filteredItems.length)
                }
                className="absolute right-3 sm:right-6 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-w-4xl w-full bg-[#082315] border border-[#DFB14B]/40 rounded-xl overflow-hidden shadow-2xl">
            <div className="max-h-[72vh] w-full bg-black flex items-center justify-center overflow-hidden">
              <ResilientImage
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[72vh] w-auto object-contain"
              />
            </div>
            <div className="p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-[#DFB14B]">
                  {activePhoto.category}
                </p>
                <h3 className="font-display text-xl font-bold">{activePhoto.title}</h3>
                <p className="text-sm text-white/80 mt-0.5">{activePhoto.caption}</p>
              </div>
              <span className="text-xs text-white/60 tabular-nums shrink-0">
                {lightboxIndex + 1} / {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
