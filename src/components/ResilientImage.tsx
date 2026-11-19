import React, { useState } from 'react';
import { Sprout } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  aspectClassName?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle,
  aspectClassName = '',
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0E3B25] via-[#145333] to-[#082315] text-white p-6 text-center ${aspectClassName} ${className}`}
      >
        <div className="w-12 h-12 rounded-full border border-[#DFB14B]/40 bg-[#DFB14B]/10 flex items-center justify-center mb-3">
          <Sprout className="w-6 h-6 text-[#DFB14B]" aria-hidden="true" />
        </div>
        <span className="font-display text-sm font-medium text-[#F2DFB0]">
          {fallbackTitle || alt || 'Baffa Njangirde Agro-Allied Farm'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
