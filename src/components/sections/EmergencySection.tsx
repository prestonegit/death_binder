import React from 'react';
import { Phone, Key, Heart, ShieldAlert } from 'lucide-react';
import type { EmergencyPlan } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { PrivacyField } from '../common/PrivacyField';
import { InfoBubble } from '../common/InfoBubble';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';
import { SectionStarterBanner } from '../common/SectionStarterBanner';
import { EMERGENCY_STARTERS, type SectionStarterArchetype } from '../../data/sectionStarters';

interface EmergencySectionProps {
  plan: EmergencyPlan;
  isPrivacyMasked: boolean;
  isNotApplicable?: boolean;
  onUpdate: (updated: Partial<EmergencyPlan>) => void;
  onToggleNA: (isNA: boolean) => void;
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({
  plan,
  isPrivacyMasked,
  isNotApplicable = false,
  onUpdate,
  onToggleNA
}) => {
  const hasExistingData = Boolean(
    plan.medicalDecisionMakerContact ||
    plan.primaryEmergencyContact ||
    plan.primaryExecutorContact ||
    plan.originalWillLocation ||
    plan.immediateCashBufferLocation
  );

  const handleApplyStarter = (
    starter: SectionStarterArchetype<Partial<EmergencyPlan>>,
    mode: 'fill_empty' | 'replace'
  ) => {
    if (mode === 'replace') {
      onUpdate({ ...starter.data });
    } else {
      const merged: Partial<EmergencyPlan> = {};
      const starterData = starter.data;
      (Object.keys(starterData) as Array<keyof EmergencyPlan>).forEach(key => {
        if (!plan[key] && starterData[key]) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (merged as any)[key] = starterData[key];
        }
      });
      onUpdate(merged);
    }
  };
  return (
    <div className="section-content-container">
      <SectionHeader
        title="First 48-Hour Emergency Action Plan"
        description="The highest-priority summary for your family, executor, or doctor immediately upon an emergency, medical crisis, or passing."
        isNotApplicable={isNotApplicable}
        isComplete={!!(plan.medicalDecisionMakerContact || plan.primaryEmergencyContact) && !!plan.originalWillLocation}
        onToggleNotApplicable={onToggleNA}
      />

      <GuidanceTip type="legal-warning" title="Critical Protection: Never Pay Debts from Personal Money">
        <strong>Important Advice for Family:</strong> Loved ones often panic and pay credit cards, mortgages, or hospital bills from their own personal bank accounts. Surviving family members are generally <em>not</em> personally responsible for debts of the deceased (unless you are a joint co-borrower/co-signer or subject to statutory spousal medical liability laws). Debts must be settled by the estate during probate.
      </GuidanceTip>

      {/* Active Hospice Crisis Banner if enrolled */}
      {plan.isHospiceEnrolled && (
        <div className="hospice-emergency-callout" style={{ marginBottom: 20 }}>
          <div className="hospice-callout-header">
            <ShieldAlert size={22} />
            <span>CRITICAL HOSPICE PROTOCOL: DO NOT CALL 911</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#991b1b', lineHeight: 1.4 }}>
            Calling 911 triggers mandatory resuscitation, intubation, and emergency transport. In any breathing distress, pain crisis, or at the moment of passing, call the 24/7 Hospice Nurse Hotline directly.
          </p>
          {plan.hospice24hTriageNumber ? (
            <div className="hospice-phone-box">
              📞 24/7 Hospice Dispatch: {plan.hospice24hTriageNumber}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#991b1b', fontStyle: 'italic', margin: '4px 0' }}>
              ⚠️ Please record the 24/7 Hospice Nurse Dispatch number below so family does not call 911 in panic.
            </p>
          )}
          {plan.hospiceComfortKitLocation && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: 4 }}>
              <strong>Emergency Comfort Kit (E-Kit) Location:</strong> {plan.hospiceComfortKitLocation}
            </div>
          )}
          {plan.outOfHospitalDnrLocation && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: 2 }}>
              <strong>Out-of-Hospital DNR / POLST Location:</strong> {plan.outOfHospitalDnrLocation}
            </div>
          )}
        </div>
      )}

      {/* 1-Click Emergency Hub Starters */}
      <SectionStarterBanner
        title="1-Click Emergency Plan Starters"
        badge="Spouse, Adult Child, or Solo Ager"
        description="Crisis logistics require swift coordination during the first 48 hours. Select a common emergency setup below to populate key roles, safe locations, cash buffers, and critical instructions in one click:"
        starters={EMERGENCY_STARTERS}
        onApply={handleApplyStarter}
        hasExistingData={hasExistingData}
        defaultExpanded={!hasExistingData}
      />

      {/* 1. Immediate Phone Calls */}
      <div className="form-card glass-panel">
        <div className="form-section-title">
          <Phone size={18} />
          <h3>1. Immediate Contacts & First Phone Calls</h3>
          <InfoBubble
            title={INFO_DEFINITIONS.poa_vs_executor.title}
            explanation={INFO_DEFINITIONS.poa_vs_executor.explanation}
            example={INFO_DEFINITIONS.poa_vs_executor.example}
          />
        </div>

        <div className="form-grid">
          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Pre-Death Medical Decision Maker (Healthcare Proxy)</label>
              <InfoBubble
                title="Pre-Death Healthcare Decision Maker"
                explanation="The person legally authorized to make medical, life-support, and comfort care decisions while you are alive if you become incapacitated. Powers expire instantly at death."
                example="e.g. Eleanor Vance (Spouse) — Mobile: (555) 019-2831"
              />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Eleanor Vance (Spouse) — (555) 019-2831"
              value={plan.medicalDecisionMakerContact || plan.primaryEmergencyContact}
              onChange={e => onUpdate({ 
                medicalDecisionMakerContact: e.target.value,
                primaryEmergencyContact: e.target.value
              })}
            />
            <span className="form-helper-text">Authorized for medical choices while alive.</span>
          </div>

          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Post-Death Estate Executor / Legal Representative</label>
              <InfoBubble
                title="Post-Death Estate Executor"
                explanation="The representative named in your Will who takes legal charge AFTER passing to handle mortuary arrangements, estate assets, and probate."
                example="e.g. Thomas Sterling (Brother / Executor) — (555) 948-2041"
              />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Thomas Sterling (Executor) — (555) 948-2041"
              value={plan.primaryExecutorContact || ''}
              onChange={e => onUpdate({ primaryExecutorContact: e.target.value })}
            />
            <span className="form-helper-text">Takes legal charge of affairs after death.</span>
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Secondary / Backup Emergency Contact</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Sarah Vance (Daughter) — (555) 234-5678"
              value={plan.secondaryEmergencyContact}
              onChange={e => onUpdate({ secondaryEmergencyContact: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Primary Physician / Medical Clinic</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dr. Sarah Jenkins (Mercy Clinic) — (555) 441-2390"
              value={plan.hospiceOrDoctorContact}
              onChange={e => onUpdate({ hospiceOrDoctorContact: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-third">
            <label className="form-label">Preferred Funeral Home / Mortuary</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Maplewood Memorial Chapel — (555) 882-9900"
              value={plan.funeralHomePreference}
              onChange={e => onUpdate({ funeralHomePreference: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-third">
            <label className="form-label">Pre-Need Funeral Contract / Ref #</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Contract #MN-8842-P (Pre-funded trust)"
              value={plan.funeralContractNumberOrRef || ''}
              onChange={e => onUpdate({ funeralContractNumberOrRef: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-third">
            <label className="form-label">Funeral Funding Method</label>
            <select
              className="form-select"
              value={plan.funeralFundingMethod || ''}
              onChange={e => onUpdate({ funeralFundingMethod: e.target.value as EmergencyPlan['funeralFundingMethod'] })}
            >
              <option value="">Select funding plan...</option>
              <option value="prepaid_contract">100% Pre-Paid Funeral Contract / Trust</option>
              <option value="joint_account">Joint Bank Account (Day 1 Access)</option>
              <option value="life_insurance_assignment">Life Insurance Funeral Assignment</option>
              <option value="safe_cash">Emergency Cash Buffer in Home Safe</option>
              <option value="family_advancement">Family Out-of-Pocket (Estate Reimbursement)</option>
              <option value="other">Other Funding Arrangement</option>
            </select>
          </div>

          {/* Hospice Protocol Configuration */}
          <div className="form-group form-grid-full" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, marginTop: 8 }}>
            <div className="disclosure-toggle-row">
              <label className="checkbox-label" style={{ fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={!!plan.isHospiceEnrolled}
                  onChange={e => onUpdate({ isHospiceEnrolled: e.target.checked })}
                />
                <span>Individual is actively enrolled in Home Hospice or Palliative Care</span>
              </label>
            </div>

            {plan.isHospiceEnrolled && (
              <div className="form-grid" style={{ marginTop: 12 }}>
                <div className="form-group form-grid-third">
                  <label className="form-label" style={{ color: '#991b1b', fontWeight: 700 }}>24/7 Hospice Emergency Hotline</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. (555) 800-4499 (24/7 Nurse Triage)"
                    value={plan.hospice24hTriageNumber || ''}
                    onChange={e => onUpdate({ hospice24hTriageNumber: e.target.value })}
                  />
                  <span className="form-helper-text">Direct line to bypass 911 in breathing distress or passing.</span>
                </div>

                <div className="form-group form-grid-third">
                  <label className="form-label">Hospice Comfort Kit (E-Kit) Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Top shelf of kitchen refrigerator"
                    value={plan.hospiceComfortKitLocation || ''}
                    onChange={e => onUpdate({ hospiceComfortKitLocation: e.target.value })}
                  />
                  <span className="form-helper-text">Location of prescribed comfort medications (morphine/lorazepam).</span>
                </div>

                <div className="form-group form-grid-third">
                  <label className="form-label">Out-of-Hospital DNR / POLST Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Magnetized to front of refrigerator"
                    value={plan.outOfHospitalDnrLocation || ''}
                    onChange={e => onUpdate({ outOfHospitalDnrLocation: e.target.value })}
                  />
                  <span className="form-helper-text">Must be physical paper for emergency responders.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Physical Access & Will Location */}
      <div className="form-card glass-panel" style={{ marginTop: '24px' }}>
        <div className="form-section-title">
          <Key size={18} />
          <h3>2. Critical Physical Access & Document Locations</h3>
          <InfoBubble
            title={INFO_DEFINITIONS.original_will.title}
            explanation={INFO_DEFINITIONS.original_will.explanation}
            example={INFO_DEFINITIONS.original_will.example}
          />
        </div>

        <div className="form-grid">
          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Exact Location of Original Signed Will</label>
              <InfoBubble
                title="Why exact physical location matters"
                explanation="Probate courts need the physical paper with original ink signatures and notary stamps. Storing it in a known fireproof safe or with your attorney prevents weeks of searching."
              />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Fireproof safe in master closet, top shelf. Key is taped under desk."
              value={plan.originalWillLocation}
              onChange={e => onUpdate({ originalWillLocation: e.target.value })}
            />
            <span className="form-helper-text">Probate courts require the physical original signed document with ink seal.</span>
          </div>

          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Day 1 Funeral & Living Cash Buffer ($5k–$15k)</label>
              <InfoBubble
                title={INFO_DEFINITIONS.funeral_liquidity_buffer.title}
                explanation={INFO_DEFINITIONS.funeral_liquidity_buffer.explanation}
                example={INFO_DEFINITIONS.funeral_liquidity_buffer.example}
              />
            </div>
            <PrivacyField
              placeholder="e.g. $8,000 cash in master bedroom fire safe envelope labeled 'Emergency Liquidity'"
              value={plan.immediateCashBufferLocation || ''}
              isMaskedGlobal={isPrivacyMasked}
              onChange={val => onUpdate({ immediateCashBufferLocation: val })}
              helperText="Funds for mortuary deposit & mortgage while sole bank accounts are frozen."
            />
          </div>

          <div className="form-group form-grid-full">
            <div className="label-with-info">
              <label className="form-label">House Keys, Door Keypad & Safe Access Combinations</label>
              <InfoBubble
                title="Keep Entry Codes Clear"
                explanation="List door keypad pin codes, garage codes, and safe combinations so your family can enter the home without calling a locksmith."
              />
            </div>
            <PrivacyField
              type="textarea"
              rows={3}
              placeholder="e.g. Front door keypad code: 4921#. Fire safe combination: 18-92-04. Alarm code: 1104."
              value={plan.immediateAccessCodes}
              isMaskedGlobal={isPrivacyMasked}
              onChange={val => onUpdate({ immediateAccessCodes: val })}
              helperText="Shielded by Privacy Mask. Click 'Peek' to reveal while editing."
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Immediate Pet & Dependent Instructions</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="e.g. Golden Retriever 'Bailey' requires daily insulin (fridge door). Neighbor Mark (555-1234) has spare key to feed pets immediately."
              value={plan.immediatePetCare}
              onChange={e => onUpdate({ immediatePetCare: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 3. Urgent Wishes & Standing Notes */}
      <div className="form-card glass-panel" style={{ marginTop: '24px' }}>
        <div className="form-section-title">
          <Heart size={18} />
          <h3>3. Urgent Directives & Family Instructions</h3>
          <InfoBubble
            title={INFO_DEFINITIONS.organ_donation.title}
            explanation={INFO_DEFINITIONS.organ_donation.explanation}
            example={INFO_DEFINITIONS.organ_donation.example}
          />
        </div>

        <div className="form-grid">
          <div className="form-group form-grid-full">
            <div className="label-with-info">
              <label className="form-label">Organ & Tissue Donation Directives</label>
              <InfoBubble
                title={INFO_DEFINITIONS.organ_donation.title}
                explanation={INFO_DEFINITIONS.organ_donation.explanation}
              />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Registered organ donor. Immediate tissue donation authorized. Direct cremation preferred."
              value={plan.organDonationUrgentNote}
              onChange={e => onUpdate({ organDonationUrgentNote: e.target.value })}
            />
            <span className="form-helper-text">Organ donation decisions must be acted upon within hours of passing.</span>
          </div>

          <div className="form-group form-grid-full">
            <div className="label-with-info">
              <label className="form-label">Critical Family Guidance & Protective Notes</label>
              <InfoBubble
                title={INFO_DEFINITIONS.estate_debts.title}
                explanation={INFO_DEFINITIONS.estate_debts.explanation}
                example={INFO_DEFINITIONS.estate_debts.example}
              />
            </div>
            <textarea
              className="form-input"
              rows={3}
              placeholder="e.g. Please order 10-15 certified copies of the death certificate immediately for bank and title transfers. Do not pay debts from personal money."
              value={plan.criticalNotes}
              onChange={e => onUpdate({ criticalNotes: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
