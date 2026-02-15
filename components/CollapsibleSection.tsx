
import React, { useState, useEffect, useRef } from 'react';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightMeta?: string;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  children: React.ReactNode;
  variant?: 'card' | 'flat';
  badgeText?: string;
  testID?: string;
}

/**
 * A reusable Collapsible Section component (Accordion style).
 * Uses CSS transitions for smooth height animation in a React Web environment,
 * matching the requested soft wellness aesthetic.
 */
const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  subtitle,
  leftIcon,
  rightMeta,
  defaultExpanded = false,
  expanded,
  onToggle,
  children,
  variant = 'card',
  badgeText,
  testID,
}) => {
  const [isInternalExpanded, setIsInternalExpanded] = useState(defaultExpanded);
  
  // Controlled vs Uncontrolled logic
  const isControlled = typeof expanded !== 'undefined';
  const currentExpanded = isControlled ? expanded : isInternalExpanded;

  const handleToggle = () => {
    const nextState = !currentExpanded;
    if (!isControlled) {
      setIsInternalExpanded(nextState);
    }
    if (onToggle) {
      onToggle(nextState);
    }
  };

  const containerStyles = variant === 'card' 
    ? "bg-white rounded-[22px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50 mb-4"
    : "bg-transparent border-b border-[#E5E7EB]/50 mb-2";

  return (
    <div className={containerStyles} data-testid={testID}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 focus:outline-none group"
        aria-expanded={currentExpanded}
        aria-label={`Toggle ${title} section`}
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          {leftIcon && (
            <div className="w-8 h-8 rounded-xl bg-[#F7F4F1] flex items-center justify-center text-lg">
              {leftIcon}
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-[#1F2937] tracking-tight">{title}</span>
              {badgeText && (
                <span className="px-2 py-0.5 rounded-full bg-[#8FAF9D]/10 text-[#8FAF9D] text-[9px] font-bold uppercase tracking-widest border border-[#8FAF9D]/10">
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && (
              <span className="text-[12px] font-medium text-[#6B7280] leading-tight">{subtitle}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {rightMeta && (
            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest opacity-60">
              {rightMeta}
            </span>
          )}
          <div 
            className={`transition-transform duration-300 ease-out text-[#8FAF9D] ${currentExpanded ? 'rotate-180' : 'rotate-0'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </button>

      {/* Smooth height transition using grid strategy */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${currentExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}
      >
        <div className="overflow-hidden">
          {variant === 'card' && (
             <div className="mx-4 h-[1px] bg-[#F7F4F1]" />
          )}
          <div className="p-4 pt-2">
            <div className="animate-in fade-in duration-500">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
