import React, { useState } from 'react';
import { Heart, Activity, Stethoscope, Compass, ShieldAlert } from 'lucide-react';
import type { MedicalProfile } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { InfoBubble } from '../common/InfoBubble';
import { PresetChips } from '../common/PresetChips';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';
import { 
  MEDICAL_STARTERS,
  POLST_LOCATION_PRESETS,
  TERMINAL_LOCATION_PRESETS 
} from '../../data/philosophyPresets';
import { SectionStarterBanner } from '../common/SectionStarterBanner';
import type { SectionStarterArchetype } from '../../data/sectionStarters';

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
  const [hasHospice, setHasHospice] = useState<boolean>(() => {
    return Boolean(medical.isEnrolledInHospice || medical.hospiceAgencyName || medical.hospiceEmergency24hPhone);
  });

  const [hasPolst, setHasPolst] = useState<boolean>(() => {
    return Boolean(medical.hasSignedPolstMolst || medical.polstPhysicalLocation);
  });

  const [hasWholeBody, setHasWholeBody] = useState<boolean>(() => {
    return Boolean(medical.wholeBodyDonationProgram || medical.wholeBodyDonorRegistrationNumber);
  });

  const hasExistingData = Boolean(
    medical.codeStatus ||
    medical.ventilationSupport ||
    medical.artificialNutritionHydration ||
    medical.painManagementPhilosophy
  );

  const handleApplyStarter = (
    starter: SectionStarterArchetype<Partial<MedicalProfile>>,
    mode: 'fill_empty' | 'replace'
  ) => {
    if (mode === 'replace') {
      onUpdate({ ...starter.data });
    } else {
      const merged: Partial<MedicalProfile> = {};
      const starterData = starter.data;
      (Object.keys(starterData) as Array<keyof MedicalProfile>).forEach(key => {
        if (!medical[key] && starterData[key]) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (merged as any)[key] = starterData[key];
        }
      });
      onUpdate(merged);
    }
  };

  const qol = medical.qualityOfLife || {
    stopIfCannotRecognizeFamily: false,
    stopIfCannotCommunicate: false,
    stopIfPermanentlyBedbound: false,
    stopIfPermanentComa: false,
    stopIfPermanentVentilator: false,
    stopIfIntractableSuffering: false,
    personalThresholdNotes: ''
  };

  const handleQolToggle = (key: keyof typeof qol) => {
    onUpdate({
      qualityOfLife: {
        ...qol,
        [key]: !qol[key]
      }
    });
  };

  return (
    <div className="section-content-container">
      <SectionHeader
        title="Medical Profile & End-of-Life Directives"
        description="Clinical health background, physician contacts, life-support treatment preferences, cognitive thresholds, and out-of-hospital hospice protocols."
        isNotApplicable={isNotApplicable}
        isComplete={!!medical.bloodType || !!medical.primaryPhysician || !!medical.codeStatus}
        onToggleNotApplicable={onToggleNA}
      />

      {/* 1-Click Philosophy Starters (Ranging from Natural to Conservative) */}
      <SectionStarterBanner
        title="1-Click End-of-Life Philosophy Starters"
        badge="Ranging from Natural to Conservative"
        description="Choosing medical directives from scratch can be daunting. Select a cohesive philosophy to pre-fill thoughtful, medically sound directives, then adjust as you wish:"
        starters={MEDICAL_STARTERS}
        onApply={handleApplyStarter}
        hasExistingData={hasExistingData}
        defaultExpanded={!hasExistingData}
      />

      <GuidanceTip type="info" title="Clinical Reality vs. Television Myths">
        In an emergency, doctors and family need clear written guidance. Specifying preferences for breathing machines (ventilators), artificial nutrition, and pain relief relieves loved ones of immense moral distress.
      </GuidanceTip>

      {/* Card 1: Critical Medical Background */}
      <div className="form-card glass-panel">
        <div className="form-section-title">
          <Activity size={18} />
          <h3>1. Critical Health Baseline & Emergency Indicators</h3>
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
              <label className="form-label">Organ Donation Registry (Transplants)</label>
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
              <option value="yes">Yes — Registered organ donor for transplants (corneas, kidneys, heart)</option>
              <option value="no">No — I decline organ transplantation donation</option>
            </select>
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Severe Drug & Environmental Allergies</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Penicillin (Anaphylaxis), Latex, Sulfa drugs, Shellfish"
              value={medical.allergies}
              onChange={e => onUpdate({ allergies: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Chronic Medical Conditions & Diagnoses</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Type 2 Diabetes, Hypertension, Coronary Artery Disease, COPD, Chronic Kidney Disease"
              value={medical.conditions}
              onChange={e => onUpdate({ conditions: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Active Medications, Dosages & Schedules</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="e.g. Lisinopril 20mg (Morning), Metformin 500mg (Twice daily with meals), Eliquis 5mg (Blood thinner - twice daily)"
              value={medical.medications}
              onChange={e => onUpdate({ medications: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Card 2: Clinical Advance Directives & Life Support */}
      <div className="form-card glass-panel" style={{ marginTop: '24px' }}>
        <div className="form-section-title">
          <Stethoscope size={18} />
          <h3>2. Clinical Life-Support & Comfort Directives</h3>
        </div>

        <div className="form-grid">
          {/* Code Status */}
          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Cardiopulmonary Resuscitation (CPR / Code Status)</label>
              <InfoBubble
                title={INFO_DEFINITIONS.cpr_clinical_reality.title}
                explanation={INFO_DEFINITIONS.cpr_clinical_reality.explanation}
                example={INFO_DEFINITIONS.cpr_clinical_reality.example}
              />
            </div>
            <select
              className="form-select"
              value={medical.codeStatus || ''}
              onChange={e => onUpdate({ codeStatus: e.target.value as MedicalProfile['codeStatus'] })}
            >
              <option value="">Select Code Status Preference...</option>
              <option value="dnr_natural_death">Allow Natural Death (DNR / Comfort Measures Only)</option>
              <option value="cpr_full_code">Full Code (Attempt CPR, Chest Compressions & Shocks)</option>
              <option value="proxy_discretion">Healthcare Proxy Discretion (Decide based on prognosis)</option>
            </select>
          </div>

          {/* Mechanical Ventilation */}
          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Breathing Machines (Ventilator & Intubation)</label>
              <InfoBubble
                title={INFO_DEFINITIONS.time_limited_trial.title}
                explanation={INFO_DEFINITIONS.time_limited_trial.explanation}
                example={INFO_DEFINITIONS.time_limited_trial.example}
              />
            </div>
            <select
              className="form-select"
              value={medical.ventilationSupport || ''}
              onChange={e => onUpdate({ ventilationSupport: e.target.value as MedicalProfile['ventilationSupport'] })}
            >
              <option value="">Select Ventilator Preference...</option>
              <option value="time_limited_trial">Time-Limited Trial (Try for 3–5 days; withdraw if no recovery)</option>
              <option value="no_intubation">Do Not Intubate (DNI) — Non-invasive mask (BiPAP) only</option>
              <option value="indefinite_support">Maintain mechanical ventilation as long as life continues</option>
              <option value="proxy_discretion">Healthcare Proxy Discretion</option>
            </select>
          </div>

          {/* Artificial Feeding */}
          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Artificial Nutrition & Hydration (Feeding Tubes / IVs)</label>
              <InfoBubble
                title={INFO_DEFINITIONS.artificial_nutrition_hydration.title}
                explanation={INFO_DEFINITIONS.artificial_nutrition_hydration.explanation}
                example={INFO_DEFINITIONS.artificial_nutrition_hydration.example}
              />
            </div>
            <select
              className="form-select"
              value={medical.artificialNutritionHydration || ''}
              onChange={e => onUpdate({ artificialNutritionHydration: e.target.value as MedicalProfile['artificialNutritionHydration'] })}
            >
              <option value="">Select Nutrition & Hydration Preference...</option>
              <option value="pleasure_eating_only">Pleasure Feeding Only (Bites/sips by mouth; no tubes/IVs)</option>
              <option value="trial_feeding_tube">Short-Term Trial of IV fluids only if reversible</option>
              <option value="no_feeding_tube">No Feeding Tubes (PEG/G-tube) under any circumstances</option>
              <option value="full_artificial">Full Artificial Feeding & IV Hydration authorized</option>
            </select>
          </div>

          {/* Pain Management Philosophy */}
          <div className="form-group form-grid-half">
            <div className="label-with-info">
              <label className="form-label">Pain & Distress Relief (Double Effect Doctrine)</label>
              <InfoBubble
                title={INFO_DEFINITIONS.double_effect_pain.title}
                explanation={INFO_DEFINITIONS.double_effect_pain.explanation}
                example={INFO_DEFINITIONS.double_effect_pain.example}
              />
            </div>
            <select
              className="form-select"
              value={medical.painManagementPhilosophy || ''}
              onChange={e => onUpdate({ painManagementPhilosophy: e.target.value as MedicalProfile['painManagementPhilosophy'] })}
            >
              <option value="">Select Pain Management Philosophy...</option>
              <option value="comfort_first">Comfort First: Maximum pain/distress relief even if sleepy</option>
              <option value="alertness_first">Alertness First: Prioritize staying awake/clear-headed</option>
              <option value="balanced_proxy">Balanced: Discretion of hospice team & healthcare proxy</option>
            </select>
          </div>

          {/* Preferred Terminal Setting */}
          <div className="form-group form-grid-half">
            <label className="form-label">Preferred Setting for Terminal / Comfort Care</label>
            <select
              className="form-select"
              value={medical.terminalCareLocationPreference || ''}
              onChange={e => onUpdate({ terminalCareLocationPreference: e.target.value as MedicalProfile['terminalCareLocationPreference'] })}
            >
              <option value="">Select Preferred Setting...</option>
              <option value="home_hospice">At Home with visiting Hospice care & family</option>
              <option value="hospice_facility">Dedicated Inpatient Hospice Residence / Hospice House</option>
              <option value="hospital_comfort">Hospital Palliative / Comfort Care Suite</option>
              <option value="no_preference">No preference — wherever care team and family recommend</option>
            </select>
            <PresetChips
              options={TERMINAL_LOCATION_PRESETS}
              onSelect={val => onUpdate({ terminalCareLocationPreference: val.value.includes('Home') ? 'home_hospice' : val.value.includes('Residence') ? 'hospice_facility' : 'hospital_comfort' })}
            />
          </div>

          {/* Dialysis Wishes */}
          <div className="form-group form-grid-half">
            <label className="form-label">Dialysis & Life-Sustaining Kidney Treatment</label>
            <select
              className="form-select"
              value={medical.dialysisWishes || ''}
              onChange={e => onUpdate({ dialysisWishes: e.target.value as MedicalProfile['dialysisWishes'] })}
            >
              <option value="">Select Dialysis Directive...</option>
              <option value="stop_if_terminal">Stop chronic dialysis if terminal illness or severe dementia occurs</option>
              <option value="continue">Continue dialysis as long as medically indicated</option>
              <option value="never_start">Do not start dialysis under any circumstances</option>
              <option value="not_applicable">Not Applicable (Healthy kidney function)</option>
            </select>
          </div>

          {/* ICD & Diagnostic Intensity */}
          <div className="form-group form-grid-half">
            <label className="form-label">Pacemaker & Implantable Defibrillator (ICD) Deactivation</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Deactivate ICD shocks immediately upon comfort care (prevent painful shocks)"
              value={medical.pacemakerIcdDeactivationWishes || ''}
              onChange={e => onUpdate({ pacemakerIcdDeactivationWishes: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Diagnostic Intensity & Monitoring</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Stop routine blood draws, fingersticks, and vitals; monitor symptoms only"
              value={medical.diagnosticIntensityWishes || ''}
              onChange={e => onUpdate({ diagnosticIntensityWishes: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Card 3: Cognitive & Quality of Life Thresholds */}
      <div className="form-card glass-panel" style={{ marginTop: '24px' }}>
        <div className="form-section-title">
          <Compass size={18} />
          <h3>3. Cognitive & Quality of Life Thresholds (Surrogate Guidance)</h3>
        </div>

        <div className="label-with-info" style={{ marginBottom: 8 }}>
          <p className="form-helper-text">
            Give your Healthcare Proxy clear moral authority: <em>"Transition to comfort care only and withdraw life-prolonging treatments if I enter any of these conditions:"</em>
          </p>
          <InfoBubble
            title={INFO_DEFINITIONS.cognitive_thresholds.title}
            explanation={INFO_DEFINITIONS.cognitive_thresholds.explanation}
            example={INFO_DEFINITIONS.cognitive_thresholds.example}
          />
        </div>

        <div className="threshold-checklist">
          <label className="threshold-checkbox-item">
            <input
              type="checkbox"
              checked={qol.stopIfCannotRecognizeFamily}
              onChange={() => handleQolToggle('stopIfCannotRecognizeFamily')}
            />
            <span className="threshold-checkbox-label">
              <strong>Severe Dementia / Cognitive Loss:</strong> Inability to recognize children, spouse, or lifelong loved ones.
            </span>
          </label>

          <label className="threshold-checkbox-item">
            <input
              type="checkbox"
              checked={qol.stopIfCannotCommunicate}
              onChange={() => handleQolToggle('stopIfCannotCommunicate')}
            />
            <span className="threshold-checkbox-label">
              <strong>Loss of Communication:</strong> Inability to express thoughts, understand speech, or interact meaningfully.
            </span>
          </label>

          <label className="threshold-checkbox-item">
            <input
              type="checkbox"
              checked={qol.stopIfPermanentlyBedbound}
              onChange={() => handleQolToggle('stopIfPermanentlyBedbound')}
            />
            <span className="threshold-checkbox-label">
              <strong>Total Physical Dependence:</strong> Permanently bedbound and requiring total skilled nursing care for all basic functions.
            </span>
          </label>

          <label className="threshold-checkbox-item">
            <input
              type="checkbox"
              checked={qol.stopIfPermanentComa}
              onChange={() => handleQolToggle('stopIfPermanentComa')}
            />
            <span className="threshold-checkbox-label">
              <strong>Permanent Coma / Vegetative State (PVS):</strong> Irreversible unconsciousness with no neurological recovery prognosis.
            </span>
          </label>

          <label className="threshold-checkbox-item">
            <input
              type="checkbox"
              checked={qol.stopIfPermanentVentilator}
              onChange={() => handleQolToggle('stopIfPermanentVentilator')}
            />
            <span className="threshold-checkbox-label">
              <strong>Indefinite Ventilator Dependence:</strong> Cannot ever leave an ICU or breathe without mechanical machines.
            </span>
          </label>

          <label className="threshold-checkbox-item">
            <input
              type="checkbox"
              checked={qol.stopIfIntractableSuffering}
              onChange={() => handleQolToggle('stopIfIntractableSuffering')}
            />
            <span className="threshold-checkbox-label">
              <strong>Intractable Suffering:</strong> Chronic severe pain or breathlessness that cannot be relieved without continuous deep sedation.
            </span>
          </label>
        </div>

        <div className="form-group form-grid-full" style={{ marginTop: 14 }}>
          <label className="form-label">Personal Quality of Life Boundary Statement</label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="e.g. Life is worth living to me as long as I can communicate with family, read books, or enjoy sunshine. If I am trapped in a hospital bed with no awareness, let me pass with comfort and dignity."
            value={qol.personalThresholdNotes}
            onChange={e => onUpdate({
              qualityOfLife: {
                ...qol,
                personalThresholdNotes: e.target.value
              }
            })}
          />
        </div>
      </div>

      {/* Card 4: Out-of-Hospital EMS Orders & Hospice */}
      <div className="form-card glass-panel" style={{ marginTop: '24px' }}>
        <div className="form-section-title">
          <ShieldAlert size={18} />
          <h3>4. Out-of-Hospital EMS Orders & Hospice Protocol</h3>
        </div>

        {/* POLST Section */}
        <div className="progressive-disclosure-toggle-row">
          <span className="disclosure-prompt-text">
            Do you have an active, physician-signed State POLST / MOLST or Out-of-Hospital DNR?
          </span>
          <div className="disclosure-toggle-buttons">
            <button
              type="button"
              className={`disclosure-btn ${hasPolst ? 'active' : ''}`}
              onClick={() => setHasPolst(true)}
            >
              Yes, Active
            </button>
            <button
              type="button"
              className={`disclosure-btn ${!hasPolst ? 'active' : ''}`}
              onClick={() => {
                setHasPolst(false);
                onUpdate({ hasSignedPolstMolst: 'no', polstPhysicalLocation: '' });
              }}
            >
              Not Active / In Progress
            </button>
          </div>
        </div>

        {hasPolst && (
          <div className="form-grid" style={{ marginTop: 12 }}>
            <div className="form-group form-grid-half">
              <div className="label-with-info">
                <label className="form-label">POLST / MOLST Order Status</label>
                <InfoBubble
                  title={INFO_DEFINITIONS.polst_vs_living_will.title}
                  explanation={INFO_DEFINITIONS.polst_vs_living_will.explanation}
                  example={INFO_DEFINITIONS.polst_vs_living_will.example}
                />
              </div>
              <select
                className="form-select"
                value={medical.hasSignedPolstMolst || ''}
                onChange={e => onUpdate({ hasSignedPolstMolst: e.target.value as MedicalProfile['hasSignedPolstMolst'] })}
              >
                <option value="">Select Status...</option>
                <option value="yes">Yes — Signed by physician and patient/proxy</option>
                <option value="in_progress">In Progress with primary physician</option>
                <option value="no">Not completed</option>
              </select>
            </div>

            <div className="form-group form-grid-half">
              <label className="form-label">Physical Form Location for EMS First Responders</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Yellow sleeve magnetized to front of refrigerator"
                value={medical.polstPhysicalLocation || ''}
                onChange={e => onUpdate({ polstPhysicalLocation: e.target.value })}
              />
              <PresetChips
                options={POLST_LOCATION_PRESETS}
                onSelect={val => onUpdate({ polstPhysicalLocation: val.value })}
              />
            </div>
          </div>
        )}

        {/* Hospice Section */}
        <div className="progressive-disclosure-toggle-row" style={{ marginTop: 16 }}>
          <span className="disclosure-prompt-text">
            Is the individual currently enrolled in Home Hospice or Palliative Care?
          </span>
          <div className="disclosure-toggle-buttons">
            <button
              type="button"
              className={`disclosure-btn ${hasHospice ? 'active' : ''}`}
              onClick={() => {
                setHasHospice(true);
                onUpdate({ isEnrolledInHospice: true });
              }}
            >
              Yes, Hospice Enrolled
            </button>
            <button
              type="button"
              className={`disclosure-btn ${!hasHospice ? 'active' : ''}`}
              onClick={() => {
                setHasHospice(false);
                onUpdate({ isEnrolledInHospice: false, hospiceAgencyName: '', hospiceEmergency24hPhone: '', hospiceComfortKitLocation: '' });
              }}
            >
              No / Not at this time
            </button>
          </div>
        </div>

        {hasHospice && (
          <div className="form-grid" style={{ marginTop: 12 }}>
            <div className="form-group form-grid-half">
              <label className="form-label">Hospice Agency Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Visiting Nurse Hospice of Capital District"
                value={medical.hospiceAgencyName || ''}
                onChange={e => onUpdate({ hospiceAgencyName: e.target.value })}
              />
            </div>

            <div className="form-group form-grid-half">
              <label className="form-label">Hospice 24/7 Crisis Dispatch / Triage Phone</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. (555) 345-9999 (24-Hour On-Call Triage Nurse)"
                value={medical.hospiceEmergency24hPhone || ''}
                onChange={e => onUpdate({ hospiceEmergency24hPhone: e.target.value })}
              />
            </div>

            <div className="form-group form-grid-full">
              <div className="label-with-info">
                <label className="form-label">Hospice Emergency Comfort Kit ("E-Kit") Location</label>
                <InfoBubble
                  title={INFO_DEFINITIONS.hospice_comfort_kit.title}
                  explanation={INFO_DEFINITIONS.hospice_comfort_kit.explanation}
                  example={INFO_DEFINITIONS.hospice_comfort_kit.example}
                />
              </div>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Top shelf of kitchen refrigerator in sealed blue lockbox (liquid morphine & Ativan)"
                value={medical.hospiceComfortKitLocation || ''}
                onChange={e => onUpdate({ hospiceComfortKitLocation: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Whole-Body Anatomical Donation */}
        <div className="progressive-disclosure-toggle-row" style={{ marginTop: 16 }}>
          <span className="disclosure-prompt-text">
            Have you pre-registered for Whole-Body Anatomical Donation to medical science?
          </span>
          <div className="disclosure-toggle-buttons">
            <button
              type="button"
              className={`disclosure-btn ${hasWholeBody ? 'active' : ''}`}
              onClick={() => setHasWholeBody(true)}
            >
              Yes, Pre-Registered
            </button>
            <button
              type="button"
              className={`disclosure-btn ${!hasWholeBody ? 'active' : ''}`}
              onClick={() => {
                setHasWholeBody(false);
                onUpdate({ wholeBodyDonationProgram: '', wholeBodyDonorRegistrationNumber: '' });
              }}
            >
              No / Standard Organ Donation
            </button>
          </div>
        </div>

        {hasWholeBody && (
          <div className="form-grid" style={{ marginTop: 12 }}>
            <div className="form-group form-grid-half">
              <div className="label-with-info">
                <label className="form-label">Willed-Body / Anatomical Program Name</label>
                <InfoBubble
                  title={INFO_DEFINITIONS.whole_body_donation_rules.title}
                  explanation={INFO_DEFINITIONS.whole_body_donation_rules.explanation}
                  example={INFO_DEFINITIONS.whole_body_donation_rules.example}
                />
              </div>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. University School of Medicine Anatomical Gift Program"
                value={medical.wholeBodyDonationProgram || ''}
                onChange={e => onUpdate({ wholeBodyDonationProgram: e.target.value })}
              />
            </div>

            <div className="form-group form-grid-half">
              <label className="form-label">Donor Registration / Enrollment ID Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. WB-89412-A (Signed enrollment on file)"
                value={medical.wholeBodyDonorRegistrationNumber || ''}
                onChange={e => onUpdate({ wholeBodyDonorRegistrationNumber: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Card 5: Physicians & Hospital Contacts */}
      <div className="form-card glass-panel" style={{ marginTop: '24px' }}>
        <div className="form-section-title">
          <Heart size={18} />
          <h3>5. Physicians & Preferred Hospital</h3>
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

