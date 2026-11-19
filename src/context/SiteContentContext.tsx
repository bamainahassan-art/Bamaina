import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_SITE_CONTENT } from '../data/defaultSiteContent';
import {
  BusinessInfo,
  DivisionKey,
  FarmProduct,
  GalleryItem,
  SiteContent,
} from '../types/site';

const STORAGE_KEY = 'baffa_njangirde_site_content_v1';

export type EditableTarget =
  | { type: 'business' }
  | { type: 'homeHero' }
  | { type: 'homeIntro' }
  | { type: 'homeCommitment' }
  | { type: 'homeCtaBanner' }
  | { type: 'about' }
  | { type: 'division'; divisionKey: DivisionKey }
  | { type: 'galleryIntro' }
  | { type: 'contact' }
  | { type: 'manager'; initialTab?: 'products' | 'gallery' };

interface SiteContentContextValue {
  content: SiteContent;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  toggleEditMode: () => void;
  activeEditor: EditableTarget | null;
  openEditor: (target: EditableTarget) => void;
  closeEditor: () => void;
  updateContent: (updater: (prev: SiteContent) => SiteContent) => void;
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;
  addProduct: (product: Omit<FarmProduct, 'id'>) => void;
  updateProduct: (id: string, patch: Partial<FarmProduct>) => void;
  deleteProduct: (id: string) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (id: string, patch: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  resetToDefaults: () => void;
  buildWhatsAppLink: (prefillMessage?: string) => string;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

function loadStoredContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return {
      ...DEFAULT_SITE_CONTENT,
      ...parsed,
      business: { ...DEFAULT_SITE_CONTENT.business, ...(parsed.business || {}) },
      homeHero: { ...DEFAULT_SITE_CONTENT.homeHero, ...(parsed.homeHero || {}) },
      homeIntro: { ...DEFAULT_SITE_CONTENT.homeIntro, ...(parsed.homeIntro || {}) },
      homeCommitment: {
        ...DEFAULT_SITE_CONTENT.homeCommitment,
        ...(parsed.homeCommitment || {}),
      },
      homeCtaBanner: {
        ...DEFAULT_SITE_CONTENT.homeCtaBanner,
        ...(parsed.homeCtaBanner || {}),
      },
      about: { ...DEFAULT_SITE_CONTENT.about, ...(parsed.about || {}) },
      divisions: {
        livestock: {
          ...DEFAULT_SITE_CONTENT.divisions.livestock,
          ...(parsed.divisions?.livestock || {}),
        },
        poultry: {
          ...DEFAULT_SITE_CONTENT.divisions.poultry,
          ...(parsed.divisions?.poultry || {}),
        },
        'fish-farming': {
          ...DEFAULT_SITE_CONTENT.divisions['fish-farming'],
          ...(parsed.divisions?.['fish-farming'] || {}),
        },
      },
      galleryIntro: {
        ...DEFAULT_SITE_CONTENT.galleryIntro,
        ...(parsed.galleryIntro || {}),
      },
      contact: { ...DEFAULT_SITE_CONTENT.contact, ...(parsed.contact || {}) },
      products: Array.isArray(parsed.products)
        ? parsed.products
        : DEFAULT_SITE_CONTENT.products,
      gallery: Array.isArray(parsed.gallery)
        ? parsed.gallery
        : DEFAULT_SITE_CONTENT.gallery,
    };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [content, setContent] = useState<SiteContent>(loadStoredContent);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeEditor, setActiveEditor] = useState<EditableTarget | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // Ignore quota exceeded gracefully
    }
  }, [content]);

  const toggleEditMode = () => setIsEditMode((prev) => !prev);
  const openEditor = (target: EditableTarget) => setActiveEditor(target);
  const closeEditor = () => setActiveEditor(null);

  const updateContent = (updater: (prev: SiteContent) => SiteContent) => {
    setContent((prev) => updater(prev));
  };

  const updateBusinessInfo = (info: Partial<BusinessInfo>) => {
    setContent((prev) => ({
      ...prev,
      business: { ...prev.business, ...info },
    }));
  };

  const addProduct = (product: Omit<FarmProduct, 'id'>) => {
    const id = `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setContent((prev) => ({
      ...prev,
      products: [{ ...product, id }, ...prev.products],
    }));
  };

  const updateProduct = (id: string, patch: Partial<FarmProduct>) => {
    setContent((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  };

  const deleteProduct = (id: string) => {
    setContent((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const id = `gal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setContent((prev) => ({
      ...prev,
      gallery: [{ ...item, id }, ...prev.gallery],
    }));
  };

  const updateGalleryItem = (id: string, patch: Partial<GalleryItem>) => {
    setContent((prev) => ({
      ...prev,
      gallery: prev.gallery.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    }));
  };

  const deleteGalleryItem = (id: string) => {
    setContent((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g.id !== id),
    }));
  };

  const resetToDefaults = () => {
    setContent(DEFAULT_SITE_CONTENT);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
  };

  const buildWhatsAppLink = (prefillMessage?: string) => {
    const base = content.business.whatsappUrl || 'https://wa.me/2348065494739';
    if (!prefillMessage) return base;
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}text=${encodeURIComponent(prefillMessage)}`;
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        isEditMode,
        setIsEditMode,
        toggleEditMode,
        activeEditor,
        openEditor,
        closeEditor,
        updateContent,
        updateBusinessInfo,
        addProduct,
        updateProduct,
        deleteProduct,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        resetToDefaults,
        buildWhatsAppLink,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export function useSiteContent(): SiteContentContextValue {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error('useSiteContent must be used inside SiteContentProvider');
  }
  return ctx;
}
