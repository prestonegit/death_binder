import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, ShieldCheck, Phone } from 'lucide-react';
import type { InsurancePolicy } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { PrivacyField } from '../common/PrivacyField';
import { InfoBubble } from '../common/InfoBubble';
import { PresetChips, type PresetOption } from '../common/PresetChips';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';

interface InsuranceSectionProps {
  policies: InsurancePolicy[];
  isPrivacyMasked: boolean;
  isNotApplicable?: boolean;
  onAddPolicy: (policy: InsurancePolicy) => void;
  onUpdatePolicy: (id: string, updated: Partial<InsurancePolicy>) => void;
  onDeletePolicy: (id: string) => void;
  onToggleNA: (isNA: boolean) => void;
}

const POLICY_TYPES = [
  { value: 'life', label: 'Life Insurance (Term / Whole / Universal)' },
  { value: 'health', label: 'Health Insurance & Medicare' },
  { value: 'homeowners', label: 'Homeowners / Renters Insurance' },
  { value: 'auto', label: 'Automobile Insurance' },
  { value: 'umbrella', label: 'Excess Liability / Umbrella Policy' },
  { value: 'disability', label: 'Disability Insurance (Short/Long Term)' },
  { value: 'long_term_care', label: 'Long-Term Care Insurance' },
  { value: 'other', label: 'Other Insurance Policy' }
];

const INSURER_PRESETS: PresetOption[] = [
  { label: 'Northwestern Mutual', value: 'Northwestern Mutual', category: 'life' },
  { label: 'State Farm', value: 'State Farm', category: 'homeowners' },
  { label: 'Geico', value: 'Geico', category: 'auto' },
  { label: 'MetLife', value: 'MetLife', category: 'life' },
  { label: 'New York Life', value: 'New York Life', category: 'life' },
  { label: 'Prudential', value: 'Prudential Financial', category: 'life' },
  { label: 'Blue Cross Blue Shield', value: 'Blue Cross Blue Shield', category: 'health' }
];

export const InsuranceSection: React.FC<InsuranceSectionProps> = ({
  policies,
  isPrivacyMasked,
  isNotApplicable = false,
  onAddPolicy,
  onUpdatePolicy,
  onDeletePolicy,
  onToggleNA
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleAddNew = (preset?: PresetOption) => {
    const newId = `i_${Date.now()}`;
    const newPolicy: InsurancePolicy = {
      id: newId,
      policyType: (preset?.category as InsurancePolicy['policyType']) || 'life',
      provider: preset?.value || '',
      policyNumber: '',
      coverageAmount: '',
      beneficiaries: '',
      contactNumber: '',
      agentContact: '',
      notes: ''
    };
    onAddPolicy(newPolicy);
    setEditingId(newId);
  };

  return (
    <div className="section-content-container">
      <SectionHeader
        title="Insurance Policies & Beneficiaries"
        description="Life, health, disability, home, and auto insurance policies to facilitate rapid claim filings and protect property."
        isNotApplicable={isNotApplicable}
        isComplete={policies.length > 0}
        onToggleNotApplicable={onToggleNA}
        actionButton={
          <button type="button" className="btn btn-primary" onClick={() => handleAddNew()}>
            <Plus size={16} /> Add Insurance Policy
          </button>
        }
      />

      <GuidanceTip type="info" title="Life Insurance Payout Speed">
        Life insurance policy proceeds are paid directly to named beneficiaries and <strong>bypass probate court entirely</strong>. Claims are typically paid within 10 to 30 days of submitting an official death certificate.
      </GuidanceTip>

      {/* Quick-Add Presets */}
      <div className="quick-presets-wrapper no-print">
        <PresetChips
          title="Quick-Add common insurance providers:"
          options={INSURER_PRESETS}
          onSelect={(preset) => handleAddNew(preset)}
        />
      </div>

      <div className="list-stack">
        {policies.length === 0 ? (
          <div className="empty-state-card glass-panel">
            <ShieldCheck size={32} className="empty-icon" />
            <p>No insurance policies recorded yet.</p>
            <button type="button" className="btn btn-secondary" onClick={() => handleAddNew()}>
              <Plus size={14} /> Add Life, Auto or Home Policy
            </button>
          </div>
        ) : (
          policies.map(pol => {
            const isEditing = editingId === pol.id;

            return (
              <div key={pol.id} className="list-item-card glass-panel">
                {isEditing ? (
                  <div className="edit-form-grid">
                    <div className="form-group form-grid-half">
                      <label className="form-label">Insurance Provider / Carrier</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Northwestern Mutual, State Farm, MetLife"
                        value={pol.provider}
                        onChange={e => onUpdatePolicy(pol.id, { provider: e.target.value })}
                        autoFocus
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <label className="form-label">Policy Type</label>
                      <select
                        className="form-select"
                        value={pol.policyType}
                        onChange={e => onUpdatePolicy(pol.id, { policyType: e.target.value as InsurancePolicy['policyType'] })}
                      >
                        {POLICY_TYPES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group form-grid-half">
                      <PrivacyField
                        label="Policy Identifier / Number"
                        placeholder="e.g. Pol #LM-98214"
                        value={pol.policyNumber}
                        isMaskedGlobal={isPrivacyMasked}
                        onChange={val => onUpdatePolicy(pol.id, { policyNumber: val })}
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <div className="label-with-info">
                        <label className="form-label">Named Beneficiary (Who receives payout?)</label>
                        <InfoBubble
                          title={INFO_DEFINITIONS.pod_beneficiary.title}
                          explanation={INFO_DEFINITIONS.pod_beneficiary.explanation}
                          example={INFO_DEFINITIONS.pod_beneficiary.example}
                        />
                      </div>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Eleanor Vance (100% Primary)"
                        value={pol.beneficiaries}
                        onChange={e => onUpdatePolicy(pol.id, { beneficiaries: e.target.value })}
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <PrivacyField
                        label="Coverage Amount / Death Benefit"
                        placeholder="e.g. $500,000"
                        value={pol.coverageAmount}
                        isMaskedGlobal={isPrivacyMasked}
                        onChange={val => onUpdatePolicy(pol.id, { coverageAmount: val })}
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <label className="form-label">Agent Contact or Claims Phone Number</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Agent Dave (555) 391-4921 / 1-800-555-0199"
                        value={pol.agentContact || pol.contactNumber}
                        onChange={e => onUpdatePolicy(pol.id, { agentContact: e.target.value, contactNumber: e.target.value })}
                      />
                    </div>

                    <div className="form-group form-grid-full">
                      <label className="form-label">Location of Physical Policy & Documents</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Green accordion folder in office filing cabinet / Policy certificate in safe."
                        value={pol.notes}
                        onChange={e => onUpdatePolicy(pol.id, { notes: e.target.value })}
                      />
                    </div>

                    <div className="edit-actions-row form-grid-full">
                      <button
                        type="button"
                        className="btn btn-secondary danger-btn"
                        onClick={() => {
                          onDeletePolicy(pol.id);
                          setEditingId(null);
                        }}
                      >
                        <Trash2 size={14} /> Remove Policy
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setEditingId(null)}
                      >
                        <Check size={14} /> Save Policy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-card-content">
                    <div className="display-card-header">
                      <div className="display-title-group">
                        <h4>{pol.provider || <span className="unnamed-placeholder">Unnamed Carrier</span>}</h4>
                        <span className="role-tag">
                          {POLICY_TYPES.find(t => t.value === pol.policyType)?.label.split(' ')[0] || pol.policyType}
                        </span>
                        {pol.coverageAmount && (
                          <span className="identifier-tag">
                            {isPrivacyMasked ? '••••••••' : pol.coverageAmount}
                          </span>
                        )}
                      </div>
                      <div className="card-actions">
                        {confirmDeleteId === pol.id ? (
                          <div className="inline-delete-confirm">
                            <span className="delete-prompt-text">Delete?</span>
                            <button
                              type="button"
                              className="btn-action-sm danger"
                              onClick={() => {
                                onDeletePolicy(pol.id);
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
                              onClick={() => setEditingId(pol.id)}
                            >
                              <Edit3 size={14} /> <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="btn-action-sm danger"
                              onClick={() => setConfirmDeleteId(pol.id)}
                            >
                              <Trash2 size={14} /> <span>Remove</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="display-card-body">
                      <div className="contact-details-grid">
                        {pol.beneficiaries && (
                          <div className="detail-item">
                            <ShieldCheck size={14} className="detail-icon" />
                            <span><strong>Beneficiary:</strong> {pol.beneficiaries}</span>
                          </div>
                        )}
                        {(pol.agentContact || pol.contactNumber) && (
                          <div className="detail-item">
                            <Phone size={14} className="detail-icon" />
                            <span>Claims / Agent: {pol.agentContact || pol.contactNumber}</span>
                          </div>
                        )}
                      </div>

                      {pol.notes && (
                        <p className="item-notes-text">{pol.notes}</p>
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
