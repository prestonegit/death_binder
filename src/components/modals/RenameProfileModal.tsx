import React, { useState, useId } from 'react';
import { User, Check } from 'lucide-react';
import { useModalAccessibility } from '../../utils/useModalAccessibility';

interface RenameProfileModalProps {
  isOpen: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (newName: string) => void;
}

export const RenameProfileModal: React.FC<RenameProfileModalProps> = ({
  isOpen,
  currentName,
  onClose,
  onSave
}) => {
  const titleId = useId();
  const modalRef = useModalAccessibility({ isOpen, onClose });

  const [name, setName] = useState(currentName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  return (
    <div 
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div 
        ref={modalRef}
        className="modal-container glass-panel" 
        style={{ maxWidth: '420px' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <User className="modal-icon" size={20} aria-hidden="true" />
            <h3 id={titleId}>Rename Profile Packet</h3>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close rename dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="profileRenameInput" className="form-label">Profile Label / Title</label>
              <input
                id="profileRenameInput"
                type="text"
                className="form-input"
                autoFocus
                placeholder="e.g. Eleanor's Packet, Husband's Record"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
              <Check size={16} /> Save Name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
