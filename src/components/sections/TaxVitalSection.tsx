import React, { useState } from 'react';
import { FileCheck, Shield } from 'lucide-react';
import type { TaxVitalRecords } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { InfoBubble } from '../common/InfoBubble';
import { PresetChips } from '../common/PresetChips';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';

interface TaxVitalSectionProps {
  records: TaxVitalRecords;
  isNotApplicable?: boolean;
  onUpdate: (updated: Partial<TaxVitalRecords>) => void;
  onToggleNA: (isNA: boolean) => void;
}

const LOCATION_PRESETS = [
  'Home Fireproof Safe',
  'Master Bedroom Closet Shelf',
  'Office Filing Cabinet',
  'With CPA / Accountant',
  'Bank Safe Deposit Box'
];

export const TaxVitalSection: React.FC<TaxVitalSectionProps> = ({
  records,
  isNotApplicable = false,
  onUpdate,
  onToggleNA
}) => {
  const [hasMilitaryService, setHasMilitaryService] = useState<boolean>(() => {
    return Boolean(records.militaryDd214Location);
  });

  return (
    <div className="section-content-container">
      <SectionHeader
        title="Tax Records & Vital Documents"
        description="Locations of prior income tax returns, CPA contacts, government certificates, military discharge records (DD-214), and titles."
        isNotApplicable={isNotApplicable}
        isComplete={!!records.taxReturnsLocation || !!records.birthCertificateLocation || !!records.cpaAccountantContact}
        onToggleNotApplicable={onToggleNA}
      />

      <GuidanceTip type="info" title="Why Past 3 Years of Tax Returns Are Essential">
        Executors must file a final individual income tax return (Form 1040) and potentially an estate income tax return (Form 1041). The IRS requires prior year records to verify deductions and carryforwards.
      </GuidanceTip>

      <div className="form-card glass-panel">
        <div className="form-section-title">
          <FileCheck size={18} />
          <h3>Tax Records & Accounting Contacts</h3>
        </div>

        <div className="form-grid">
          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Prior Tax Returns (Last 3 Years) Location</label>
              <InfoBubble
                title="Why physical or digital tax copies matter"
                explanation="The CPA will need past returns to file final income taxes, claim loss carryovers, and address potential estate tax deductions."
              />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Blue file folder in home office filing cabinet (bottom drawer)"
              value={records.taxReturnsLocation}
              onChange={e => onUpdate({ taxReturnsLocation: e.target.value })}
            />
            <PresetChips
              title="Common storage locations:"
              options={LOCATION_PRESETS}
              onSelect={(opt) => onUpdate({ taxReturnsLocation: opt.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">CPA / Tax Preparer Contact</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Mark Miller, CPA — (555) 301-4920 / mark@millercpa.com"
              value={records.cpaAccountantContact}
              onChange={e => onUpdate({ cpaAccountantContact: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="form-card glass-panel" style={{ marginTop: '24px' }}>
        <div className="form-section-title">
          <Shield size={18} />
          <h3>Vital Certificates & Identity Documents</h3>
          <InfoBubble
            title={INFO_DEFINITIONS.death_certificates.title}
            explanation={INFO_DEFINITIONS.death_certificates.explanation}
            example={INFO_DEFINITIONS.death_certificates.example}
          />
        </div>

        <div className="form-grid">
          <div className="form-group form-grid-half">
            <label className="form-label">Social Security Card Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Master fire safe top tray"
              value={records.socialSecurityCardLocation}
              onChange={e => onUpdate({ socialSecurityCardLocation: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Passports & Citizenship Documents Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Desk organizer locked drawer / Safe"
              value={records.passportsLocation}
              onChange={e => onUpdate({ passportsLocation: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Original Birth Certificate Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Safe deposit box / Fireproof lockbox"
              value={records.birthCertificateLocation}
              onChange={e => onUpdate({ birthCertificateLocation: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Marriage / Divorce Decrees Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Home safe, folder 'Vital Records'"
              value={records.marriageCertificateLocation}
              onChange={e => onUpdate({ marriageCertificateLocation: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Vehicle Titles & Property Deeds Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Car title pink slips in filing cabinet; Deed in Trust binder"
              value={records.vehicleTitlesLocation}
              onChange={e => onUpdate({ vehicleTitlesLocation: e.target.value })}
            />
          </div>

          {/* Progressive Disclosure: Military DD-214 */}
          <div className="form-group form-grid-full">
            <div className="progressive-disclosure-toggle-row">
              <span className="disclosure-prompt-text">Did you or your spouse serve in the U.S. Armed Forces?</span>
              <div className="disclosure-toggle-buttons">
                <button
                  type="button"
                  className={`disclosure-btn ${hasMilitaryService ? 'active' : ''}`}
                  onClick={() => setHasMilitaryService(true)}
                >
                  Yes, military service (DD-214)
                </button>
                <button
                  type="button"
                  className={`disclosure-btn ${!hasMilitaryService ? 'active' : ''}`}
                  onClick={() => setHasMilitaryService(false)}
                >
                  No military service
                </button>
              </div>
            </div>
          </div>

          {hasMilitaryService && (
            <div className="form-group form-grid-full">
              <div className="label-with-info">
                <label className="form-label">Military Discharge (DD-214) Location</label>
                <InfoBubble
                  title={INFO_DEFINITIONS.tax_dd214.title}
                  explanation={INFO_DEFINITIONS.tax_dd214.explanation}
                  example={INFO_DEFINITIONS.tax_dd214.example}
                />
              </div>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Fire safe envelope #2 (Needed for VA burial benefits & flag honors)"
                value={records.militaryDd214Location}
                onChange={e => onUpdate({ militaryDd214Location: e.target.value })}
              />
              <span className="form-helper-text">Required by the VA to secure burial in national cemeteries and military honors.</span>
            </div>
          )}

          <div className="form-group form-grid-full">
            <label className="form-label">Additional Vital Document Notes</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Any other legal or identity document notes..."
              value={records.notes}
              onChange={e => onUpdate({ notes: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
