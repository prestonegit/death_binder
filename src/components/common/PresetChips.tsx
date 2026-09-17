import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

export interface PresetOption {
  label: string;
  value: string;
  category?: string;
  website?: string;
  billingCycle?: string;
  notes?: string;
}

interface PresetChipsProps {
  options: (string | PresetOption)[];
  onSelect: (option: PresetOption) => void;
  title?: string;
  className?: string;
  maxInitial?: number;
}

export const PresetChips: React.FC<PresetChipsProps> = ({
  options,
  onSelect,
  title = 'Quick-Add common choices:',
  className = '',
  maxInitial = 4
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldChunk = options.length > maxInitial + 1;
  const visibleOptions = shouldChunk && !isExpanded 
    ? options.slice(0, maxInitial) 
    : options;

  return (
    <div className={`preset-chips-container ${className}`}>
      {title && <span className="preset-chips-title">{title}</span>}
      <div className="preset-chips-list">
        {visibleOptions.map((opt) => {
          const optionObj: PresetOption = typeof opt === 'string'
            ? { label: opt, value: opt }
            : opt;

          return (
            <button
              key={optionObj.label}
              type="button"
              className="preset-chip-btn"
              onClick={(e) => {
                e.preventDefault();
                onSelect(optionObj);
              }}
            >
              <Plus size={12} className="preset-chip-plus" />
              <span>{optionObj.label}</span>
            </button>
          );
        })}

        {shouldChunk && (
          <button
            type="button"
            className="preset-chip-btn preset-chip-toggle"
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <>
                <ChevronUp size={12} />
                <span>Show Fewer</span>
              </>
            ) : (
              <>
                <ChevronDown size={12} />
                <span>+ More ({options.length - maxInitial})</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
