import React, { useState, useId } from 'react';
import { Shield, Download, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { LegacyBinderData } from '../../types';
import { encryptData, decryptData } from '../../utils/crypto';
import { useModalAccessibility } from '../../utils/useModalAccessibility';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  binderData: LegacyBinderData;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  binderData
}) => {
  const titleId = useId();
  const modalRef = useModalAccessibility({ isOpen, onClose });

  const [encrypt, setEncrypt] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleExport = async () => {
    setError('');
    setSuccessMessage('');

    if (encrypt) {
      if (!password) {
        setError('Please enter an encryption password.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    try {
      setIsExporting(true);
      const jsonString = JSON.stringify(binderData, null, 2);
      let fileData: string;
      let filename: string;
      const dateStr = new Date().toISOString().split('T')[0];

      if (encrypt) {
        fileData = await encryptData(jsonString, password);
        filename = `death-binder-backup-encrypted-${dateStr}.json`;

        // Self-test verification: verify decrypt works immediately
        try {
          const verified = await decryptData(fileData, password);
          if (!verified) throw new Error('Verification failed');
        } catch (testErr) {
          throw new Error('Self-test failed: backup could not be decrypted. Please try a different password.', { cause: testErr });
        }
      } else {
        fileData = jsonString;
        filename = `death-binder-backup-unencrypted-${dateStr}.json`;
      }

      const blob = new Blob([fileData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccessMessage(`Backup successfully downloaded! (${filename})`);
      setTimeout(() => {
        setPassword('');
        setConfirmPassword('');
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Export failed. Please try again.';
      setError(msg);
    } finally {
      setIsExporting(false);
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
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <Shield className="modal-icon" size={22} aria-hidden="true" />
            <h3 id={titleId}>Export Secure Backup</h3>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close export dialog"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">
            Export a sovereign, client-side backup of your entire Legacy Binder. You can restore this file anytime on any computer.
          </p>

          <div className="export-toggle-box">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={encrypt}
                onChange={e => setEncrypt(e.target.checked)}
              />
              <span className="checkbox-title">
                <Lock size={16} /> Encrypt backup with AES-GCM 256 (Highly Recommended)
              </span>
            </label>
            <p className="toggle-helper">
              {encrypt
                ? 'Your file will be strongly encrypted before saving to disk. Only someone with this exact password can open it.'
                : 'Warning: Plain text JSON export contains unencrypted sensitive information.'}
            </p>
          </div>

          {encrypt && (
            <div className="password-fields-group">
              <div className="form-group">
                <label className="form-label">Encryption Password</label>
                <div className="relative-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Create a strong master password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="privacy-peek-btn"
                    onClick={() => setShowPassword(p => !p)}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>

              <p className="disclaimer-text">
                Note: We do not store your password on any server. If you lose this password, the encrypted backup file cannot be recovered.
              </p>
            </div>
          )}

          {error && (
            <div className="modal-alert error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="modal-alert success">
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isExporting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void handleExport()}
            disabled={isExporting}
          >
            <Download size={16} />
            {isExporting ? 'Encrypting & Generating...' : 'Download Backup File'}
          </button>
        </div>
      </div>
    </div>
  );
};
