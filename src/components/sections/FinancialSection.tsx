import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, Landmark, Globe, Shield, AlertTriangle } from 'lucide-react';
import type { FinancialAccount } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { PrivacyField } from '../common/PrivacyField';
import { InfoBubble } from '../common/InfoBubble';
import { PresetChips, type PresetOption } from '../common/PresetChips';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';
import { ACCOUNT_TITLING_PRESETS } from '../../data/philosophyPresets';
import { SectionStarterBanner } from '../common/SectionStarterBanner';
import { FINANCIAL_STARTERS, type SectionStarterArchetype } from '../../data/sectionStarters';

interface FinancialSectionProps {
  accounts: FinancialAccount[];
  isPrivacyMasked: boolean;
  isNotApplicable?: boolean;
  onAddAccount: (account: FinancialAccount) => void;
  onSetAccounts?: (accounts: FinancialAccount[]) => void;
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
  onSetAccounts,
  onUpdateAccount,
  onDeleteAccount,
  onToggleNA
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const hasExistingData = accounts.length > 0;

  const handleApplyStarter = (
    starter: SectionStarterArchetype<FinancialAccount[]>,
    mode: 'fill_empty' | 'replace'
  ) => {
    const freshAccounts = starter.data.map((acc, index) => ({
      ...acc,
      id: `f_${Date.now()}_${index}`
    }));

    if (mode === 'replace' || !hasExistingData) {
      if (onSetAccounts) {
        onSetAccounts(freshAccounts);
      } else {
        freshAccounts.forEach(acc => onAddAccount(acc));
      }
    } else {
      if (onSetAccounts) {
        onSetAccounts([...accounts, ...freshAccounts]);
      } else {
        freshAccounts.forEach(acc => onAddAccount(acc));
      }
    }
  };

  const handleAddNew = (preset?: PresetOption) => {
    const newId = `f_${Date.now()}`;
    const newAccount: FinancialAccount = {
      id: newId,
      institution: preset?.value || '',
      accountType: preset?.category || 'Checking Account',
      accountIdentifier: '',
      ownershipType: 'sole',
      immediateLiquidityAccess: false,
      beneficiaryDesignation: '',
      primaryBeneficiary: '',
      contingentBeneficiary: '',
      cardholderRole: '',
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

      {/* 1-Click Financial Baseline Starters */}
      <SectionStarterBanner
        title="1-Click Financial Account Starters"
        badge="From Family Baseline to Trust Portfolio"
        description="Not sure which accounts to list or how to structure them? Select a standard financial blueprint below to generate a pre-formatted account foundation with one click, then update with your institutions:"
        starters={FINANCIAL_STARTERS}
        onApply={handleApplyStarter}
        hasExistingData={hasExistingData}
        defaultExpanded={!hasExistingData}
      />

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
                        <label className="form-label">Account Ownership Titling</label>
                        <InfoBubble
                          title={INFO_DEFINITIONS.account_titling.title}
                          explanation={INFO_DEFINITIONS.account_titling.explanation}
                          example={INFO_DEFINITIONS.account_titling.example}
                        />
                      </div>
                      <select
                        className="form-select"
                        value={acc.ownershipType || 'sole'}
                        onChange={e => {
                          const newType = e.target.value as FinancialAccount['ownershipType'];
                          onUpdateAccount(acc.id, { 
                            ownershipType: newType,
                            immediateLiquidityAccess: newType === 'jtwros' || newType === 'revocable_trust'
                          });
                        }}
                      >
                        <option value="sole">Sole Owner (Subject to bank freeze pending probate court)</option>
                        <option value="jtwros">Joint Tenants w/ Survivorship (JTWROS - Day 1 Access)</option>
                        <option value="revocable_trust">Revocable Living Trust (Trustee Day 1 Access)</option>
                        <option value="tenancy_in_common">Tenancy in Common (TIC - Share subject to probate)</option>
                        <option value="business_entity">Business Entity (LLC / Inc. Operating Agreement)</option>
                        <option value="custodial_utma">Custodial / Minor (UTMA / UGMA)</option>
                        <option value="other">Other Titling</option>
                      </select>
                      <PresetChips
                        options={ACCOUNT_TITLING_PRESETS}
                        onSelect={val => {
                          const v = val.value.toLowerCase();
                          if (v.includes('jtwros') || v.includes('joint')) {
                            onUpdateAccount(acc.id, { ownershipType: 'jtwros', immediateLiquidityAccess: true });
                          } else if (v.includes('trust')) {
                            onUpdateAccount(acc.id, { ownershipType: 'revocable_trust', immediateLiquidityAccess: true });
                          } else if (v.includes('sole')) {
                            onUpdateAccount(acc.id, { ownershipType: 'sole', immediateLiquidityAccess: false });
                          } else if (v.includes('pod') || v.includes('tod')) {
                            onUpdateAccount(acc.id, { ownershipType: 'sole', immediateLiquidityAccess: false });
                          }
                        }}
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <label className="checkbox-label" style={{ marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <input
                          type="checkbox"
                          checked={!!acc.immediateLiquidityAccess}
                          onChange={e => onUpdateAccount(acc.id, { immediateLiquidityAccess: e.target.checked })}
                          style={{ marginTop: 3 }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>
                          ⚡ <strong>Immediate Funeral & Living Liquidity:</strong> Surviving co-owner or trustee has Day 1 access to pay funeral and home bills without waiting for probate.
                        </span>
                      </label>
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
                        <label className="form-label">Primary Beneficiary (POD / TOD)</label>
                        <InfoBubble
                          title={INFO_DEFINITIONS.pod_tod_beneficiary.title}
                          explanation={INFO_DEFINITIONS.pod_tod_beneficiary.explanation}
                          example={INFO_DEFINITIONS.pod_tod_beneficiary.example}
                        />
                      </div>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Eleanor Vance (Spouse) - 100%"
                        value={acc.primaryBeneficiary || acc.beneficiaryDesignation || ''}
                        onChange={e => onUpdateAccount(acc.id, { 
                          primaryBeneficiary: e.target.value,
                          beneficiaryDesignation: e.target.value
                        })}
                      />
                      <span className="form-helper-text">Primary recipient who inherits directly upon presentation of death certificate.</span>
                    </div>

                    <div className="form-group form-grid-half">
                      <div className="label-with-info">
                        <label className="form-label">Contingent Beneficiary (Secondary)</label>
                        <InfoBubble
                          title={INFO_DEFINITIONS.contingent_beneficiary.title}
                          explanation={INFO_DEFINITIONS.contingent_beneficiary.explanation}
                          example={INFO_DEFINITIONS.contingent_beneficiary.example}
                        />
                      </div>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Children equally (50% each) or Jane Doe (Sibling)"
                        value={acc.contingentBeneficiary || ''}
                        onChange={e => onUpdateAccount(acc.id, { contingentBeneficiary: e.target.value })}
                      />
                      <span className="form-helper-text">Inherits if the primary beneficiary passes away first. Prevents probate lapse.</span>
                    </div>

                    {acc.accountType === 'Credit Card' && (
                      <div className="form-group form-grid-full" style={{ background: 'rgba(234, 179, 8, 0.08)', padding: 12, borderRadius: 6, border: '1px solid rgba(234, 179, 8, 0.25)' }}>
                        <div className="label-with-info">
                          <label className="form-label" style={{ fontWeight: 700 }}>Cardholder Role & Post-Mortem Debt Liability</label>
                          <InfoBubble
                            title={INFO_DEFINITIONS.credit_card_authorized_user.title}
                            explanation={INFO_DEFINITIONS.credit_card_authorized_user.explanation}
                            example={INFO_DEFINITIONS.credit_card_authorized_user.example}
                          />
                        </div>
                        <select
                          className="form-select"
                          value={acc.cardholderRole || ''}
                          onChange={e => onUpdateAccount(acc.id, { cardholderRole: e.target.value as FinancialAccount['cardholderRole'] })}
                        >
                          <option value="">Select Cardholder Role...</option>
                          <option value="primary">Primary Cardholder (Sole liable party; account freezes upon notification)</option>
                          <option value="joint_co_borrower">Joint Co-Borrower (Both parties legally liable for balance)</option>
                          <option value="authorized_user">Authorized User (No legal liability for debt, but card cannot be used after death)</option>
                        </select>
                        {acc.cardholderRole === 'authorized_user' && (
                          <div style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--accent-warning)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                            <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                            <span>
                              <strong>Statutory Warning:</strong> Authorized users are NOT owners of the account. Under federal credit agreements, authorized user cards must <strong>STOP being used immediately</strong> upon the primary cardholder's death. Using an authorized card after death constitutes unauthorized charges.
                            </span>
                          </div>
                        )}
                      </div>
                    )}

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
                        {acc.ownershipType === 'jtwros' && (
                          <span className="category-tag tag-complete">JTWROS (Day 1 Access)</span>
                        )}
                        {acc.ownershipType === 'revocable_trust' && (
                          <span className="category-tag tag-complete">Living Trust</span>
                        )}
                        {acc.ownershipType === 'sole' && (
                          <span className="category-tag">Sole Account</span>
                        )}
                        {acc.immediateLiquidityAccess && (
                          <span className="category-tag tag-complete" title="Provides Day 1 liquidity for mortuary and urgent bills">
                            ⚡ Day 1 Liquidity
                          </span>
                        )}
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
                        {(acc.primaryBeneficiary || acc.beneficiaryDesignation) && (
                          <div className="detail-item full-width">
                            <Shield size={14} className="detail-icon" />
                            <span><strong>Primary Beneficiary:</strong> {acc.primaryBeneficiary || acc.beneficiaryDesignation}</span>
                          </div>
                        )}
                        {acc.contingentBeneficiary && (
                          <div className="detail-item full-width">
                            <Shield size={14} className="detail-icon" />
                            <span><strong>Contingent Beneficiary:</strong> {acc.contingentBeneficiary}</span>
                          </div>
                        )}
                        {acc.cardholderRole && (
                          <div className="detail-item">
                            <AlertTriangle size={14} className="detail-icon" />
                            <span><strong>Cardholder Role:</strong> {acc.cardholderRole === 'authorized_user' ? 'Authorized User (Stop use at death)' : acc.cardholderRole === 'joint_co_borrower' ? 'Joint Co-Borrower' : 'Primary Account Holder'}</span>
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
