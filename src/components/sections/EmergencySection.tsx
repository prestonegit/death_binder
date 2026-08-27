import React from 'react';
import { Phone, Key, Heart } from 'lucide-react';
import type { EmergencyPlan } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { PrivacyField } from '../common/PrivacyField';
import { InfoBubble } from '../common/InfoBubble';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';

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
  return (
    <div className="section-content-container">
      <SectionHeader
        title="First 48-Hour Emergency Action Plan"
        description="The highest-priority summary for your family, executor, or doctor immediately upon an emergency, medical crisis, or passing."
        isNotApplicable={isNotApplicable}
        isComplete={!!plan.primaryEmergencyContact && !!plan.originalWillLocation}
        onToggleNotApplicable={onToggleNA}
      />

      <GuidanceTip type="legal-warning" title="Critical Protection: Never Pay Debts from Personal Money">
        <strong>Important Advice for Family:</strong> Loved ones often panic and pay credit cards, mortgages, or hospital bills from their own personal bank accounts. Surviving family members are generally <em>not</em> personally responsible for debts of the deceased (unless you are a joint co-borrower/co-signer or subject to statutory spousal medical liability laws). Debts must be settled by the estate during probate.
      </GuidanceTip>

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
          <div className="form-group form-grid-full">
            <div className="label-with-info">
              <label className="form-label">Primary Emergency Contact / Executor</label>
              <InfoBubble
                title="Who is the Primary Contact / Executor?"
                explanation="The first person emergency responders, doctors, or family members should call. This is usually your spouse, adult child, or the person named as Executor in your Will."
                example="e.g. Eleanor Vance (Spouse) — Mobile: (555) 019-2831"
              />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Eleanor Vance (Spouse) — (555) 019-2831 — Address: 120 Elm St."
              value={plan.primaryEmergencyContact}
              onChange={e => onUpdate({ primaryEmergencyContact: e.target.value })}
            />
            <span className="form-helper-text">Include name, relationship, and reliable phone number.</span>
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Secondary / Backup Emergency Contact</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Thomas Sterling (Brother / Alternate Executor) — (555) 948-2041"
              value={plan.secondaryEmergencyContact}
              onChange={e => onUpdate({ secondaryEmergencyContact: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Preferred Funeral Home / Mortuary</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Maplewood Memorial Chapel — (555) 882-9900"
              value={plan.funeralHomePreference}
              onChange={e => onUpdate({ funeralHomePreference: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Primary Doctor or Hospice Care</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dr. Sarah Jenkins (Mercy Clinic) — (555) 441-2390"
              value={plan.hospiceOrDoctorContact}
              onChange={e => onUpdate({ hospiceOrDoctorContact: e.target.value })}
            />
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
          <div className="form-group form-grid-full">
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
              placeholder="e.g. Fireproof safe in master closet, top shelf. Key is taped under my desk drawer."
              value={plan.originalWillLocation}
              onChange={e => onUpdate({ originalWillLocation: e.target.value })}
            />
            <span className="form-helper-text">Probate courts require the physical original signed document with ink seal.</span>
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
