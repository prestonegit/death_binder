import React, { useState, useId } from 'react';
import { Upload, Lock, AlertCircle, CheckCircle2, FileText, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
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

  const [step, setStep] = useState<'select' | 'confirm'>('select');
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<LegacyBinderData | null>(null);

  const handleClose = () => {
    setStep('select');
    setPreviewData(null);
    setFileContent('');
    setFileName('');
    setPassword('');
    setError('');
    setIsProcessing(false);
    onClose();
  };

  const modalRef = useModalAccessibility({ isOpen, onClose: handleClose });

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setPreviewData(null);
    setStep('select');
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

  const handleInspectBackup = async () => {
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

      setPreviewData(migrated);
      setStep('confirm');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to parse backup file. Please check password and file format.';
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmRestore = () => {
    if (!previewData) return;

    try {
      // Create automatic safety snapshot in localStorage before restoring
      const currentV2 = localStorage.getItem('legacy_binder_v2');
      const currentV1 = localStorage.getItem('legacy_binder_v1');
      const snapshot = currentV2 || currentV1;
      if (snapshot) {
        localStorage.setItem(
          'deathbinder_pre_restore_backup',
          JSON.stringify({
            savedAt: new Date().toISOString(),
            source: 'pre_restore_safety_snapshot',
            data: JSON.parse(snapshot)
          })
        );
      }
    } catch (snapErr) {
      console.warn('Could not create pre-restore snapshot', snapErr);
    }

    onImportSuccess(previewData);
    handleClose();
  };

  // Preview metadata extraction
  const primaryProfile = previewData?.profiles?.primary;
  const primaryName = primaryProfile?.personalInfo?.fullName || primaryProfile?.profileName || 'Primary Profile';
  const secondaryProfile = previewData?.profiles?.secondary;
  const secondaryName = secondaryProfile?.personalInfo?.fullName || secondaryProfile?.profileName;

  const contactsCount = primaryProfile?.contacts?.length ?? 0;
  const accountsCount = primaryProfile?.financialAccounts?.length ?? 0;
  const assetsCount = primaryProfile?.assets?.length ?? 0;
  const formattedDate = previewData?.lastUpdated
    ? new Date(previewData.lastUpdated).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Unknown date';

  return (
    <div 
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
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
            <h3 id={titleId}>
              {step === 'confirm' ? 'Confirm Backup Restoration' : 'Restore from Backup'}
            </h3>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={handleClose}
            aria-label="Close import dialog"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {step === 'select' ? (
            <>
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
                    <label className="form-label" htmlFor="importPasswordInput">
                      <Lock size={14} style={{ display: 'inline', marginRight: 4 }} /> 
                      Decryption Password
                    </label>
                    <div className="relative-input-wrapper">
                      <input
                        id="importPasswordInput"
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
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="modal-subtitle">
                Please verify the contents of this backup before applying it to your binder.
              </p>

              <div className="backup-preview-card">
                <div className="backup-preview-header">
                  <span className="backup-preview-title">Backup Docket Details</span>
                  <span className="badge badge-subtle">{isEncrypted ? 'Encrypted Backup' : 'Plain JSON'}</span>
                </div>

                <div className="backup-preview-meta-grid">
                  <div className="backup-preview-meta-item">
                    <span className="backup-preview-meta-label">Primary Profile</span>
                    <span className="backup-preview-meta-value">{primaryName}</span>
                  </div>
                  {secondaryName && (
                    <div className="backup-preview-meta-item">
                      <span className="backup-preview-meta-label">Secondary Profile</span>
                      <span className="backup-preview-meta-value">{secondaryName}</span>
                    </div>
                  )}
                  <div className="backup-preview-meta-item">
                    <span className="backup-preview-meta-label">Backup Export Date</span>
                    <span className="backup-preview-meta-value">{formattedDate}</span>
                  </div>
                  <div className="backup-preview-meta-item">
                    <span className="backup-preview-meta-label">Records Included</span>
                    <span className="backup-preview-meta-value">
                      {contactsCount} Contacts, {accountsCount} Accounts, {assetsCount} Assets
                    </span>
                  </div>
                  <div className="backup-preview-meta-item" style={{ gridColumn: 'span 2' }}>
                    <span className="backup-preview-meta-label">Source File</span>
                    <span className="backup-preview-meta-value" style={{ wordBreak: 'break-all' }}>{fileName}</span>
                  </div>
                </div>

                <div className="backup-preview-safety-note">
                  <ShieldCheck size={20} style={{ flexShrink: 0, marginTop: 1, color: 'var(--accent-primary)' }} />
                  <div>
                    <strong>Pre-Restore Safety Net:</strong> Restoring this backup will replace your current active records. 
                    DeathBinder will automatically save an archival safety snapshot of your current binder in local storage 
                    (<code>deathbinder_pre_restore_backup</code>) before restoring.
                  </div>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="modal-alert error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step === 'select' ? (
            <>
              <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={isProcessing}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => void handleInspectBackup()}
                disabled={!fileContent || isProcessing}
              >
                <CheckCircle2 size={16} />
                {isProcessing ? 'Decrypting & Inspecting...' : 'Review Backup Details'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setStep('select');
                  setError('');
                }}
              >
                <ArrowLeft size={15} />
                Choose Different File
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmRestore}
              >
                <CheckCircle2 size={16} />
                Confirm & Restore Binder
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
