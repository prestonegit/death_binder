import React, { useState } from 'react';
import { FileText, Shield, Key, Heart } from 'lucide-react';
import type { LegalDocuments } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { PrivacyField } from '../common/PrivacyField';
import { InfoBubble } from '../common/InfoBubble';
import { PresetChips } from '../common/PresetChips';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';
import { 
  FUNERAL_SERVICE_PRESETS, 
  EULOGY_THEME_PRESETS, 
  DISPOSITION_PRESETS 
} from '../../data/philosophyPresets';
import { SectionStarterBanner } from '../common/SectionStarterBanner';
import { LEGAL_STARTERS, type SectionStarterArchetype } from '../../data/sectionStarters';

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
  const [hasTrust, setHasTrust] = useState<boolean>(() => {
    return Boolean(legal.trustName || legal.trustees || legal.trustLocation);
  });

  const [hasSafeDeposit, setHasSafeDeposit] = useState<boolean>(() => {
    return Boolean(legal.safeDepositBoxBank || legal.safeDepositBoxLocation || legal.safeDepositBoxKeyLocation || legal.safeDepositBoxCoSigners);
  });

  const hasExistingData = Boolean(
    legal.willLocation ||
    legal.trustName ||
    legal.financialPoaAgent ||
    legal.healthcareProxyAgent ||
    legal.disposition
  );

  const handleApplyStarter = (
    starter: SectionStarterArchetype<Partial<LegalDocuments>>,
    mode: 'fill_empty' | 'replace'
  ) => {
    if (mode === 'replace') {
      onUpdate({
        ...starter.data
      });
      if (starter.data.trustName) {
        setHasTrust(true);
      }
      if (starter.data.safeDepositBoxBank) {
        setHasSafeDeposit(true);
      }
    } else {
      const merged: Partial<LegalDocuments> = {};
      const starterData = starter.data;
      (Object.keys(starterData) as Array<keyof LegalDocuments>).forEach(key => {
        if (!legal[key] && starterData[key]) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (merged as any)[key] = starterData[key];
        }
      });
      onUpdate(merged);
      if (starterData.trustName && !legal.trustName) {
        setHasTrust(true);
      }
      if (starterData.safeDepositBoxBank && !legal.safeDepositBoxBank) {
        setHasSafeDeposit(true);
      }
    }
  };

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

      {/* 1-Click Legal Architecture Starters */}
      <SectionStarterBanner
        title="1-Click Legal Document Starters"
        badge="Ranging from Simple Will to Living Trust"
        description="Don't have documents finalized yet or not sure what to record? Select a standard estate architecture below to pre-fill a realistic baseline in one click, then edit anytime:"
        starters={LEGAL_STARTERS}
        onApply={handleApplyStarter}
        hasExistingData={hasExistingData}
        defaultExpanded={!hasExistingData}
      />

      {/* 1. Will & Revocable Living Trust */}
      <div className="form-card glass-panel">
        <div className="form-section-title">
          <FileText size={18} />
          <h3>1. Last Will & Testament</h3>
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
        </div>

        {/* Progressive Disclosure: Revocable Living Trust */}
        <div className="progressive-disclosure-toggle-row">
          <span className="disclosure-prompt-text">Do you have a Revocable Living Trust established?</span>
          <div className="disclosure-toggle-buttons">
            <button
              type="button"
              className={`disclosure-btn ${hasTrust ? 'active' : ''}`}
              onClick={() => setHasTrust(true)}
            >
              Yes, record my trust
            </button>
            <button
              type="button"
              className={`disclosure-btn ${!hasTrust ? 'active' : ''}`}
              onClick={() => setHasTrust(false)}
            >
              No, Will only
            </button>
          </div>
        </div>

        {hasTrust && (
          <div className="form-grid" style={{ marginTop: '16px' }}>
            <div className="form-group form-grid-half">
              <div className="label-with-info">
                <label className="form-label">Revocable Living Trust Name</label>
                <InfoBubble
                  title={INFO_DEFINITIONS.trust_funding.title}
                  explanation={INFO_DEFINITIONS.trust_funding.explanation}
                  example={INFO_DEFINITIONS.trust_funding.example}
                />
              </div>
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
        )}
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
          {/* Financial POA */}
          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Primary Financial POA Agent (Money Decision Maker)</label>
              <InfoBubble
                title="Money Decision Maker (Financial POA)"
                explanation="The trusted person legally authorized to pay bills, manage accounts, and sign taxes if you become incapacitated during your lifetime."
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
            <label className="form-label">Alternate / Successor Financial POA Agent</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. David Vance (Brother) — (555) 019-8822 (Takes over if primary cannot serve)"
              value={legal.financialPoaAlternate || ''}
              onChange={e => onUpdate({ financialPoaAlternate: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Financial POA Physical Document Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Home Safe & filing cabinet folder 'Financial POA'"
              value={legal.financialPoaLocation}
              onChange={e => onUpdate({ financialPoaLocation: e.target.value })}
            />
          </div>

          {/* Medical Proxy */}
          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Primary Healthcare Proxy / Medical Decision Maker</label>
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
            <label className="form-label">Alternate / Successor Healthcare Proxy</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Amanda Smith (Daughter) — (555) 123-4411 (Crucial if primary is unavailable)"
              value={legal.healthcareProxyAlternate || ''}
              onChange={e => onUpdate({ healthcareProxyAlternate: e.target.value })}
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

          {/* Living Will */}
          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Living Will / Advance Directive Location</label>
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

          {/* Standalone HIPAA Release */}
          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Standalone HIPAA Authorization Document Location</label>
              <InfoBubble
                title={INFO_DEFINITIONS.advance_directives_triad.title}
                explanation={INFO_DEFINITIONS.advance_directives_triad.explanation}
                example={INFO_DEFINITIONS.advance_directives_triad.example}
              />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Digital scan on cloud + original in home legal folder"
              value={legal.hipaaReleaseLocation || ''}
              onChange={e => onUpdate({ hipaaReleaseLocation: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Individuals Authorized to Receive Medical Charts (HIPAA)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Spouse Eleanor, Son Mark, Daughter Sarah (Can speak to doctors immediately)"
              value={legal.hipaaAuthorizedAgents || ''}
              onChange={e => onUpdate({ hipaaAuthorizedAgents: e.target.value })}
            />
          </div>

          {/* POLST / Out-of-Hospital Order */}
          <div className="form-group form-grid-full">
            <div className="label-with-info">
              <label className="form-label">State POLST / MOLST / Out-of-Hospital DNR Physical Location</label>
              <InfoBubble
                title={INFO_DEFINITIONS.polst_vs_living_will.title}
                explanation={INFO_DEFINITIONS.polst_vs_living_will.explanation}
                example={INFO_DEFINITIONS.polst_vs_living_will.example}
              />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Yellow sleeve magnetized to front of kitchen refrigerator (Must be visible to EMS)"
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

        <div className="progressive-disclosure-toggle-row" style={{ marginTop: '0' }}>
          <span className="disclosure-prompt-text">Do you or your spouse maintain a bank safe deposit box?</span>
          <div className="disclosure-toggle-buttons">
            <button
              type="button"
              className={`disclosure-btn ${hasSafeDeposit ? 'active' : ''}`}
              onClick={() => setHasSafeDeposit(true)}
            >
              Yes, record box & key
            </button>
            <button
              type="button"
              className={`disclosure-btn ${!hasSafeDeposit ? 'active' : ''}`}
              onClick={() => setHasSafeDeposit(false)}
            >
              No box maintained
            </button>
          </div>
        </div>

        {hasSafeDeposit && (
          <>
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
          </>
        )}
      </div>

      {/* 4. Final Wishes & Memorial Directives */}
      <div className="form-card glass-panel" style={{ marginTop: '24px' }}>
        <div className="form-section-title">
          <Heart size={18} />
          <h3>4. Memorial, Funeral & Right of Sepulcher Authority</h3>
          <InfoBubble
            title={INFO_DEFINITIONS.right_of_sepulcher.title}
            explanation={INFO_DEFINITIONS.right_of_sepulcher.explanation}
            example={INFO_DEFINITIONS.right_of_sepulcher.example}
          />
        </div>

        <GuidanceTip type="legal-warning" title="Right of Sepulcher & Cremation Authorization Caution">
          Cremation is 100% irreversible. Under state laws, mortuaries will freeze cremation if there is no designated Disposition Agent and surviving siblings dispute or cannot be contacted. Naming a designated agent eliminates family deadlocks.
        </GuidanceTip>

        <div className="form-grid">
          {/* Right of Sepulcher Agent */}
          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Designated Disposition Agent (Right of Sepulcher)</label>
              <InfoBubble
                title="Right of Sepulcher Agent"
                explanation="The specific person you legally authorize to direct your burial, cremation, and funeral arrangements without needing unanimous consent from all adult children."
                example="e.g. Eleanor Vance (Spouse) or Mark Vance (Son) — Sole legal authority for mortuary"
              />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Eleanor Vance (Spouse) — Sole legal disposition authority"
              value={legal.designatedDispositionAgent || ''}
              onChange={e => onUpdate({ designatedDispositionAgent: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Disposition Authorization Form Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Attached to Will in Home Safe / On file with mortuary"
              value={legal.dispositionAuthorizationFormLocation || ''}
              onChange={e => onUpdate({ dispositionAuthorizationFormLocation: e.target.value })}
            />
          </div>

          {/* Disposition Selection */}
          <div className="form-group form-grid-half">
            <label className="form-label">Preferred Final Disposition</label>
            <select
              className="form-select"
              value={legal.disposition}
              onChange={e => onUpdate({ disposition: e.target.value as LegalDocuments['disposition'] })}
            >
              <option value="">Select preference...</option>
              <option value="cremation">Cremation (Direct or with service)</option>
              <option value="burial">Traditional Casket Burial</option>
              <option value="green_burial">Green Conservation Burial (Biodegradable, no chemicals)</option>
              <option value="donation">Whole-Body Anatomical Donation to Science</option>
              <option value="other">Other (e.g. Aquamation / Terramation)</option>
            </select>
            <PresetChips
              options={DISPOSITION_PRESETS}
              onSelect={val => {
                const text = val.value.toLowerCase();
                if (text.includes('green')) onUpdate({ disposition: 'green_burial' });
                else if (text.includes('cremation')) onUpdate({ disposition: 'cremation' });
                else if (text.includes('casket') || text.includes('burial')) onUpdate({ disposition: 'burial' });
                else if (text.includes('donation') || text.includes('science')) onUpdate({ disposition: 'donation' });
              }}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Preferred Funeral Home / Cemetery</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Oakwood Cemetery & Maplewood Chapel (Family Plot #14)"
              value={legal.funeralHomePreference}
              onChange={e => onUpdate({ funeralHomePreference: e.target.value })}
            />
          </div>

          {legal.disposition === 'donation' && (
            <div className="form-group form-grid-full">
              <div className="label-with-info">
                <label className="form-label">Mandatory Backup Disposition Plan (If Donation is Rejected)</label>
                <InfoBubble
                  title={INFO_DEFINITIONS.whole_body_donation_rules.title}
                  explanation={INFO_DEFINITIONS.whole_body_donation_rules.explanation}
                  example={INFO_DEFINITIONS.whole_body_donation_rules.example}
                />
              </div>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Direct cremation at Maplewood Chapel if medical school rejects donor acceptance"
                value={legal.dispositionBackupPlan || ''}
                onChange={e => onUpdate({ dispositionBackupPlan: e.target.value })}
              />
              <span className="form-helper-text">Medical schools regularly decline anatomical gifts at death due to autopsies or disease; a backup plan protects family from sudden expenses.</span>
            </div>
          )}

          {/* Pre-Need Contract */}
          <div className="form-group form-grid-half">
            <label className="form-label">Pre-Need Funeral Contract Number (If Prepaid)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Contract #PN-49182 (Fully prepaid goods & services)"
              value={legal.preNeedContractNumber || ''}
              onChange={e => onUpdate({ preNeedContractNumber: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Pre-Need Mortuary / Cemetery Contact</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Maplewood Mortuary — (555) 890-1234"
              value={legal.preNeedFuneralHome || ''}
              onChange={e => onUpdate({ preNeedFuneralHome: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Service & Celebration of Life Wishes (Tone, Music, Readings)</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="e.g. Prefer a casual outdoor celebration of life with family and close friends. Play acoustic folk/rock playlist and share stories."
              value={legal.serviceWishes}
              onChange={e => onUpdate({ serviceWishes: e.target.value })}
            />
            <PresetChips
              options={FUNERAL_SERVICE_PRESETS}
              onSelect={val => onUpdate({ serviceWishes: val.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Eulogy / Obituary Notes & Memorial Themes</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Key achievements, beloved memories, core life philosophy, or donations in lieu of flowers..."
              value={legal.eulogyNotes}
              onChange={e => onUpdate({ eulogyNotes: e.target.value })}
            />
            <PresetChips
              options={EULOGY_THEME_PRESETS}
              onSelect={val => onUpdate({ eulogyNotes: val.value })}
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
