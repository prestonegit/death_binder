import React from 'react';
import { Heart, Activity } from 'lucide-react';
import type { MedicalProfile } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { InfoBubble } from '../common/InfoBubble';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';

interface MedicalSectionProps {
  medical: MedicalProfile;
  isNotApplicable?: boolean;
  onUpdate: (updated: Partial<MedicalProfile>) => void;
  onToggleNA: (isNA: boolean) => void;
}

export const MedicalSection: React.FC<MedicalSectionProps> = ({
  medical,
  isNotApplicable = false,
  onUpdate,
  onToggleNA
}) => {
  return (
    <div className="section-content-container">
      <SectionHeader
        title="Medical Profile & Directives"
        description="Health background, critical allergies, active medications, primary doctors, and organ donation directives for emergency physicians and healthcare proxies."
        isNotApplicable={isNotApplicable}
        isComplete={!!medical.bloodType || !!medical.primaryPhysician || medical.organDonor !== 'undecided'}
        onToggleNotApplicable={onToggleNA}
      />

      <GuidanceTip type="info" title="Emergency Medical Access">
        In an acute medical crisis, EMTs and ER doctors look for high-risk medication details (e.g. blood thinners, insulin) and severe drug allergies (e.g. penicillin).
      </GuidanceTip>

      <div className="form-card glass-panel">
        <div className="form-section-title">
          <Activity size={18} />
          <h3>Critical Medical Indicators</h3>
        </div>

        <div className="form-grid">
          <div className="form-group form-grid-third">
            <label className="form-label">Blood Type</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. O Positive, A Negative"
              value={medical.bloodType}
              onChange={e => onUpdate({ bloodType: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-two-thirds">
            <div className="label-with-info">
              <label className="form-label">Organ Donation Registry Status</label>
              <InfoBubble
                title={INFO_DEFINITIONS.organ_donation.title}
                explanation={INFO_DEFINITIONS.organ_donation.explanation}
                example={INFO_DEFINITIONS.organ_donation.example}
              />
            </div>
            <select
              className="form-select"
              value={medical.organDonor}
              onChange={e => onUpdate({ organDonor: e.target.value as MedicalProfile['organDonor'] })}
            >
              <option value="undecided">Undecided / Please discuss with next of kin</option>
              <option value="yes">Yes — I am a registered organ donor (full donation authorized)</option>
              <option value="no">No — I do not wish to be an organ donor</option>
            </select>
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Severe Drug & Environmental Allergies</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Penicillin (Anaphylaxis), Latex, Sulfa drugs"
              value={medical.allergies}
              onChange={e => onUpdate({ allergies: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Chronic Medical Conditions & Diagnoses</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Type 2 Diabetes, Hypertension, Coronary Artery Disease, Asthma"
              value={medical.conditions}
              onChange={e => onUpdate({ conditions: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Active Medications, Dosages & Schedules</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="e.g. Lisinopril 20mg (Once daily morning), Metformin 500mg (Twice daily with meals), Baby Aspirin 81mg"
              value={medical.medications}
              onChange={e => onUpdate({ medications: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="form-card glass-panel" style={{ marginTop: '24px' }}>
        <div className="form-section-title">
          <Heart size={18} />
          <h3>Physicians & Preferred Hospital</h3>
        </div>

        <div className="form-grid">
          <div className="form-group form-grid-half">
            <label className="form-label">Primary Care Physician</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dr. Sarah Chen — Mercy Clinic (555) 234-5678"
              value={medical.primaryPhysician}
              onChange={e => onUpdate({ primaryPhysician: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Specialists / Cardiologist / Oncologist</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Cardiologist Dr. Patel — Heart Center (555) 890-1234"
              value={medical.specialists}
              onChange={e => onUpdate({ specialists: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Preferred Emergency Hospital / Network</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. St. Jude Regional Medical Center (Downtown)"
              value={medical.preferredHospital}
              onChange={e => onUpdate({ preferredHospital: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Additional Health Directives Notes</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Healthcare proxy holds full medical records on thumb drive."
              value={medical.notes}
              onChange={e => onUpdate({ notes: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
