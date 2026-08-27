import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, Smartphone, Key, Shield, Globe } from 'lucide-react';
import type { DigitalAccount } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { PrivacyField } from '../common/PrivacyField';
import { InfoBubble } from '../common/InfoBubble';
import { PresetChips, type PresetOption } from '../common/PresetChips';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';

interface DigitalSectionProps {
  accounts: DigitalAccount[];
  isPrivacyMasked: boolean;
  isNotApplicable?: boolean;
  onAddAccount: (account: DigitalAccount) => void;
  onUpdateAccount: (id: string, updated: Partial<DigitalAccount>) => void;
  onDeleteAccount: (id: string) => void;
  onToggleNA: (isNA: boolean) => void;
}

const DIGITAL_CATEGORIES = [
  { value: 'password_manager', label: 'Password Manager Master Vault (1Password, Bitwarden, Apple Keychain)' },
  { value: 'email', label: 'Primary Email Account (Google, Microsoft Outlook, iCloud)' },
  { value: 'cloud_storage', label: 'Cloud Photos & Files (Google Drive, iCloud, Dropbox)' },
  { value: 'hardware_2fa', label: 'Physical Security USB Key (YubiKey, Titan Key)' },
  { value: 'device_passcode', label: 'Phone / Laptop / Tablet Lock Screen Passcode' },
  { value: 'financial_crypto', label: 'Crypto Exchange / Hardware Wallet / PayPal' },
  { value: 'social_media', label: 'Social Media (Facebook, Instagram, LinkedIn, X)' },
  { value: 'other', label: 'Other Digital Service' }
];

const DIGITAL_PRESETS: PresetOption[] = [
  { label: '1Password', value: '1Password Master Vault', category: 'password_manager', notes: 'Master Emergency Kit printed in home safe' },
  { label: 'Apple ID / iCloud', value: 'Apple ID & iCloud', category: 'cloud_storage', notes: 'Configured Apple Legacy Contact in iPhone Settings' },
  { label: 'Google Account', value: 'Google / Gmail Account', category: 'email', notes: 'Configured Google Inactive Account Manager' },
  { label: 'Bitwarden', value: 'Bitwarden Vault', category: 'password_manager' },
  { label: 'Microsoft 365', value: 'Microsoft 365 / Outlook', category: 'email' },
  { label: 'Physical USB Key', value: 'YubiKey / Security Key', category: 'hardware_2fa', notes: 'On primary keychain' }
];

export const DigitalSection: React.FC<DigitalSectionProps> = ({
  accounts,
  isPrivacyMasked,
  isNotApplicable = false,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
  onToggleNA
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleAddNew = (preset?: PresetOption) => {
    const newId = `d_${Date.now()}`;
    const newAccount: DigitalAccount = {
      id: newId,
      platform: preset?.value || '',
      category: (preset?.category as DigitalAccount['category']) || 'password_manager',
      username: '',
      recoveryEmailPhone: '',
      legacyContactConfigured: false,
      digitalExecutor: '',
      rufadaaDirectives: '',
      hardwareKeyLocation: '',
      notes: preset?.notes || ''
    };
    onAddAccount(newAccount);
    setEditingId(newId);
  };

  return (
    <div className="section-content-container">
      <SectionHeader
        title="Online Accounts & Passwords"
        description="Password vaults, master recovery kits, primary email hubs, and instructions for photos and digital legacy."
        isNotApplicable={isNotApplicable}
        isComplete={accounts.length > 0}
        onToggleNotApplicable={onToggleNA}
        actionButton={
          <button type="button" className="btn btn-primary" onClick={() => handleAddNew()}>
            <Plus size={16} /> Add Online Account
          </button>
        }
      />

      <GuidanceTip type="info" title="Why Tech Companies Lock Accounts (Digital Legacy Laws)">
        Under privacy laws (RUFADAA), companies like Apple and Google cannot legally grant your family access to your photos or email unless you configure their built-in <strong>Legacy Contact</strong> or provide written consent.
      </GuidanceTip>

      {/* Quick-Add Presets */}
      <div className="quick-presets-wrapper no-print">
        <PresetChips
          title="Quick-Add common digital vaults & accounts:"
          options={DIGITAL_PRESETS}
          onSelect={(preset) => handleAddNew(preset)}
        />
      </div>

      <div className="list-stack">
        {accounts.length === 0 ? (
          <div className="empty-state-card glass-panel">
            <Smartphone size={32} className="empty-icon" />
            <p>No online accounts or password vaults listed yet.</p>
            <button type="button" className="btn btn-secondary" onClick={() => handleAddNew()}>
              <Plus size={14} /> Add 1Password, Apple ID, or Email
            </button>
          </div>
        ) : (
          accounts.map(acc => {
            const isEditing = editingId === acc.id;

            return (
              <div key={acc.id} className="list-item-card glass-panel">
                {isEditing ? (
                  <div className="edit-form-grid">
                    <div className="form-group form-grid-half">
                      <label className="form-label">Platform or Service Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 1Password / Apple ID / Google Workspace / YubiKey"
                        value={acc.platform}
                        onChange={e => onUpdateAccount(acc.id, { platform: e.target.value })}
                        autoFocus
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <label className="form-label">Account Category</label>
                      <select
                        className="form-select"
                        value={acc.category}
                        onChange={e => onUpdateAccount(acc.id, { category: e.target.value as DigitalAccount['category'] })}
                      >
                        {DIGITAL_CATEGORIES.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group form-grid-half">
                      <label className="form-label">Primary Username or Login Email</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. john@smith.org / @jsmith"
                        value={acc.username}
                        onChange={e => onUpdateAccount(acc.id, { username: e.target.value })}
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <div className="label-with-info">
                        <label className="form-label">Recovery Phone / Alternate Email</label>
                        <InfoBubble
                          title={INFO_DEFINITIONS.cell_phone_2fa.title}
                          explanation={INFO_DEFINITIONS.cell_phone_2fa.explanation}
                          example={INFO_DEFINITIONS.cell_phone_2fa.example}
                        />
                      </div>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. (555) 123-4567 / backup@gmail.com"
                        value={acc.recoveryEmailPhone}
                        onChange={e => onUpdateAccount(acc.id, { recoveryEmailPhone: e.target.value })}
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <label className="form-label">Designated Digital Executor (Who manages this?)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Eleanor Vance (Spouse) / Thomas Sterling"
                        value={acc.digitalExecutor}
                        onChange={e => onUpdateAccount(acc.id, { digitalExecutor: e.target.value })}
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <div className="label-with-info">
                        <label className="form-label">In-App Legacy Contact Configured?</label>
                        <InfoBubble
                          title={INFO_DEFINITIONS.rufadaa_digital.title}
                          explanation={INFO_DEFINITIONS.rufadaa_digital.explanation}
                          example={INFO_DEFINITIONS.rufadaa_digital.example}
                        />
                      </div>
                      <select
                        className="form-select"
                        value={acc.legacyContactConfigured ? 'yes' : 'no'}
                        onChange={e => onUpdateAccount(acc.id, { legacyContactConfigured: e.target.value === 'yes' })}
                      >
                        <option value="no">No / Not yet setup</option>
                        <option value="yes">Yes — In-app Legacy Contact active</option>
                      </select>
                    </div>

                    <div className="form-group form-grid-full">
                      <PrivacyField
                        label="Physical Location of Emergency Recovery Kit or USB Security Key"
                        placeholder="e.g. Emergency Master Key sheet in home safe; YubiKey on car keychain."
                        value={acc.hardwareKeyLocation}
                        isMaskedGlobal={isPrivacyMasked}
                        onChange={val => onUpdateAccount(acc.id, { hardwareKeyLocation: val })}
                      />
                    </div>

                    <div className="form-group form-grid-full">
                      <label className="form-label">Instructions for Family & Photos (What should happen?)</label>
                      <textarea
                        className="form-input"
                        rows={2}
                        placeholder="e.g. Download all family photos and export archives to external drive, then permanently close and delete account."
                        value={acc.rufadaaDirectives}
                        onChange={e => onUpdateAccount(acc.id, { rufadaaDirectives: e.target.value })}
                      />
                    </div>

                    <div className="edit-actions-row form-grid-full">
                      <button
                        type="button"
                        className="btn btn-secondary danger-btn"
                        onClick={() => {
                          onDeleteAccount(acc.id);
                          setEditingId(null);
                        }}
                      >
                        <Trash2 size={14} /> Remove Account
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setEditingId(null)}
                      >
                        <Check size={14} /> Save Account
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-card-content">
                    <div className="display-card-header">
                      <div className="display-title-group">
                        <h4>{acc.platform || <span className="unnamed-placeholder">Unnamed Platform</span>}</h4>
                        <span className="role-tag">
                          {DIGITAL_CATEGORIES.find(c => c.value === acc.category)?.label.split(' ')[0] || acc.category}
                        </span>
                        {acc.legacyContactConfigured && (
                          <span className="status-pill complete-pill" style={{ marginLeft: 8 }}>
                            Legacy Contact Configured
                          </span>
                        )}
                      </div>
                      <div className="card-actions">
                        {confirmDeleteId === acc.id ? (
                          <div className="inline-delete-confirm">
                            <span className="delete-prompt-text">Delete?</span>
                            <button
                              type="button"
                              className="btn-action-sm danger"
                              onClick={() => {
                                onDeleteAccount(acc.id);
                                setConfirmDeleteId(null);
                              }}
                            >
                              Yes, Delete
                            </button>
                            <button
                              type="button"
                              className="btn-action-sm"
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn-action-sm"
                              onClick={() => setEditingId(acc.id)}
                            >
                              <Edit3 size={14} /> <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="btn-action-sm danger"
                              onClick={() => setConfirmDeleteId(acc.id)}
                            >
                              <Trash2 size={14} /> <span>Remove</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="display-card-body">
                      <div className="contact-details-grid">
                        {acc.username && (
                          <div className="detail-item">
                            <Globe size={14} className="detail-icon" />
                            <span>Username: {acc.username}</span>
                          </div>
                        )}
                        {acc.digitalExecutor && (
                          <div className="detail-item">
                            <Shield size={14} className="detail-icon" />
                            <span>Digital Executor: {acc.digitalExecutor}</span>
                          </div>
                        )}
                        {acc.hardwareKeyLocation && (
                          <div className="detail-item full-width">
                            <Key size={14} className="detail-icon" />
                            <span>Recovery Kit / Key: {isPrivacyMasked ? '••••••••••••••••' : acc.hardwareKeyLocation}</span>
                          </div>
                        )}
                        {acc.rufadaaDirectives && (
                          <div className="detail-item full-width">
                            <span><strong>Instructions:</strong> {acc.rufadaaDirectives}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
