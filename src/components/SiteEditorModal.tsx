import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSiteContent } from '../context/SiteContentContext';
import { FARM_IMAGE_ASSETS } from '../data/defaultSiteContent';
import {
  DivisionKey,
  GalleryCategory,
  GalleryItem,
  ServerProductDTO,
} from '../types/site';
import { readImageFileAsDataUrl } from '../utils/imageUpload';
import { ResilientImage } from './ResilientImage';

const PRESET_IMAGES = [
  { label: 'Integrated Farm Aerial', url: FARM_IMAGE_ASSETS.hero },
  { label: 'Livestock Pasture', url: FARM_IMAGE_ASSETS.livestock },
  { label: 'Poultry House', url: FARM_IMAGE_ASSETS.poultry },
  { label: 'Aquaculture Ponds', url: FARM_IMAGE_ASSETS.fish },
  { label: 'Farm Emblem', url: FARM_IMAGE_ASSETS.emblem },
];

export const SiteEditorModal: React.FC = () => {
  const {
    content,
    activeEditor,
    closeEditor,
    updateContent,
    updateBusinessInfo,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
  } = useSiteContent();

  const { serverProducts, refreshProducts } = useCart();

  const [managerTab, setManagerTab] = useState<'products' | 'gallery'>('products');

  // New Product Form State
  const [newProdDivision, setNewProdDivision] = useState<DivisionKey>('livestock');
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('10000');
  const [newProdUnit, setNewProdUnit] = useState('Per Unit');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdAvail, setNewProdAvail] = useState('Available on Enquiry');
  const [newProdImage, setNewProdImage] = useState(FARM_IMAGE_ASSETS.livestock);

  // New Gallery Form State
  const [newGalTitle, setNewGalTitle] = useState('');
  const [newGalCaption, setNewGalCaption] = useState('');
  const [newGalCategory, setNewGalCategory] =
    useState<GalleryCategory>('Livestock Farming');
  const [newGalImage, setNewGalImage] = useState(FARM_IMAGE_ASSETS.hero);

  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (activeEditor?.type === 'manager' && activeEditor.initialTab) {
      setManagerTab(activeEditor.initialTab);
    }
    setUploadError(null);
  }, [activeEditor]);

  useEffect(() => {
    if (!activeEditor) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEditor();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeEditor, closeEditor]);

  if (!activeEditor) return null;

  const handleImageUpload = async (
    file: File | undefined,
    onSuccess: (dataUrl: string) => void
  ) => {
    if (!file) return;
    setUploadError(null);
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      onSuccess(dataUrl);
    } catch {
      setUploadError('Could not read the selected image file.');
    }
  };

  const ImagePickerField: React.FC<{
    label: string;
    value: string;
    onChange: (val: string) => void;
  }> = ({ label, value, onChange }) => (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-[#0E3B25]">{label}</label>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="w-20 h-16 rounded-md overflow-hidden border border-[#0E3B25]/20 shrink-0 bg-[#F4F7F5]">
          <ResilientImage src={value} alt={label} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 w-full space-y-2">
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0E3B25] text-white text-xs font-medium hover:bg-[#145333] cursor-pointer">
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handleImageUpload(e.target.files?.[0], onChange)}
              />
            </label>
            <select
              aria-label={`Choose preset photo for ${label}`}
              value={PRESET_IMAGES.some((p) => p.url === value) ? value : ''}
              onChange={(e) => {
                if (e.target.value) onChange(e.target.value);
              }}
              className="px-2.5 py-1.5 rounded-md border border-[#0E3B25]/20 text-xs text-[#14241B] bg-white"
            >
              <option value="">Choose farm photo...</option>
              {PRESET_IMAGES.map((p) => (
                <option key={p.url} value={p.url}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste image path / URL"
            className="w-full px-3 py-1.5 text-xs border border-[#0E3B25]/20 rounded-md focus:border-[#0E3B25]"
          />
        </div>
      </div>
    </div>
  );

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    const priceNum = Math.max(100, Math.round(Number(newProdPrice) || 1000));
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        division: newProdDivision,
        name: newProdName.trim(),
        unit_label: newProdUnit.trim() || 'Per Unit',
        price_ngn: priceNum,
        description:
          newProdDesc.trim() || 'Raised with attentive daily care on our farm.',
        availability: newProdAvail.trim() || 'Available on Enquiry',
        image_url: newProdImage,
      }),
    });
    await refreshProducts();
    setNewProdName('');
    setNewProdDesc('');
  };

  const handleUpdateServerProduct = async (
    product: ServerProductDTO,
    patch: Partial<ServerProductDTO>
  ) => {
    const merged = { ...product, ...patch };
    await fetch(`/api/products/${encodeURIComponent(product.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    });
    await refreshProducts();
  };

  const handleDeleteServerProduct = async (id: string) => {
    await fetch(`/api/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    await refreshProducts();
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalTitle.trim()) return;
    addGalleryItem({
      title: newGalTitle.trim(),
      caption: newGalCaption.trim() || 'Baffa Njangirde Agro-Allied Farm operations.',
      category: newGalCategory,
      imageUrl: newGalImage,
    });
    setNewGalTitle('');
    setNewGalCaption('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Website content editor"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-xl border border-[#0E3B25]/20 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0E3B25] text-white flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold">
              {activeEditor.type === 'business' && 'Edit Business & Contact Information'}
              {activeEditor.type === 'homeHero' && 'Edit Homepage Hero Section'}
              {activeEditor.type === 'homeIntro' && 'Edit Farm Introduction Section'}
              {activeEditor.type === 'homeCommitment' && 'Edit Guiding Standards'}
              {activeEditor.type === 'homeCtaBanner' && 'Edit Homepage Enquiry Banner'}
              {activeEditor.type === 'about' && 'Edit About Us Page'}
              {activeEditor.type === 'division' &&
                `Edit ${content.divisions[activeEditor.divisionKey].title} Section`}
              {activeEditor.type === 'galleryIntro' && 'Edit Gallery Header'}
              {activeEditor.type === 'contact' && 'Edit Contact Us Page'}
              {activeEditor.type === 'manager' && 'Product & Gallery Management'}
            </h2>
            <p className="text-xs text-[#DFB14B]">
              Changes save automatically in your browser
            </p>
          </div>
          <button
            type="button"
            onClick={closeEditor}
            aria-label="Close editor"
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {uploadError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {uploadError}
            </div>
          )}

          {activeEditor.type === 'business' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                    Full Business Name
                  </label>
                  <input
                    type="text"
                    value={content.business.name}
                    onChange={(e) => updateBusinessInfo({ name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                    Navbar Short Name
                  </label>
                  <input
                    type="text"
                    value={content.business.shortName}
                    onChange={(e) => updateBusinessInfo({ shortName: e.target.value })}
                    className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Slogan
                </label>
                <input
                  type="text"
                  value={content.business.slogan}
                  onChange={(e) => updateBusinessInfo({ slogan: e.target.value })}
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={content.business.location}
                  onChange={(e) => updateBusinessInfo({ location: e.target.value })}
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                    Telephone Display
                  </label>
                  <input
                    type="text"
                    value={content.business.phoneDisplay}
                    onChange={(e) =>
                      updateBusinessInfo({
                        phoneDisplay: e.target.value,
                        phoneHref: `tel:${e.target.value.replace(/\s+/g, '')}`,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={content.business.whatsappNumber}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^\d]/g, '');
                      updateBusinessInfo({
                        whatsappNumber: e.target.value,
                        whatsappUrl: `https://wa.me/${clean}`,
                      });
                    }}
                    className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={content.business.email}
                  onChange={(e) => updateBusinessInfo({ email: e.target.value })}
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <ImagePickerField
                label="Farm Emblem / Logo"
                value={content.business.emblemUrl}
                onChange={(url) => updateBusinessInfo({ emblemUrl: url })}
              />
            </div>
          )}

          {activeEditor.type === 'homeHero' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Location Eyebrow
                </label>
                <input
                  type="text"
                  value={content.homeHero.eyebrow}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      homeHero: { ...p.homeHero, eyebrow: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={content.homeHero.headline}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      homeHero: { ...p.homeHero, headline: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Welcome Message
                </label>
                <textarea
                  rows={3}
                  value={content.homeHero.welcomeMessage}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      homeHero: { ...p.homeHero, welcomeMessage: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                    WhatsApp Button Label
                  </label>
                  <input
                    type="text"
                    value={content.homeHero.primaryCtaLabel}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        homeHero: { ...p.homeHero, primaryCtaLabel: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                    Phone Button Label
                  </label>
                  <input
                    type="text"
                    value={content.homeHero.secondaryCtaLabel}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        homeHero: { ...p.homeHero, secondaryCtaLabel: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                  />
                </div>
              </div>
              <ImagePickerField
                label="Hero Background Photograph"
                value={content.homeHero.heroImage}
                onChange={(url) =>
                  updateContent((p) => ({
                    ...p,
                    homeHero: { ...p.homeHero, heroImage: url },
                  }))
                }
              />
            </div>
          )}

          {activeEditor.type === 'homeIntro' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Subheading
                </label>
                <input
                  type="text"
                  value={content.homeIntro.subheading}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      homeIntro: { ...p.homeIntro, subheading: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={content.homeIntro.heading}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      homeIntro: { ...p.homeIntro, heading: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  First Paragraph
                </label>
                <textarea
                  rows={3}
                  value={content.homeIntro.bodyPrimary}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      homeIntro: { ...p.homeIntro, bodyPrimary: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Second Paragraph
                </label>
                <textarea
                  rows={3}
                  value={content.homeIntro.bodySecondary}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      homeIntro: { ...p.homeIntro, bodySecondary: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
            </div>
          )}

          {activeEditor.type === 'homeCommitment' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={content.homeCommitment.heading}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        homeCommitment: { ...p.homeCommitment, heading: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                    Subheading
                  </label>
                  <input
                    type="text"
                    value={content.homeCommitment.subheading}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        homeCommitment: {
                          ...p.homeCommitment,
                          subheading: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-3">
                {content.homeCommitment.pillars.map((pillar, idx) => (
                  <div
                    key={pillar.id}
                    className="p-3 rounded-lg border border-[#0E3B25]/15 bg-[#F4F7F5] space-y-2"
                  >
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) =>
                        updateContent((p) => ({
                          ...p,
                          homeCommitment: {
                            ...p.homeCommitment,
                            pillars: p.homeCommitment.pillars.map((item, i) =>
                              i === idx ? { ...item, title: e.target.value } : item
                            ),
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 bg-white border border-[#0E3B25]/20 rounded-md font-semibold"
                    />
                    <textarea
                      rows={2}
                      value={pillar.description}
                      onChange={(e) =>
                        updateContent((p) => ({
                          ...p,
                          homeCommitment: {
                            ...p.homeCommitment,
                            pillars: p.homeCommitment.pillars.map((item, i) =>
                              i === idx ? { ...item, description: e.target.value } : item
                            ),
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 bg-white border border-[#0E3B25]/20 rounded-md text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeEditor.type === 'homeCtaBanner' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Banner Heading
                </label>
                <input
                  type="text"
                  value={content.homeCtaBanner.heading}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      homeCtaBanner: { ...p.homeCtaBanner, heading: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Banner Description
                </label>
                <textarea
                  rows={3}
                  value={content.homeCtaBanner.description}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      homeCtaBanner: {
                        ...p.homeCtaBanner,
                        description: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
            </div>
          )}

          {activeEditor.type === 'about' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  value={content.about.heroTitle}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      about: { ...p.about, heroTitle: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Page Subtitle
                </label>
                <textarea
                  rows={2}
                  value={content.about.heroSubtitle}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      about: { ...p.about, heroSubtitle: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Overview Paragraph 1
                </label>
                <textarea
                  rows={3}
                  value={content.about.overviewParagraphOne}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      about: { ...p.about, overviewParagraphOne: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Overview Paragraph 2
                </label>
                <textarea
                  rows={3}
                  value={content.about.overviewParagraphTwo}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      about: { ...p.about, overviewParagraphTwo: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Purpose Statement
                </label>
                <textarea
                  rows={2}
                  value={content.about.missionStatement}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      about: { ...p.about, missionStatement: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <ImagePickerField
                label="About Feature Photo"
                value={content.about.imageUrl}
                onChange={(url) =>
                  updateContent((p) => ({
                    ...p,
                    about: { ...p.about, imageUrl: url },
                  }))
                }
              />
            </div>
          )}

          {activeEditor.type === 'division' && (
            <div className="space-y-4">
              {(() => {
                const key = activeEditor.divisionKey;
                const div = content.divisions[key];
                return (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                        Division Title
                      </label>
                      <input
                        type="text"
                        value={div.title}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            divisions: {
                              ...p.divisions,
                              [key]: { ...div, title: e.target.value },
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={div.subtitle}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            divisions: {
                              ...p.divisions,
                              [key]: { ...div, subtitle: e.target.value },
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                        Overview Description
                      </label>
                      <textarea
                        rows={3}
                        value={div.overview}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            divisions: {
                              ...p.divisions,
                              [key]: { ...div, overview: e.target.value },
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                        Additional Details
                      </label>
                      <textarea
                        rows={2}
                        value={div.details}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            divisions: {
                              ...p.divisions,
                              [key]: { ...div, details: e.target.value },
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                        Key Farming Practices (one per line)
                      </label>
                      <textarea
                        rows={4}
                        value={div.highlights.join('\n')}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            divisions: {
                              ...p.divisions,
                              [key]: {
                                ...div,
                                highlights: e.target.value
                                  .split('\n')
                                  .map((line) => line.trim())
                                  .filter(Boolean),
                              },
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                      />
                    </div>
                    <ImagePickerField
                      label="Division Photograph"
                      value={div.imageUrl}
                      onChange={(url) =>
                        updateContent((p) => ({
                          ...p,
                          divisions: {
                            ...p.divisions,
                            [key]: { ...div, imageUrl: url },
                          },
                        }))
                      }
                    />
                  </>
                );
              })()}
            </div>
          )}

          {activeEditor.type === 'galleryIntro' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Gallery Heading
                </label>
                <input
                  type="text"
                  value={content.galleryIntro.heading}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      galleryIntro: { ...p.galleryIntro, heading: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Gallery Subtitle
                </label>
                <textarea
                  rows={2}
                  value={content.galleryIntro.subtitle}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      galleryIntro: { ...p.galleryIntro, subtitle: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
            </div>
          )}

          {activeEditor.type === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Contact Page Heading
                </label>
                <input
                  type="text"
                  value={content.contact.heroTitle}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      contact: { ...p.contact, heroTitle: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Contact Page Subtitle
                </label>
                <textarea
                  rows={2}
                  value={content.contact.heroSubtitle}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      contact: { ...p.contact, heroSubtitle: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Form Heading
                </label>
                <input
                  type="text"
                  value={content.contact.formHeading}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      contact: { ...p.contact, formHeading: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0E3B25] mb-1">
                  Form Description
                </label>
                <textarea
                  rows={2}
                  value={content.contact.formDescription}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      contact: { ...p.contact, formDescription: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0E3B25]/20 rounded-lg"
                />
              </div>
            </div>
          )}

          {activeEditor.type === 'manager' && (
            <div className="space-y-6">
              {/* Segmented Tabs */}
              <div className="flex items-center gap-1 p-1 bg-[#F4F7F5] rounded-lg border border-[#0E3B25]/10 w-fit">
                <button
                  type="button"
                  onClick={() => setManagerTab('products')}
                  className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    managerTab === 'products'
                      ? 'bg-[#0E3B25] text-white'
                      : 'text-[#2A4135] hover:text-[#0E3B25]'
                  }`}
                >
                  Farm Products ({serverProducts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setManagerTab('gallery')}
                  className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    managerTab === 'gallery'
                      ? 'bg-[#0E3B25] text-white'
                      : 'text-[#2A4135] hover:text-[#0E3B25]'
                  }`}
                >
                  Gallery Photos ({content.gallery.length})
                </button>
              </div>

              {managerTab === 'products' ? (
                <div className="space-y-6">
                  {/* Add New Product */}
                  <form
                    onSubmit={handleAddProduct}
                    className="p-4 rounded-lg border border-[#0E3B25]/15 bg-[#F4F7F5] space-y-3"
                  >
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0E3B25]">
                      Add New Farm Product (Server-Side NGN Pricing)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Division
                        </label>
                        <select
                          value={newProdDivision}
                          onChange={(e) =>
                            setNewProdDivision(e.target.value as DivisionKey)
                          }
                          className="w-full px-3 py-2 rounded-md border border-[#0E3B25]/20 bg-white text-xs"
                        >
                          <option value="livestock">Livestock Farming</option>
                          <option value="poultry">Poultry Farming</option>
                          <option value="fish-farming">Fish Farming</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Availability Label
                        </label>
                        <input
                          type="text"
                          value={newProdAvail}
                          onChange={(e) => setNewProdAvail(e.target.value)}
                          placeholder="e.g. Available on Enquiry"
                          className="w-full px-3 py-2 rounded-md border border-[#0E3B25]/20 bg-white text-xs"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-medium mb-1">
                          Price (NGN)
                        </label>
                        <input
                          type="number"
                          min={100}
                          required
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                          className="w-full px-3 py-2 rounded-md border border-[#0E3B25]/20 bg-white text-xs tabular-nums"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium mb-1">
                          Unit Label
                        </label>
                        <input
                          type="text"
                          value={newProdUnit}
                          onChange={(e) => setNewProdUnit(e.target.value)}
                          placeholder="e.g. Per Bird, Per Crate, Per Kg"
                          className="w-full px-3 py-2 rounded-md border border-[#0E3B25]/20 bg-white text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="e.g. Live Broiler Birds"
                        className="w-full px-3 py-2 rounded-md border border-[#0E3B25]/20 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        placeholder="Describe this farm product..."
                        className="w-full px-3 py-2 rounded-md border border-[#0E3B25]/20 bg-white text-xs"
                      />
                    </div>
                    <ImagePickerField
                      label="Product Photo"
                      value={newProdImage}
                      onChange={setNewProdImage}
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0E3B25] text-white text-xs font-semibold hover:bg-[#145333] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                      <span>Add Product</span>
                    </button>
                  </form>

                  {/* Existing Server Products List */}
                  <div className="space-y-3">
                    {serverProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-3 rounded-lg border border-[#0E3B25]/15 bg-white flex flex-col sm:flex-row gap-3 items-start"
                      >
                        <div className="w-20 h-16 rounded-md overflow-hidden shrink-0 border border-[#0E3B25]/10">
                          <ResilientImage
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 w-full space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              defaultValue={product.name}
                              onBlur={(e) => {
                                if (e.target.value.trim() && e.target.value !== product.name) {
                                  handleUpdateServerProduct(product, {
                                    name: e.target.value.trim(),
                                  });
                                }
                              }}
                              className="px-2.5 py-1.5 border border-[#0E3B25]/20 rounded-md text-xs font-semibold"
                            />
                            <input
                              type="number"
                              min={100}
                              defaultValue={product.price_ngn}
                              onBlur={(e) => {
                                const val = Math.round(Number(e.target.value));
                                if (val >= 100 && val !== product.price_ngn) {
                                  handleUpdateServerProduct(product, {
                                    price_ngn: val,
                                  });
                                }
                              }}
                              aria-label={`NGN price for ${product.name}`}
                              className="px-2.5 py-1.5 border border-[#0E3B25]/20 rounded-md text-xs tabular-nums"
                            />
                            <input
                              type="text"
                              defaultValue={product.unit_label}
                              onBlur={(e) => {
                                if (e.target.value.trim() && e.target.value !== product.unit_label) {
                                  handleUpdateServerProduct(product, {
                                    unit_label: e.target.value.trim(),
                                  });
                                }
                              }}
                              className="px-2.5 py-1.5 border border-[#0E3B25]/20 rounded-md text-xs"
                            />
                          </div>
                          <textarea
                            rows={2}
                            defaultValue={product.description}
                            onBlur={(e) => {
                              if (e.target.value !== product.description) {
                                handleUpdateServerProduct(product, {
                                  description: e.target.value,
                                });
                              }
                            }}
                            className="w-full px-2.5 py-1.5 border border-[#0E3B25]/20 rounded-md text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteServerProduct(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Add New Gallery Photo */}
                  <form
                    onSubmit={handleAddGallery}
                    className="p-4 rounded-lg border border-[#0E3B25]/15 bg-[#F4F7F5] space-y-3"
                  >
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0E3B25]">
                      Add New Gallery Photograph
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Photo Title
                        </label>
                        <input
                          type="text"
                          required
                          value={newGalTitle}
                          onChange={(e) => setNewGalTitle(e.target.value)}
                          placeholder="e.g. Morning Cattle Feeding"
                          className="w-full px-3 py-2 rounded-md border border-[#0E3B25]/20 bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Category
                        </label>
                        <select
                          value={newGalCategory}
                          onChange={(e) =>
                            setNewGalCategory(e.target.value as GalleryCategory)
                          }
                          className="w-full px-3 py-2 rounded-md border border-[#0E3B25]/20 bg-white text-xs"
                        >
                          <option value="Livestock Farming">Livestock Farming</option>
                          <option value="Poultry Farming">Poultry Farming</option>
                          <option value="Fish Farming">Fish Farming</option>
                          <option value="Farm Grounds">Farm Grounds</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Caption</label>
                      <input
                        type="text"
                        value={newGalCaption}
                        onChange={(e) => setNewGalCaption(e.target.value)}
                        placeholder="Brief caption describing the farm scene..."
                        className="w-full px-3 py-2 rounded-md border border-[#0E3B25]/20 bg-white text-xs"
                      />
                    </div>
                    <ImagePickerField
                      label="Gallery Image"
                      value={newGalImage}
                      onChange={setNewGalImage}
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0E3B25] text-white text-xs font-semibold hover:bg-[#145333] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                      <span>Add to Gallery</span>
                    </button>
                  </form>

                  {/* Existing Gallery List */}
                  <div className="space-y-3">
                    {content.gallery.map((item: GalleryItem) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg border border-[#0E3B25]/15 bg-white flex flex-col sm:flex-row gap-3 items-start"
                      >
                        <div className="w-20 h-16 rounded-md overflow-hidden shrink-0 border border-[#0E3B25]/10">
                          <ResilientImage
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 w-full space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) =>
                                updateGalleryItem(item.id, { title: e.target.value })
                              }
                              className="px-2.5 py-1.5 border border-[#0E3B25]/20 rounded-md text-xs font-semibold"
                            />
                            <select
                              value={item.category}
                              onChange={(e) =>
                                updateGalleryItem(item.id, {
                                  category: e.target.value as GalleryCategory,
                                })
                              }
                              className="px-2.5 py-1.5 border border-[#0E3B25]/20 rounded-md text-xs bg-white"
                            >
                              <option value="Livestock Farming">Livestock Farming</option>
                              <option value="Poultry Farming">Poultry Farming</option>
                              <option value="Fish Farming">Fish Farming</option>
                              <option value="Farm Grounds">Farm Grounds</option>
                            </select>
                          </div>
                          <input
                            type="text"
                            value={item.caption}
                            onChange={(e) =>
                              updateGalleryItem(item.id, { caption: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 border border-[#0E3B25]/20 rounded-md text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteGalleryItem(item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#F4F7F5] border-t border-[#0E3B25]/10 flex justify-end">
          <button
            type="button"
            onClick={closeEditor}
            className="px-5 py-2 rounded-lg bg-[#0E3B25] text-white text-sm font-semibold hover:bg-[#145333] cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
