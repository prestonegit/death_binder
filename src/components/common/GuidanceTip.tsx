import React, { useState } from 'react';
import { Info, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface GuidanceTipProps {
  type?: 'info' | 'legal-warning' | 'security' | 'calm';
  title?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export const GuidanceTip: React.FC<GuidanceTipProps> = ({
  type = 'info',
  title,
  children,
  collapsible = false,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getIcon = () => {
    switch (type) {
      case 'legal-warning':
        return <AlertTriangle size={18} className="guidance-icon warning" />;
      case 'security':
        return <ShieldCheck size={18} className="guidance-icon security" />;
      default:
        return <Info size={18} className="guidance-icon info" />;
    }
  };

  return (
    <div className={`guidance-tip-box guidance-${type} no-print`}>
      <div 
        className={`guidance-header ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={() => collapsible && setIsExpanded(prev => !prev)}
      >
        <div className="guidance-title-row">
          {getIcon()}
          {title && <span className="guidance-title">{title}</span>}
        </div>
        {collapsible && (
          <button type="button" className="guidance-toggle-btn" aria-label="Toggle guidance">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
      {(!collapsible || isExpanded) && (
        <div className="guidance-content">
          {children}
        </div>
      )}
    </div>
  );
};
