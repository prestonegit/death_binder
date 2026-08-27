import React from 'react';
import { Check, Minus } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  description: string;
  sectionKey?: string;
  isNotApplicable?: boolean;
  isComplete?: boolean;
  onToggleNotApplicable?: (isNA: boolean) => void;
  actionButton?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  isNotApplicable = false,
  isComplete = false,
  onToggleNotApplicable,
  actionButton,
}) => {
  return (
    <div className="section-header-block no-print">
      <div className="section-header-top">
        <div className="section-title-wrap">
          <div className="section-title-badge-row">
            <h2>{title}</h2>
            {isNotApplicable ? (
              <span className="status-badge na-badge">
                <Minus size={12} /> Not Applicable
              </span>
            ) : isComplete ? (
              <span className="status-badge complete-badge">
                <Check size={12} /> Documented
              </span>
            ) : null}
          </div>
          <p className="section-description">{description}</p>
        </div>

        <div className="section-header-actions">
          {onToggleNotApplicable && (
            <button
              type="button"
              className={`na-toggle-btn ${isNotApplicable ? 'active' : ''}`}
              onClick={() => onToggleNotApplicable(!isNotApplicable)}
              title={isNotApplicable ? 'Click to restore and record details' : 'Mark this section as not applicable'}
            >
              {isNotApplicable ? 'Restore section' : 'Mark as not applicable'}
            </button>
          )}
          {actionButton}
        </div>
      </div>
    </div>
  );
};

