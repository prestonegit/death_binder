import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PrivacyFieldProps {
  value: string;
  placeholder?: string;
  isMaskedGlobal: boolean;
  type?: 'text' | 'password' | 'textarea' | 'number';
  rows?: number;
  onChange?: (val: string) => void;
  className?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  maskOnlyNumbers?: boolean;
}

export const PrivacyField: React.FC<PrivacyFieldProps> = ({
  value,
  placeholder,
  isMaskedGlobal,
  type = 'text',
  rows = 3,
  onChange,
  className = '',
  disabled = false,
  label,
  helperText,
}) => {
  const [revealed, setRevealed] = useState(false);
  const isHidden = isMaskedGlobal && !revealed && !!value;

  const toggleReveal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRevealed(prev => !prev);
  };

  const maskedDisplay = value ? '•'.repeat(Math.min(Math.max(value.length, 6), 16)) : '';

  return (
    <div className={`privacy-field-wrapper ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <div className="privacy-input-container">
        {type === 'textarea' ? (
          <div className="relative-input-wrapper">
            <textarea
              className={`form-input ${isHidden ? 'privacy-masked-text' : ''}`}
              rows={rows}
              value={isHidden ? '••••••••••••••••••••••••' : value}
              placeholder={placeholder}
              onChange={e => onChange && onChange(e.target.value)}
              disabled={disabled || isHidden}
            />
            {isMaskedGlobal && value && (
              <button
                type="button"
                className="privacy-peek-btn"
                onClick={toggleReveal}
                title={revealed ? 'Hide sensitive content' : 'Peek sensitive content'}
              >
                {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{revealed ? 'Shield' : 'Peek'}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="relative-input-wrapper">
            <input
              type={isHidden ? 'password' : type}
              className={`form-input ${isHidden ? 'privacy-masked-text' : ''}`}
              value={isHidden ? maskedDisplay : value}
              placeholder={placeholder}
              onChange={e => onChange && onChange(e.target.value)}
              disabled={disabled || isHidden}
            />
            {isMaskedGlobal && value && (
              <button
                type="button"
                className="privacy-peek-btn"
                onClick={toggleReveal}
                title={revealed ? 'Hide sensitive content' : 'Peek sensitive content'}
              >
                {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{revealed ? 'Shield' : 'Peek'}</span>
              </button>
            )}
          </div>
        )}
      </div>
      {helperText && <span className="form-helper-text">{helperText}</span>}
    </div>
  );
};
