import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, Landmark, Globe, Shield } from 'lucide-react';
import type { FinancialAccount } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { PrivacyField } from '../common/PrivacyField';
import { InfoBubble } from '../common/InfoBubble';
import { PresetChips, type PresetOption } from '../common/PresetChips';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';

interface FinancialSectionProps {
  accounts: FinancialAccount[];
  isPrivacyMasked: boolean;
  isNotApplicable?: boolean;
  onAddAccount: (account: FinancialAccount) => void;
  onUpdateAccount: (id: string, updated: Partial<FinancialAccount>) => void;
  onDeleteAccount: (id: string) => void;
  onToggleNA: (isNA: boolean) => void;
}

const ACCOUNT_TYPES = [
  'Checking Account',
  'Savings Account',
  'Brokerage / Investment',
  '401(k) / 403(b) Retirement',
  'Traditional / Roth IRA',
  'Health Savings Account (HSA)',
  'Mortgage Loan',
  'Credit Card',
  'Automobile Loan',
  'Cryptocurrency Hardware Vault',
  'Pension / Annuity',
  'Other Account'
];

const BANK_PRESETS: PresetOption[] = [
  { label: 'Chase', value: 'Chase Bank', website: 'chase.com' },
  { label: 'Fidelity', value: 'Fidelity Investments', category: 'Brokerage / Investment', website: 'fidelity.com' },
  { label: 'Vanguard', value: 'Vanguard', category: 'Brokerage / Investment', website: 'vanguard.com' },
  { label: 'Charles Schwab', value: 'Charles Schwab', category: 'Brokerage / Investment', website: 'schwab.com' },
  { label: 'Bank of America', value: 'Bank of America', website: 'bankofamerica.com' },
  { label: 'Wells Fargo', value: 'Wells Fargo', website: 'wellsfargo.com' },
  { label: 'Capital One', value: 'Capital One', website: 'capitalone.com' },
  { label: 'Coinbase', value: 'Coinbase', category: 'Cryptocurrency Hardware Vault', website: 'coinbase.com' },
  { label: 'Navy Federal', value: 'Navy Federal Credit Union', website: 'navyfederal.org' }
];

export const FinancialSection: React.FC<FinancialSectionProps> = ({
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
    const newId = `f_${Date.now()}`;
    const newAccount: FinancialAccount = {
      id: newId,
      institution: preset?.value || '',
      accountType: preset?.category || 'Checking Account',
      accountIdentifier: '',
      beneficiaryDesignation: '',
      website: preset?.website || '',
      notes: ''
    };
    onAddAccount(newAccount);
    setEditingId(newId);
  };

  return (
    <div className="section-content-container">
      <SectionHeader
        title="Financial Accounts & Investments"
        description="Inventory of banks, retirement accounts, brokerages, and loans to ensure your assets are claimed and accounted for."
        isNotApplicable={isNotApplicable}
        isComplete={accounts.length > 0}
        onToggleNotApplicable={onToggleNA}
        actionButton={
          <button type="button" className="btn btn-primary" onClick={() => handleAddNew()}>
            <Plus size={16} /> Add Financial Account
          </button>
        }
      />

      <GuidanceTip type="security" title="Security Best Practice: Never Record Full Passwords">
        Never write down full account numbers or plain passwords. The <strong>Institution Name</strong> and <strong>Last 4 Digits</strong> gives your executor exactly what they need to claim the funds with an official death certificate without putting you at risk today.
      </GuidanceTip>

      {/* Quick-Add Presets */}
      <div className="quick-presets-wrapper no-print">
        <PresetChips
          title="Quick-Add common banks & brokerages:"
          options={BANK_PRESETS}
          onSelect={(preset) => handleAddNew(preset)}
        />
      </div>

      <div className="list-stack">
        {accounts.length === 0 ? (
          <div className="empty-state-card glass-panel">
            <Landmark size={32} className="empty-icon" />
            <p>No financial accounts listed yet.</p>
            <button type="button" className="btn btn-secondary" onClick={() => handleAddNew()}>
              <Plus size={14} /> Add Checking or 401(k) Account
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
                      <div className="label-with-info">
                        <label className="form-label">Financial Institution Name</label>
                      </div>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Chase Bank, Vanguard, Fidelity"
                        value={acc.institution}
                        onChange={e => onUpdateAccount(acc.id, { institution: e.target.value })}
                        autoFocus
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <label className="form-label">Account Type</label>
                      <select
                        className="form-select"
                        value={acc.accountType}
                        onChange={e => onUpdateAccount(acc.id, { accountType: e.target.value })}
                      >
                        {ACCOUNT_TYPES.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group form-grid-half">
                      <div className="label-with-info">
                        <label className="form-label">Last 4 Digits of Account</label>
                        <InfoBubble
                          title={INFO_DEFINITIONS.institution_identifiers.title}
                          explanation={INFO_DEFINITIONS.institution_identifiers.explanation}
                          example={INFO_DEFINITIONS.institution_identifiers.example}
                        />
                      </div>
                      <PrivacyField
                        placeholder="e.g. ...4819"
                        value={acc.accountIdentifier}
                        isMaskedGlobal={isPrivacyMasked}
                        onChange={val => onUpdateAccount(acc.id, { accountIdentifier: val })}
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <div className="label-with-info">
                        <label className="form-label">Named Beneficiary (Who receives this account?)</label>
                        <InfoBubble
                          title={INFO_DEFINITIONS.pod_beneficiary.title}
                          explanation={INFO_DEFINITIONS.pod_beneficiary.explanation}
                          example={INFO_DEFINITIONS.pod_beneficiary.example}
                        />
                      </div>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Primary: Eleanor Vance (100%), Contingent: Children"
                        value={acc.beneficiaryDesignation}
                        onChange={e => onUpdateAccount(acc.id, { beneficiaryDesignation: e.target.value })}
                      />
                      <span className="form-helper-text">Named beneficiary accounts transfer directly and bypass probate court.</span>
                    </div>

                    <div className="form-group form-grid-half">
                      <label className="form-label">Website or Login Portal</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. chase.com / vanguard.com"
                        value={acc.website}
                        onChange={e => onUpdateAccount(acc.id, { website: e.target.value })}
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <label className="form-label">Notes & Purpose</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Primary salary direct deposit; auto-pays electric bill."
                        value={acc.notes}
                        onChange={e => onUpdateAccount(acc.id, { notes: e.target.value })}
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
                        <h4>{acc.institution || <span className="unnamed-placeholder">Unnamed Institution</span>}</h4>
                        <span className="role-tag">{acc.accountType}</span>
                        {acc.accountIdentifier && (
                          <span className="identifier-tag">
                            {isPrivacyMasked ? '••••••••' : acc.accountIdentifier}
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
                        {acc.beneficiaryDesignation && (
                          <div className="detail-item full-width">
                            <Shield size={14} className="detail-icon" />
                            <span><strong>Named Beneficiary:</strong> {acc.beneficiaryDesignation}</span>
                          </div>
                        )}
                        {acc.website && (
                          <div className="detail-item">
                            <Globe size={14} className="detail-icon" />
                            <span>{acc.website}</span>
                          </div>
                        )}
                      </div>

                      {acc.notes && (
                        <p className="item-notes-text">{acc.notes}</p>
                      )}
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
