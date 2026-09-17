import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, Calendar, CreditCard, Layers } from 'lucide-react';
import type { RecurringPayment } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { PrivacyField } from '../common/PrivacyField';
import { InfoBubble } from '../common/InfoBubble';
import { PresetChips, type PresetOption } from '../common/PresetChips';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';
import { CONTINUITY_ACTION_PRESETS } from '../../data/philosophyPresets';
import { SectionStarterBanner } from '../common/SectionStarterBanner';
import { RECURRING_STARTERS, type SectionStarterArchetype } from '../../data/sectionStarters';

interface RecurringSectionProps {
  payments: RecurringPayment[];
  isPrivacyMasked: boolean;
  isNotApplicable?: boolean;
  onAddPayment: (payment: RecurringPayment) => void;
  onSetPayments?: (payments: RecurringPayment[]) => void;
  onUpdatePayment: (id: string, updated: Partial<RecurringPayment>) => void;
  onDeletePayment: (id: string) => void;
  onToggleNA: (isNA: boolean) => void;
}

const CATEGORIES = [
  { value: 'utility', label: 'Utility (Electric, Water, Gas, Internet)' },
  { value: 'subscription', label: 'Digital Subscription (Netflix, Spotify, Cloud Storage)' },
  { value: 'loan_debt', label: 'Loan / Mortgage / Debt Payment' },
  { value: 'insurance_premium', label: 'Insurance Premium' },
  { value: 'membership', label: 'Membership (Gym, Club, HOA Dues)' },
  { value: 'other', label: 'Other Recurring Bill' }
];

const BILL_PRESETS: PresetOption[] = [
  { label: 'Electric / Power', value: 'Electric Utility (Power)', category: 'utility', notes: 'Keep active until house is sold' },
  { label: 'Home WiFi / Internet', value: 'Home Internet & WiFi', category: 'utility' },
  { label: 'Cell Phone Plan', value: 'Primary Mobile Phone Carrier', category: 'utility', notes: '⚠️ KEEP LINE ACTIVE FOR 6 MONTHS FOR 2FA CODES' },
  { label: 'Water & Sewer', value: 'City Water & Sewer Utility', category: 'utility' },
  { label: 'Natural Gas / Heat', value: 'Natural Gas Utility', category: 'utility' },
  { label: 'Netflix', value: 'Netflix Streaming', category: 'subscription', billingCycle: 'monthly' },
  { label: 'Auto Loan / Lease', value: 'Automobile Financing / Loan', category: 'loan_debt' },
  { label: 'HOA Dues', value: 'Homeowners Association (HOA) Dues', category: 'membership' }
];

export const RecurringSection: React.FC<RecurringSectionProps> = ({
  payments,
  isPrivacyMasked,
  isNotApplicable = false,
  onAddPayment,
  onSetPayments,
  onUpdatePayment,
  onDeletePayment,
  onToggleNA
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const hasExistingData = payments.length > 0;

  const handleApplyStarter = (
    starter: SectionStarterArchetype<RecurringPayment[]>,
    mode: 'fill_empty' | 'replace'
  ) => {
    const freshPayments = starter.data.map((pay, index) => ({
      ...pay,
      id: `r_${Date.now()}_${index}`
    }));

    if (mode === 'replace' || !hasExistingData) {
      if (onSetPayments) {
        onSetPayments(freshPayments);
      } else {
        freshPayments.forEach(pay => onAddPayment(pay));
      }
    } else {
      if (onSetPayments) {
        onSetPayments([...payments, ...freshPayments]);
      } else {
        freshPayments.forEach(pay => onAddPayment(pay));
      }
    }
  };

  const handleAddNew = (preset?: PresetOption) => {
    const newId = `r_${Date.now()}`;
    const newPayment: RecurringPayment = {
      id: newId,
      name: preset?.value || '',
      category: (preset?.category as RecurringPayment['category']) || 'utility',
      estimatedAmount: '',
      billingCycle: 'monthly',
      autoPaySource: '',
      actionOnDeath: preset?.category === 'utility' ? 'must_maintain' : 'cancel_immediately',
      cancellationInstructions: '',
      notes: preset?.notes || ''
    };
    onAddPayment(newPayment);
    setEditingId(newId);
  };

  return (
    <div className="section-content-container">
      <SectionHeader
        title="Recurring Bills & Subscriptions"
        description="Auto-pay utilities, subscriptions, and loans so your executor can immediately stop wasteful drain on your estate."
        isNotApplicable={isNotApplicable}
        isComplete={payments.length > 0}
        onToggleNotApplicable={onToggleNA}
        actionButton={
          <button type="button" className="btn btn-primary" onClick={() => handleAddNew()}>
            <Plus size={16} /> Add Recurring Bill
          </button>
        }
      />

      <GuidanceTip type="legal-warning" title="Critical Warning: Never Cancel the Mobile Phone Line Immediately">
        <strong>The 2FA Phone Lockout Trap:</strong> Grieving families often cancel the decedent's cell phone line to stop monthly charges. <em>Do not do this.</em> All banks, Google, Apple ID, and email recovery portals send SMS verification codes to that phone. Keep the line active for at least 6 months.
      </GuidanceTip>

      {/* 1-Click Household & Bill Continuity Starters */}
      <SectionStarterBanner
        title="1-Click Bill & Continuity Starters"
        badge="Homeowner vs. Renter Baseline"
        description="Knowing which bills must be kept active versus cancelled immediately is vital for executors. Select a living situation below to generate a pre-tagged checklist in one click:"
        starters={RECURRING_STARTERS}
        onApply={handleApplyStarter}
        hasExistingData={hasExistingData}
        defaultExpanded={!hasExistingData}
      />

      {/* Quick-Add Presets */}
      <div className="quick-presets-wrapper no-print">
        <PresetChips
          title="Quick-Add common bills to monitor or stop:"
          options={BILL_PRESETS}
          onSelect={(preset) => handleAddNew(preset)}
        />
      </div>

      <div className="list-stack">
        {payments.length === 0 ? (
          <div className="empty-state-card glass-panel">
            <Layers size={32} className="empty-icon" />
            <p>No recurring payments or bills listed yet.</p>
            <button type="button" className="btn btn-secondary" onClick={() => handleAddNew()}>
              <Plus size={14} /> Add Electric, Internet or Mobile Bill
            </button>
          </div>
        ) : (
          payments.map(pay => {
            const isEditing = editingId === pay.id;

            return (
              <div key={pay.id} className="list-item-card glass-panel">
                {isEditing ? (
                  <div className="edit-form-grid">
                    <div className="form-group form-grid-half">
                      <div className="label-with-info">
                        <label className="form-label">Service or Payee Name</label>
                        <InfoBubble
                          title={INFO_DEFINITIONS.recurring_stoppage.title}
                          explanation={INFO_DEFINITIONS.recurring_stoppage.explanation}
                          example={INFO_DEFINITIONS.recurring_stoppage.example}
                        />
                      </div>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Electric Company (ConEd), Netflix, Cell Phone"
                        value={pay.name}
                        onChange={e => onUpdatePayment(pay.id, { name: e.target.value })}
                        autoFocus
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={pay.category}
                        onChange={e => onUpdatePayment(pay.id, { category: e.target.value as RecurringPayment['category'] })}
                      >
                        {CATEGORIES.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group form-grid-third">
                      <PrivacyField
                        label="Estimated Amount"
                        placeholder="e.g. $140 / mo"
                        value={pay.estimatedAmount}
                        isMaskedGlobal={isPrivacyMasked}
                        onChange={val => onUpdatePayment(pay.id, { estimatedAmount: val })}
                      />
                    </div>

                    <div className="form-group form-grid-third">
                      <label className="form-label">Billing Cycle</label>
                      <select
                        className="form-select"
                        value={pay.billingCycle}
                        onChange={e => onUpdatePayment(pay.id, { billingCycle: e.target.value as RecurringPayment['billingCycle'] })}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="other">Other / Irregular</option>
                      </select>
                    </div>

                    <div className="form-group form-grid-third">
                      <label className="form-label">Payment Method / Source</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Auto-debit from Chase Checking (...4819)"
                        value={pay.autoPaySource}
                        onChange={e => onUpdatePayment(pay.id, { autoPaySource: e.target.value })}
                      />
                    </div>

                    <div className="form-group form-grid-full">
                      <label className="form-label" style={{ fontWeight: 700 }}>Continuity Action for Executor Upon Death</label>
                      <select
                        className="form-select"
                        value={pay.actionOnDeath || ''}
                        onChange={e => onUpdatePayment(pay.id, { actionOnDeath: e.target.value as RecurringPayment['actionOnDeath'] })}
                      >
                        <option value="">Select Action for Executor...</option>
                        <option value="must_maintain">🟢 CRITICAL: Must Maintain (Heat, Power, Water, Insurance, Mortgage, 2FA Phone)</option>
                        <option value="cancel_immediately">🛑 CANCEL: Cancel Immediately (Streaming, Gym, Non-essential subscriptions)</option>
                        <option value="review_with_counsel">⚖️ REVIEW: Review with Estate Attorney before paying or canceling</option>
                        <option value="claim_against_estate">📄 PROBATE: Unsecured debt (Do NOT pay from personal funds; file claim with estate)</option>
                      </select>
                      <PresetChips
                        options={CONTINUITY_ACTION_PRESETS}
                        onSelect={val => {
                          const v = val.value.toLowerCase();
                          if (v.includes('maintain') || v.includes('keep active')) {
                            onUpdatePayment(pay.id, { actionOnDeath: 'must_maintain' });
                          } else if (v.includes('cancel') || v.includes('terminate')) {
                            onUpdatePayment(pay.id, { actionOnDeath: 'cancel_immediately' });
                          } else if (v.includes('probate') || v.includes('settle')) {
                            onUpdatePayment(pay.id, { actionOnDeath: 'claim_against_estate' });
                          } else if (v.includes('review')) {
                            onUpdatePayment(pay.id, { actionOnDeath: 'review_with_counsel' });
                          }
                        }}
                      />
                    </div>

                    <div className="form-group form-grid-full">
                      <label className="form-label">How to Cancel / Instructions for Executor</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Call customer service with account number / Cancel via website profile settings."
                        value={pay.cancellationInstructions}
                        onChange={e => onUpdatePayment(pay.id, { cancellationInstructions: e.target.value })}
                      />
                    </div>

                    <div className="form-group form-grid-full">
                      <label className="form-label">Notes & Status</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Keep power active until house is sold; cancel streaming immediately."
                        value={pay.notes}
                        onChange={e => onUpdatePayment(pay.id, { notes: e.target.value })}
                      />
                    </div>

                    <div className="edit-actions-row form-grid-full">
                      <button
                        type="button"
                        className="btn btn-secondary danger-btn"
                        onClick={() => {
                          onDeletePayment(pay.id);
                          setEditingId(null);
                        }}
                      >
                        <Trash2 size={14} /> Remove Bill
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setEditingId(null)}
                      >
                        <Check size={14} /> Save Bill
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-card-content">
                    <div className="display-card-header">
                      <div className="display-title-group">
                        <h4>{pay.name || <span className="unnamed-placeholder">Unnamed Bill</span>}</h4>
                        <span className="role-tag">
                          {CATEGORIES.find(c => c.value === pay.category)?.label.split(' ')[0] || pay.category}
                        </span>
                        {pay.actionOnDeath === 'must_maintain' && (
                          <span className="category-tag tag-complete" style={{ fontWeight: 700 }}>
                            🟢 Must Maintain
                          </span>
                        )}
                        {pay.actionOnDeath === 'cancel_immediately' && (
                          <span className="category-tag" style={{ background: 'rgba(220, 38, 38, 0.1)', color: 'var(--accent-danger)', borderColor: 'rgba(220, 38, 38, 0.25)', fontWeight: 700 }}>
                            🛑 Cancel Immediately
                          </span>
                        )}
                        {pay.actionOnDeath === 'review_with_counsel' && (
                          <span className="category-tag" style={{ background: 'rgba(234, 179, 8, 0.1)', color: 'var(--accent-warning)', borderColor: 'rgba(234, 179, 8, 0.25)', fontWeight: 700 }}>
                            ⚖️ Review with Counsel
                          </span>
                        )}
                        {pay.actionOnDeath === 'claim_against_estate' && (
                          <span className="category-tag" style={{ background: 'rgba(100, 116, 139, 0.1)', color: 'var(--text-secondary)', borderColor: 'rgba(100, 116, 139, 0.25)', fontWeight: 700 }}>
                            📄 Settle via Estate
                          </span>
                        )}
                        {pay.estimatedAmount && (
                          <span className="identifier-tag">
                            {isPrivacyMasked ? '••••' : pay.estimatedAmount} ({pay.billingCycle})
                          </span>
                        )}
                      </div>
                      <div className="card-actions">
                        {confirmDeleteId === pay.id ? (
                          <div className="inline-delete-confirm">
                            <span className="delete-prompt-text">Delete?</span>
                            <button
                              type="button"
                              className="btn-action-sm danger"
                              onClick={() => {
                                onDeletePayment(pay.id);
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
                              onClick={() => setEditingId(pay.id)}
                            >
                              <Edit3 size={14} /> <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="btn-action-sm danger"
                              onClick={() => setConfirmDeleteId(pay.id)}
                            >
                              <Trash2 size={14} /> <span>Remove</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="display-card-body">
                      <div className="contact-details-grid">
                        {pay.autoPaySource && (
                          <div className="detail-item">
                            <CreditCard size={14} className="detail-icon" />
                            <span>Paid via: {pay.autoPaySource}</span>
                          </div>
                        )}
                        {pay.billingCycle && (
                          <div className="detail-item">
                            <Calendar size={14} className="detail-icon" />
                            <span>Cycle: {pay.billingCycle}</span>
                          </div>
                        )}
                        {pay.cancellationInstructions && (
                          <div className="detail-item full-width">
                            <span><strong>How to cancel:</strong> {pay.cancellationInstructions}</span>
                          </div>
                        )}
                      </div>

                      {pay.notes && (
                        <p className="item-notes-text">{pay.notes}</p>
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
