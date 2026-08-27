import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface InfoBubbleProps {
  title: string;
  explanation: string;
  example?: string;
  className?: string;
  buttonLabel?: string;
}

export const InfoBubble: React.FC<InfoBubbleProps> = ({
  title,
  explanation,
  example,
  className = '',
  buttonLabel = 'Learn more'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className={`info-bubble-container ${className}`} ref={containerRef}>
      <button
        type="button"
        className={`info-bubble-trigger ${isOpen ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
        aria-label={`${buttonLabel}: ${title}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title={`${buttonLabel}: ${title}`}
      >
        <HelpCircle size={16} className="info-bubble-icon" />
      </button>

      {isOpen && (
        <div 
          className="info-bubble-popover glass-panel"
          role="region"
          aria-label={title}
        >
          <div className="info-bubble-header">
            <h4 className="info-bubble-title">{title}</h4>
            <button
              type="button"
              className="info-bubble-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close information"
            >
              <X size={16} />
            </button>
          </div>

          <div className="info-bubble-body">
            <p className="info-bubble-explanation">{explanation}</p>
            {example && (
              <div className="info-bubble-example">
                <strong>Real-World Example:</strong> {example}
              </div>
            )}
          </div>

          <div className="info-bubble-footer">
            <button
              type="button"
              className="info-bubble-ack-btn"
              onClick={() => setIsOpen(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
