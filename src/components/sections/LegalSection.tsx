import React from 'react';
import { FileText, Shield, Key, Heart } from 'lucide-react';
import type { LegalDocuments } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { PrivacyField } from '../common/PrivacyField';
import { InfoBubble } from '../common/InfoBubble';
import { PresetChips } from '../common/PresetChips';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';

interface LegalSectionProps {
  legal: LegalDocuments;
  isPrivacyMasked: boolean;
  isNotApplicable?: boolean;
  onUpdate: (updated: Partial<LegalDocuments>) => void;
  onToggleNA: (isNA: boolean) => void;
}

const LOCATION_PRESETS = [
  'Home Fireproof Safe',
  'Master Bedroom Closet Shelf',
  'With Estate Attorney',
  'Office Filing Cabinet (Top Drawer)',
  'Bank Safe Deposit Box'
];

export const LegalSection: React.FC<LegalSectionProps> = ({
  legal,
  isPrivacyMasked,
  isNotApplicable = false,
  onUpdate,
  onToggleNA
}) => {
  return (
    <div className="section-content-container">
      <SectionHeader
        title="Legal Wills, Trusts, POAs & Directives"
        description="Records for your legal Last Will, Living Trust, authorized decision makers, bank safe deposit boxes, and final memorial wishes."
        isNotApplicable={isNotApplicable}
        isComplete={!!legal.willLocation || !!legal.trustLocation || !!legal.financialPoaLocation}
        onToggleNotApplicable={onToggleNA}
      />

      <GuidanceTip type="legal-warning" title="Important Legal Difference: POA vs. Executor">
        A <strong>Power of Attorney (POA)</strong> is only effective while you are alive and immediately terminates upon passing. Upon passing, your <strong>Executor</strong> (named in your Will) or <strong>Trustee</strong> (named in your Trust) takes over legal authority.
      </GuidanceTip>

      {/* 1. Will & Revocable Living Trust */}
      <div className="form-card glass-panel">
        <div className="form-section-title">
          <FileText size={18} />
          <h3>1. Last Will & Testament and Living Trust</h3>
          <InfoBubble
            title={INFO_DEFINITIONS.original_will.title}
            explanation={INFO_DEFINITIONS.original_will.explanation}
            example={INFO_DEFINITIONS.original_will.example}
          />
        </div>

        <div className="form-grid">
          <div className="form-group form-grid-two-thirds">
            <div className="label-with-info">
              <label className="form-label">Location of Original Signed Will</label>
              <InfoBubble
                title="Why exact physical location is needed"
                explanation="Probate courts need the physical original paper bearing ink signatures and notary seals. Digital scans are usually not accepted for primary probate."
              />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Home fireproof safe in bedroom / Original on file with Attorney Miller"
              value={legal.willLocation}
              onChange={e => onUpdate({ willLocation: e.target.value })}
            />
            <PresetChips
              title="Common safe locations:"
              options={LOCATION_PRESETS}
              onSelect={(opt) => onUpdate({ willLocation: opt.value })}
            />
          </div>

          <div className="form-group form-grid-third">
            <label className="form-label">Date of Last Signed Will</label>
            <input
              type="date"
              className="form-input"
              value={legal.willDate}
              onChange={e => onUpdate({ willDate: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Revocable Living Trust Name (if established)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. The Vance Family 2021 Revocable Trust"
              value={legal.trustName}
              onChange={e => onUpdate({ trustName: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Current Trustees & Successor Trustees</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. John Vance (Trustee), Eleanor Vance (Successor Trustee)"
              value={legal.trustees}
              onChange={e => onUpdate({ trustees: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Location of Trust Agreement & Certificate of Trust</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Green binder on top shelf in office library; digital copy on thumb drive."
              value={legal.trustLocation}
              onChange={e => onUpdate({ trustLocation: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 2. Powers of Attorney & Medical Directives */}
      <div className="form-card glass-panel" style={{ marginTop: '24px' }}>
        <div className="form-section-title">
          <Shield size={18} />
          <h3>2. Decision Makers & Advance Directives</h3>
          <InfoBubble
            title={INFO_DEFINITIONS.poa_vs_executor.title}
            explanation={INFO_DEFINITIONS.poa_vs_executor.explanation}
            example={INFO_DEFINITIONS.poa_vs_executor.example}
          />
        </div>

        <div className="form-grid">
          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Money Decision Maker (Durable Financial POA Agent)</label>
              <InfoBubble
                title="Money Decision Maker (Financial POA)"
                explanation="The trusted person legally authorized to pay your bills, manage accounts, and sign taxes if you become incapacitated during your lifetime."
                example="e.g. Jane Vance (Sister) — (555) 019-2831"
              />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Jane Vance (Sister) — (555) 019-2831"
              value={legal.financialPoaAgent}
              onChange={e => onUpdate({ financialPoaAgent: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Financial POA Document Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Home Safe & filing cabinet folder 'Financial POA'"
              value={legal.financialPoaLocation}
              onChange={e => onUpdate({ financialPoaLocation: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Medical Decision Maker (Healthcare Proxy / Medical POA)</label>
              <InfoBubble
                title={INFO_DEFINITIONS.healthcare_proxy.title}
                explanation={INFO_DEFINITIONS.healthcare_proxy.explanation}
                example={INFO_DEFINITIONS.healthcare_proxy.example}
              />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Robert Smith (Spouse) — (555) 123-9999"
              value={legal.healthcareProxyAgent}
              onChange={e => onUpdate({ healthcareProxyAgent: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Healthcare Proxy Document Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. On file with Dr. Chen at Mercy Clinic + copy in glovebox"
              value={legal.healthcareProxyLocation}
              onChange={e => onUpdate({ healthcareProxyLocation: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">End-of-Life Wishes (Living Will / Directives)</label>
              <InfoBubble
                title={INFO_DEFINITIONS.living_will.title}
                explanation={INFO_DEFINITIONS.living_will.explanation}
                example={INFO_DEFINITIONS.living_will.example}
              />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Fireproof safe + copy on file at St. Jude Hospital"
              value={legal.livingWillLocation}
              onChange={e => onUpdate({ livingWillLocation: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">DNR / POLST & HIPAA Medical Release Locations</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Yellow envelope on refrigerator door (State standard) / Safe"
              value={legal.dnrPolstLocation}
              onChange={e => onUpdate({ dnrPolstLocation: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 3. Safe Deposit Box */}
      <div className="form-card glass-panel" style={{ marginTop: '24px' }}>
        <div className="form-section-title">
          <Key size={18} />
          <h3>3. Bank Safe Deposit Boxes</h3>
          <InfoBubble
            title={INFO_DEFINITIONS.safe_deposit_box.title}
            explanation={INFO_DEFINITIONS.safe_deposit_box.explanation}
            example={INFO_DEFINITIONS.safe_deposit_box.example}
          />
        </div>

        <GuidanceTip type="legal-warning" title="Bank Safe Deposit Box Probate Freeze Caution">
          Many banks instantly freeze safe deposit boxes upon learning of a box holder's passing until probate letters are presented. Keep immediate items (like your only Will or funeral wishes) in a home fire safe or with a registered co-signer.
        </GuidanceTip>

        <div className="form-grid">
          <div className="form-group form-grid-half">
            <label className="form-label">Bank Institution & Branch Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Chase Bank — Downtown Branch (Main & 4th)"
              value={legal.safeDepositBoxBank}
              onChange={e => onUpdate({ safeDepositBoxBank: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <PrivacyField
              label="Safe Deposit Box Number"
              placeholder="e.g. Box #482"
              value={legal.safeDepositBoxLocation}
              isMaskedGlobal={isPrivacyMasked}
              onChange={val => onUpdate({ safeDepositBoxLocation: val })}
            />
          </div>

          <div className="form-group form-grid-half">
            <PrivacyField
              label="Physical Key Location"
              placeholder="e.g. Master bedroom desk, locked drawer, envelope 'Key 482'"
              value={legal.safeDepositBoxKeyLocation}
              isMaskedGlobal={isPrivacyMasked}
              onChange={val => onUpdate({ safeDepositBoxKeyLocation: val })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Authorized Co-Signers on Signature Card</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Eleanor Vance (Registered Co-Signer with Signature Card)"
              value={legal.safeDepositBoxCoSigners}
              onChange={e => onUpdate({ safeDepositBoxCoSigners: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 4. Final Wishes & Memorial Directives */}
      <div className="form-card glass-panel" style={{ marginTop: '24px' }}>
        <div className="form-section-title">
          <Heart size={18} />
          <h3>4. Memorial, Funeral & Disposition Wishes</h3>
          <InfoBubble
            title="Why recording wishes relieves family stress"
            explanation="Having your preferred disposition and service tone in writing prevents painful debates and second-guessing among grieving relatives."
          />
        </div>

        <div className="form-grid">
          <div className="form-group form-grid-half">
            <label className="form-label">Preferred Disposition</label>
            <select
              className="form-select"
              value={legal.disposition}
              onChange={e => onUpdate({ disposition: e.target.value as LegalDocuments['disposition'] })}
            >
              <option value="">Select preference...</option>
              <option value="burial">Traditional Burial</option>
              <option value="cremation">Cremation</option>
              <option value="donation">Medical/Scientific Body Donation</option>
              <option value="other">Other (e.g. Green Burial / Aquamation)</option>
            </select>
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Preferred Funeral Home / Cemetery</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Oakwood Cemetery (Family Plot #14)"
              value={legal.funeralHomePreference}
              onChange={e => onUpdate({ funeralHomePreference: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Service & Celebration of Life Wishes (Music, Readings, Tone)</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="e.g. Prefer an informal gathering / celebration of life with family and close friends. Play classical music."
              value={legal.serviceWishes}
              onChange={e => onUpdate({ serviceWishes: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Eulogy / Obituary Notes & Favorite Charities</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Key life achievements, favorite causes, or charities for donations in lieu of flowers..."
              value={legal.eulogyNotes}
              onChange={e => onUpdate({ eulogyNotes: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Location of Personal Letters / Messages to Loved Ones</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Sealed blue envelopes in top left drawer of roll-top desk."
              value={legal.personalLettersLocation}
              onChange={e => onUpdate({ personalLettersLocation: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
