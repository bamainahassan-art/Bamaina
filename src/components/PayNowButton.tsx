import React from 'react';
import { Lock } from 'lucide-react';

interface PayNowButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PayNowButton: React.FC<PayNowButtonProps> = ({
  onClick,
  type = 'button',
  disabled = false,
  label = 'Pay Now',
  className = '',
  size = 'md',
}) => {
  const sizeClasses =
    size === 'sm'
      ? 'px-4 py-2 text-xs'
      : size === 'lg'
        ? 'px-6 py-3.5 text-base'
        : 'px-5 py-2.5 text-sm';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold bg-[#0E3B25] text-[#DFB14B] border border-[#C8962E] hover:bg-[#145333] hover:text-[#F2DFB0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer ${sizeClasses} ${className}`}
    >
      <Lock className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
};
