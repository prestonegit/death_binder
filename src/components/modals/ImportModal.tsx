import React, { useState, useId } from 'react';
import { Upload, Lock, AlertCircle, CheckCircle2, FileText, Eye, EyeOff } from 'lucide-react';
import type { LegacyBinderData } from '../../types';
import { decryptData } from '../../utils/crypto';
import { migrateBinderData } from '../../utils/migrations';
import { useModalAccessibility } from '../../utils/useModalAccessibility';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (data: LegacyBinderData) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const titleId = useId();
  const modalRef = useModalAccessibility({ isOpen, onClose });

  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setFileContent(text);
        
        // Inspect content to detect encryption
        const parsed = JSON.parse(text) as Record<string, unknown>;
        if (parsed.ciphertext && parsed.salt && parsed.iv) {
          setIsEncrypted(true);
        } else {
          setIsEncrypted(false);
        }
      } catch (jsonErr) {
        console.error(jsonErr);
        setError('Invalid file format. Please choose a valid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleRestore = async () => {
    setError('');

    if (!fileContent) {
      setError('Please select a backup file first.');
      return;
    }

    try {
      setIsProcessing(true);
      let rawJson = fileContent;

      if (isEncrypted) {
        if (!password) {
          setError('This backup is encrypted. Please enter the password.');
          setIsProcessing(false);
          return;
        }
        rawJson = await decryptData(fileContent, password);
      }

      const parsed = JSON.parse(rawJson) as Record<string, unknown>;
      const migrated = migrateBinderData(parsed);

      onImportSuccess(migrated);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to import backup file.';
      setError(msg);
    } finally {
      setIsProcessing(false);
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
            <Upload className="modal-icon" size={22} aria-hidden="true" />
            <h3 id={titleId}>Restore from Backup</h3>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close import dialog"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">
            Upload a previously exported backup file (encrypted or plain JSON) to restore your Legacy Binder records.
          </p>

          <div className="file-upload-dropzone">
            <input
              type="file"
              id="backupFileInput"
              accept=".json,application/json"
              className="hidden-file-input"
              onChange={handleFileChange}
            />
            <label htmlFor="backupFileInput" className="file-upload-label">
              <FileText size={28} className="upload-icon" />
              {fileName ? (
                <span className="file-selected-name">{fileName}</span>
              ) : (
                <>
                  <span className="upload-prompt-main">Click to select backup file</span>
                  <span className="upload-prompt-sub">Supports .json backup files</span>
                </>
              )}
            </label>
          </div>

          {isEncrypted && (
            <div className="password-fields-group" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label className="form-label">
                  <Lock size={14} style={{ display: 'inline', marginRight: 4 }} /> 
                  Decryption Password
                </label>
                <div className="relative-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter the password used during export"
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
            </div>
          )}

          {error && (
            <div className="modal-alert error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isProcessing}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void handleRestore()}
            disabled={!fileContent || isProcessing}
          >
            <CheckCircle2 size={16} />
            {isProcessing ? 'Decrypting & Restoring...' : 'Restore Binder'}
          </button>
        </div>
      </div>
    </div>
  );
};
