import React from 'react';
import { Pencil } from 'lucide-react';
import { EditableTarget, useSiteContent } from '../context/SiteContentContext';

interface EditableSectionWrapperProps {
  label: string;
  target: EditableTarget;
  children: React.ReactNode;
  className?: string;
}

export const EditableSectionWrapper: React.FC<EditableSectionWrapperProps> = ({
  label,
  target,
  children,
  className = '',
}) => {
  const { isEditMode, openEditor } = useSiteContent();

  return (
    <div
      className={`relative ${
        isEditMode ? 'ring-2 ring-dashed ring-[#C8962E]/70 ring-offset-2' : ''
      } ${className}`}
    >
      {isEditMode && (
        <div className="absolute top-3 right-3 z-30">
          <button
            type="button"
            onClick={() => openEditor(target)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0E3B25] text-white text-xs font-semibold shadow-md border border-[#DFB14B] hover:bg-[#145333] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Pencil className="w-3.5 h-3.5 text-[#DFB14B]" aria-hidden="true" />
            <span>Edit {label}</span>
          </button>
        </div>
      )}
      {children}
    </div>
  );
};
