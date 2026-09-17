import React from 'react';
import type { ProfileData } from '../../types';

interface PrintEmergencySheetProps {
  profile: ProfileData;
  maskSensitive?: boolean;
}

export const PrintEmergencySheet: React.FC<PrintEmergencySheetProps> = ({
  profile,
  maskSensitive = false
}) => {
  const { emergencyPlan, personalInfo, legalDocuments, medicalProfile } = profile;

  return (
    <div className="print-only-emergency-sheet">
      <div className="print-emergency-header">
        <h1>FIRST 48-HOUR EMERGENCY ACTION SHEET</h1>
        <h2>{profile.profileName} — {personalInfo.fullName || 'Confidential Record'}</h2>
        <span className="print-date">Generated: {new Date().toLocaleDateString()}</span>
      </div>

      <div className="print-sleeve-insert-box" style={{ marginBottom: '10px', marginTop: '0' }}>
        <div className="sleeve-badge">📁 PHYSICAL BINDER PLASTIC SLEEVE #0: INSIDE FRONT COVER POCKET</div>
        <p><strong>Instructions for Preparer:</strong> Place this single-page emergency action sheet, a physical spare key set (house, vehicle, safe), and emergency cash inside clear Plastic Sleeve #0 in the front inside pocket of your 3-ring binder.</p>
      </div>

      {/* Hospice Callout if Enrolled */}
      {emergencyPlan.isHospiceEnrolled && (
        <div className="print-emergency-callout" style={{ background: '#fef2f2', borderColor: '#b91c1c', color: '#7f1d1d', marginBottom: '10px', padding: '8px 12px' }}>
          <strong style={{ color: '#991b1b', fontSize: '9.5pt' }}>🚨 ACTIVE HOSPICE ENROLLMENT — DO NOT CALL 911:</strong>
          <p style={{ margin: '2px 0', fontSize: '8pt', lineHeight: 1.3 }}>
            Calling 911 initiates mandatory CPR, intubation, and emergency transport. In any pain spike, breathing crisis, or passing, call the 24/7 Hospice Nurse Hotline directly.
          </p>
          <div style={{ fontWeight: 700, fontSize: '10.5pt', color: '#991b1b' }}>
            📞 24/7 Hospice Hotline: {emergencyPlan.hospice24hTriageNumber || emergencyPlan.hospiceOrDoctorContact || 'See Hospice Contact'}
          </div>
          {emergencyPlan.hospiceComfortKitLocation && (
            <div style={{ fontSize: '7.5pt', marginTop: '2px' }}>
              <strong>Comfort Kit (E-Kit) Location:</strong> {emergencyPlan.hospiceComfortKitLocation}
            </div>
          )}
          {emergencyPlan.outOfHospitalDnrLocation && (
            <div style={{ fontSize: '7.5pt', marginTop: '2px' }}>
              <strong>Out-of-Hospital DNR / POLST Location:</strong> {emergencyPlan.outOfHospitalDnrLocation}
            </div>
          )}
        </div>
      )}

      <div className="print-emergency-callout">
        <strong>CRITICAL LEGAL NOTICE FOR FAMILY & EXECUTOR:</strong>
        <p>Do NOT pay outstanding debts, credit cards, or bills from your personal funds prior to formal probate and attorney consultation (unless you are a joint co-borrower/co-signer or subject to statutory spousal medical liability laws). Immediate priorities are notifying physicians, securing physical property, and contacting the preferred funeral director.</p>
      </div>

      <div className="print-grid-2col">
        {/* Urgent Contacts */}
        <div className="print-box">
          <h3>1. Immediate Decision Makers & Contacts</h3>
          <table className="print-table">
            <tbody>
              <tr>
                <td className="label-cell">Pre-Death Healthcare Proxy:</td>
                <td className="value-cell bold">{emergencyPlan.medicalDecisionMakerContact || emergencyPlan.primaryEmergencyContact || '—'}</td>
              </tr>
              <tr>
                <td className="label-cell">Post-Death Named Executor:</td>
                <td className="value-cell bold">{emergencyPlan.primaryExecutorContact || emergencyPlan.primaryEmergencyContact || '—'}</td>
              </tr>
              <tr>
                <td className="label-cell">Secondary / Alternate Contact:</td>
                <td className="value-cell">{emergencyPlan.secondaryEmergencyContact || '—'}</td>
              </tr>
              <tr>
                <td className="label-cell">Physician / Medical Clinic:</td>
                <td className="value-cell">{emergencyPlan.hospiceOrDoctorContact || medicalProfile.primaryPhysician || '—'}</td>
              </tr>
              <tr>
                <td className="label-cell">Funeral Home & Pre-Need Ref:</td>
                <td className="value-cell">
                  {emergencyPlan.funeralHomePreference || legalDocuments.funeralHomePreference || '—'}
                  {emergencyPlan.funeralContractNumberOrRef ? ` (Ref: ${emergencyPlan.funeralContractNumberOrRef})` : ''}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Designated Disposition Agent:</td>
                <td className="value-cell">{legalDocuments.designatedDispositionAgent || 'Family / Next of Kin'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Immediate Access */}
        <div className="print-box">
          <h3>2. Critical Physical Access & Liquidity</h3>
          <table className="print-table">
            <tbody>
              <tr>
                <td className="label-cell">Original Signed Will Location:</td>
                <td className="value-cell bold">{emergencyPlan.originalWillLocation || legalDocuments.willLocation || '—'}</td>
              </tr>
              <tr>
                <td className="label-cell">Day 1 Funeral Cash Buffer ($5k–$15k):</td>
                <td className="value-cell bold">
                  {maskSensitive && emergencyPlan.immediateCashBufferLocation
                    ? '•••••••• (Masked on Print)'
                    : emergencyPlan.immediateCashBufferLocation || '—'}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Funeral Funding Plan:</td>
                <td className="value-cell">{emergencyPlan.funeralFundingMethod ? emergencyPlan.funeralFundingMethod.replace(/_/g, ' ').toUpperCase() : '—'}</td>
              </tr>
              <tr>
                <td className="label-cell">Home Keys & Safe Access Codes:</td>
                <td className="value-cell">
                  {maskSensitive && emergencyPlan.immediateAccessCodes
                    ? '•••••••• (Masked on Print)'
                    : emergencyPlan.immediateAccessCodes || '—'}
                </td>
              </tr>
              <tr>
                <td className="label-cell">Immediate Pet Care Instructions:</td>
                <td className="value-cell">{emergencyPlan.immediatePetCare || '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical & End of Life Directives */}
      <div className="print-box full-width" style={{ marginTop: '10px' }}>
        <h3>3. Clinical Wishes & Advance Directives Summary</h3>
        <table className="print-table">
          <tbody>
            <tr>
              <td className="label-cell" style={{ width: '220px' }}>Cardiopulmonary Resuscitation (CPR):</td>
              <td className="value-cell bold">
                {medicalProfile.codeStatus === 'dnr_natural_death' 
                  ? 'ALLOW NATURAL DEATH (DNR / Comfort Care Only — No CPR / Shocks)' 
                  : medicalProfile.codeStatus === 'cpr_full_code'
                  ? 'FULL CODE (Attempt Resuscitation & Defibrillation)'
                  : medicalProfile.codeStatus || 'Refer to Living Will'}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Breathing Machine (Ventilator):</td>
              <td className="value-cell">
                {medicalProfile.ventilationSupport === 'time_limited_trial'
                  ? 'Time-Limited Trial (3–5 days; withdraw if irreversible)'
                  : medicalProfile.ventilationSupport === 'no_intubation'
                  ? 'Do Not Intubate (DNI - Natural breathing / comfort only)'
                  : medicalProfile.ventilationSupport || '—'}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Nutrition, Hydration & Pain Relief:</td>
              <td className="value-cell">
                Nutrition: {medicalProfile.artificialNutritionHydration === 'pleasure_eating_only' ? 'Pleasure Eating Only (No tubes)' : medicalProfile.artificialNutritionHydration || '—'} | Pain Relief: {medicalProfile.painManagementPhilosophy === 'comfort_first' ? 'Comfort First (Full pain relief even if drowsy)' : medicalProfile.painManagementPhilosophy || '—'}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Organ Donation & Disposition:</td>
              <td className="value-cell">
                {medicalProfile.organDonor === 'yes' ? 'REGISTERED ORGAN DONOR. ' : ''}
                {legalDocuments.disposition ? `Disposition: ${legalDocuments.disposition.toUpperCase()}. ` : ''}
                {legalDocuments.serviceWishes || '—'}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Critical Guidance for Family:</td>
              <td className="value-cell">{emergencyPlan.criticalNotes || '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="print-sheet-footer">
        <p>Keep this page in Plastic Sleeve #0 in the front inside pocket of the physical Legacy Binder.</p>
        <p style={{ marginTop: '4px', fontSize: '7pt', color: '#666' }}>
          DeathBinder is an informational, administrative organization platform and does not provide legal, tax, financial, or medical advice. Use does not create an attorney-client relationship.
        </p>
      </div>
    </div>
  );
};

