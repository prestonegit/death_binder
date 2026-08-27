import React from 'react';
import { Plus } from 'lucide-react';

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
}

export const PresetChips: React.FC<PresetChipsProps> = ({
  options,
  onSelect,
  title = 'Quick-Add common choices:',
  className = ''
}) => {
  return (
    <div className={`preset-chips-container ${className}`}>
      {title && <span className="preset-chips-title">{title}</span>}
      <div className="preset-chips-list">
        {options.map((opt) => {
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
      </div>
    </div>
  );
};
