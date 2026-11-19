import React from 'react';
import { FolderKanban, RotateCcw, Settings, X } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export const EditModeBar: React.FC = () => {
  const { isEditMode, setIsEditMode, openEditor, resetToDefaults } = useSiteContent();

  if (!isEditMode) return null;

  return (
    <div
      role="region"
      aria-label="Website content editor bar"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl bg-[#082315] text-white border border-[#DFB14B]/60 rounded-xl shadow-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
        <span className="text-[#DFB14B] font-semibold whitespace-nowrap">
          Edit Mode Active
        </span>
        <span className="hidden sm:inline text-white/70">
          · Click any highlighted section to edit text or images
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => openEditor({ type: 'business' })}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          <Settings className="w-3.5 h-3.5 text-[#DFB14B]" aria-hidden="true" />
          <span>Business Info</span>
        </button>

        <button
          type="button"
          onClick={() => openEditor({ type: 'manager', initialTab: 'products' })}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#C8962E] text-[#082315] hover:bg-[#DFB14B] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          <FolderKanban className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Products & Gallery</span>
        </button>

        <button
          type="button"
          onClick={resetToDefaults}
          title="Restore original website text and photos"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-red-600/80 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <button
          type="button"
          onClick={() => setIsEditMode(false)}
          aria-label="Exit Edit Mode"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Done</span>
        </button>
      </div>
    </div>
  );
};
