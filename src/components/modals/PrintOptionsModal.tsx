import React, { useState, useId } from 'react';
import { Printer, FileText, AlertCircle, ShieldAlert, Tag } from 'lucide-react';
import { useModalAccessibility } from '../../utils/useModalAccessibility';

export type PrintMode = 'full' | 'emergency' | 'financial' | 'spines';

interface PrintOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPrint: (options: { mode: PrintMode; maskSensitive: boolean }) => void;
}

export const PrintOptionsModal: React.FC<PrintOptionsModalProps> = ({
  isOpen,
  onClose,
  onConfirmPrint
}) => {
  const titleId = useId();
  const modalRef = useModalAccessibility({ isOpen, onClose });

  const [mode, setMode] = useState<PrintMode>('full');
  const [maskSensitive, setMaskSensitive] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    onConfirmPrint({ mode, maskSensitive });
    onClose();
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
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <Printer className="modal-icon" size={22} aria-hidden="true" />
            <h3 id={titleId}>Print & Export PDF</h3>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close print options dialog"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">
            Format your records into a binder-ready physical document. Use the browser print dialog to save as PDF or print directly.
          </p>

          <div className="print-mode-selection" role="radiogroup" aria-label="Print Document Format">
            <button
              type="button"
              role="radio"
              aria-checked={mode === 'full'}
              className={`print-mode-card ${mode === 'full' ? 'active' : ''}`}
              onClick={() => setMode('full')}
            >
              <div className="mode-card-header">
                <FileText size={20} className="mode-icon" aria-hidden="true" />
                <h4>Full Comprehensive Binder</h4>
              </div>
              <p>Complete packet with Cover Page, Table of Contents, First 48-Hour Plan, and all 13 sections formatted with clean page breaks and 3-hole punch gutter margin.</p>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={mode === 'emergency'}
              className={`print-mode-card ${mode === 'emergency' ? 'active' : ''}`}
              onClick={() => setMode('emergency')}
            >
              <div className="mode-card-header">
                <AlertCircle size={20} className="mode-icon warning" aria-hidden="true" />
                <h4>First 48-Hour Emergency Sheet Only</h4>
              </div>
              <p>High-priority 1-page summary with immediate contacts, urgent pet instructions, will location, and key access codes for Plastic Sleeve #0.</p>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={mode === 'financial'}
              className={`print-mode-card ${mode === 'financial' ? 'active' : ''}`}
              onClick={() => setMode('financial')}
            >
              <div className="mode-card-header">
                <ShieldAlert size={20} className="mode-icon" aria-hidden="true" />
                <h4>Financial & Asset Summary Only</h4>
              </div>
              <p>Focused inventory of bank accounts, investments, liabilities, and assets tailored for meetings with an estate attorney or CPA.</p>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={mode === 'spines'}
              className={`print-mode-card ${mode === 'spines' ? 'active' : ''}`}
              onClick={() => setMode('spines')}
            >
              <div className="mode-card-header">
                <Tag size={20} className="mode-icon" aria-hidden="true" />
                <h4>Binder Spine & Divider Tab Inserts</h4>
              </div>
              <p>Printable cut-out labels for 1", 1.5", and 2" physical binder spine sleeves and Avery standard divider index tabs.</p>
            </button>
          </div>

          <div className="export-toggle-box" style={{ marginTop: '16px' }}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={maskSensitive}
                onChange={e => setMaskSensitive(e.target.checked)}
              />
              <span className="checkbox-title">
                Mask account identifiers (e.g. •••• 1234) on printout
              </span>
            </label>
            <p className="toggle-helper">
              Recommended if you plan to share this document outside of immediate trusted executors.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Open Print / PDF Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
