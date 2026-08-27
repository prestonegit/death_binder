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

      <div className="print-sleeve-insert-box" style={{ marginBottom: '12px', marginTop: '0' }}>
        <div className="sleeve-badge">📁 PHYSICAL BINDER PLASTIC SLEEVE #0: INSIDE FRONT COVER POCKET</div>
        <p><strong>Instructions for Preparer:</strong> Place this single-page emergency action sheet, a physical spare key set (house, vehicle, safe), and $200–$500 in emergency delivery cash inside clear Plastic Sleeve #0 in the front inside pocket of your 3-ring binder.</p>
      </div>

      <div className="print-emergency-callout">
        <strong>CRITICAL LEGAL NOTICE FOR FAMILY & EXECUTOR:</strong>
        <p>Do NOT pay outstanding debts, credit cards, or bills from your personal funds prior to formal probate and attorney consultation (unless you are a joint co-borrower/co-signer or subject to statutory spousal medical liability laws). Immediate priorities are notifying physicians, securing physical property, and contacting the preferred funeral director.</p>
      </div>

      <div className="print-grid-2col">
        {/* Urgent Contacts */}
        <div className="print-box">
          <h3>1. Immediate Contacts & Notifications</h3>
          <table className="print-table">
            <tbody>
              <tr>
                <td className="label-cell">Primary Emergency Contact / Executor:</td>
                <td className="value-cell bold">{emergencyPlan.primaryEmergencyContact || '—'}</td>
              </tr>
              <tr>
                <td className="label-cell">Secondary / Alternate Contact:</td>
                <td className="value-cell">{emergencyPlan.secondaryEmergencyContact || '—'}</td>
              </tr>
              <tr>
                <td className="label-cell">Primary Physician / Hospice:</td>
                <td className="value-cell">{emergencyPlan.hospiceOrDoctorContact || medicalProfile.primaryPhysician || '—'}</td>
              </tr>
              <tr>
                <td className="label-cell">Preferred Funeral Home:</td>
                <td className="value-cell">{emergencyPlan.funeralHomePreference || legalDocuments.funeralHomePreference || '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Immediate Access */}
        <div className="print-box">
          <h3>2. Critical Physical Access & Documents</h3>
          <table className="print-table">
            <tbody>
              <tr>
                <td className="label-cell">Original Signed Will Location:</td>
                <td className="value-cell bold">{emergencyPlan.originalWillLocation || legalDocuments.willLocation || '—'}</td>
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

      <div className="print-box full-width" style={{ marginTop: '12px' }}>
        <h3>3. Urgent Directives & Organ Donation</h3>
        <table className="print-table">
          <tbody>
            <tr>
              <td className="label-cell" style={{ width: '220px' }}>Organ Donation & Tissue Directives:</td>
              <td className="value-cell">
                {medicalProfile.organDonor === 'yes' ? 'REGISTERED ORGAN DONOR — Act Immediately Upon Death' : emergencyPlan.organDonationUrgentNote || '—'}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Disposition & Service Wishes:</td>
              <td className="value-cell">
                {legalDocuments.disposition ? `Preference: ${legalDocuments.disposition.toUpperCase()}. ` : ''}
                {legalDocuments.serviceWishes || '—'}
              </td>
            </tr>
            <tr>
              <td className="label-cell">Family Guidance Directives:</td>
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
