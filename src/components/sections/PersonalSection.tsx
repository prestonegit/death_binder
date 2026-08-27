import React from 'react';
import type { PersonalInfo } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { InfoBubble } from '../common/InfoBubble';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';

interface PersonalSectionProps {
  info: PersonalInfo;
  isNotApplicable?: boolean;
  onUpdate: (updated: Partial<PersonalInfo>) => void;
  onToggleNA: (isNA: boolean) => void;
}

export const PersonalSection: React.FC<PersonalSectionProps> = ({
  info,
  isNotApplicable = false,
  onUpdate,
  onToggleNA
}) => {
  return (
    <div className="section-content-container">
      <SectionHeader
        title="Personal & Identity Information"
        description="Core identity details required by the probate court, vital statistics, and financial institutions."
        isNotApplicable={isNotApplicable}
        isComplete={!!info.fullName && !!info.dateOfBirth}
        onToggleNotApplicable={onToggleNA}
      />

      <GuidanceTip type="info" title="Why Exact Names Matter">
        Enter your legal name exactly as it appears on your Government ID, Social Security card, and passport. Aliases, maiden names, or nicknames can cause delays in probate asset releases.
      </GuidanceTip>

      <div className="form-card glass-panel">
        <div className="form-grid">
          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Full Legal Name</label>
              <InfoBubble
                title="Why exact legal name matters"
                explanation="Financial institutions match death certificates against account titles word-for-word. Matching your government ID prevents frozen funds."
              />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. John Robert Smith"
              value={info.fullName}
              onChange={e => onUpdate({ fullName: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Preferred Name / Maiden Name / Aliases</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Bob Smith, John R. Smith"
              value={info.preferredName}
              onChange={e => onUpdate({ preferredName: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-third">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-input"
              value={info.dateOfBirth}
              onChange={e => onUpdate({ dateOfBirth: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-third">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              placeholder="e.g. (555) 123-4567"
              value={info.phone}
              onChange={e => onUpdate({ phone: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-third">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. john.smith@example.com"
              value={info.email}
              onChange={e => onUpdate({ email: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Current Legal Residence Address</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 123 Maple Street, Cityville, NY 10001"
              value={info.currentAddress}
              onChange={e => onUpdate({ currentAddress: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Current Employer / Retirement Status</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Retired from Boeing (2018) / Acme Corp HR: (555) 999-0000"
              value={info.employer}
              onChange={e => onUpdate({ employer: e.target.value })}
            />
            <span className="form-helper-text">Include HR contact if employer life insurance or pension applies.</span>
          </div>

          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Military Service & Veteran Status</label>
              <InfoBubble
                title={INFO_DEFINITIONS.tax_dd214.title}
                explanation={INFO_DEFINITIONS.tax_dd214.explanation}
                example={INFO_DEFINITIONS.tax_dd214.example}
              />
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. US Navy (1985-1992), Honorable Discharge, Rank: E-5"
              value={info.militaryService}
              onChange={e => onUpdate({ militaryService: e.target.value })}
            />
            <span className="form-helper-text">Veterans qualify for special national cemetery burial and flag honors.</span>
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Professional Associations, Unions & Fraternal Organizations</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Rotary Club, State Bar Association, IEEE, Freemasons"
              value={info.groupsOrganizations}
              onChange={e => onUpdate({ groupsOrganizations: e.target.value })}
            />
            <span className="form-helper-text">Many organizations provide member survivor death benefits or memorial services.</span>
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Additional Background Notes</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Any additional personal details..."
              value={info.notes}
              onChange={e => onUpdate({ notes: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
