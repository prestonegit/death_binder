import React from 'react';
import type { ProfileData } from '../../types';
import { EXECUTOR_CHECKLIST_PHASES } from '../../data/executorChecklist';

interface PrintBinderProps {
  profile: ProfileData;
  mode: 'full' | 'emergency' | 'financial' | 'spines';
  maskSensitive: boolean;
}

export const PrintBinder: React.FC<PrintBinderProps> = ({
  profile,
  mode,
  maskSensitive
}) => {
  const {
    profileName,
    emergencyPlan,
    personalInfo,
    contacts,
    legalDocuments,
    financialAccounts,
    recurringPayments,
    assets,
    insurancePolicies,
    medicalProfile,
    digitalAccounts,
    taxVitalRecords,
    legacyMemories,
    sentimentalItems,
    pets,
    notApplicableSections = {}
  } = profile;

  const maskValue = (val: string) => {
    if (!val) return '—';
    if (maskSensitive) return '••••••••';
    return val;
  };

  if (mode === 'emergency') {
    return null; // Rendered by PrintEmergencySheet directly
  }

  if (mode === 'spines') {
    return (
      <div className="print-only-container print-spines-view">
        <div className="print-page">
          <div className="print-spines-header">
            <h2>PHYSICAL 3-RING BINDER SPINE INSERTS & TAB LABELS</h2>
            <p>Cut along the dotted lines and insert into clear binder spine sleeves and divider tabs.</p>
          </div>

          <div className="spines-cutout-grid">
            {/* 2-Inch Spine */}
            <div className="spine-strip spine-2in">
              <span className="cut-indicator">✂ 2.0" BINDER SPINE</span>
              <div className="spine-content">
                <span className="spine-kicker">CONFIDENTIAL CONTINUITY RECORD</span>
                <h3 className="spine-title">LEGACY BINDER</h3>
                <h4 className="spine-name">{personalInfo.fullName || profileName}</h4>
                <span className="spine-date">{new Date().getFullYear()}</span>
              </div>
            </div>

            {/* 1.5-Inch Spine */}
            <div className="spine-strip spine-15in">
              <span className="cut-indicator">✂ 1.5" BINDER SPINE</span>
              <div className="spine-content">
                <span className="spine-kicker">CONTINUITY RECORD</span>
                <h3 className="spine-title">LEGACY BINDER</h3>
                <h4 className="spine-name">{personalInfo.fullName || profileName}</h4>
                <span className="spine-date">{new Date().getFullYear()}</span>
              </div>
            </div>

            {/* 1-Inch Spine */}
            <div className="spine-strip spine-1in">
              <span className="cut-indicator">✂ 1.0" BINDER SPINE</span>
              <div className="spine-content">
                <h3 className="spine-title-compact">LEGACY BINDER</h3>
                <h4 className="spine-name-compact">{personalInfo.fullName || profileName}</h4>
                <span className="spine-date">{new Date().getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* Divider Tab Cutouts */}
          <div className="divider-tabs-cutout-section" style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '11pt', borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '10px' }}>
              ✂ STANDARD DIVIDER TAB INSERTS (Cut & Slide into Clear Tab Pockets)
            </h3>
            <div className="divider-tabs-grid">
              <div className="tab-insert-box"><span>🚨 Sleeve #0: Emergency</span></div>
              <div className="tab-insert-box"><span>Tab 1: Personal ID</span></div>
              <div className="tab-insert-box"><span>Tab 2: Key Contacts</span></div>
              <div className="tab-insert-box"><span>Tab 3: Will & Trusts</span></div>
              <div className="tab-insert-box"><span>Tab 4: Financial Banks</span></div>
              <div className="tab-insert-box"><span>Tab 5: Recurring Bills</span></div>
              <div className="tab-insert-box"><span>Tab 6: Real Estate & Cars</span></div>
              <div className="tab-insert-box"><span>Tab 7: Insurance</span></div>
              <div className="tab-insert-box"><span>Tab 8: Medical Profile</span></div>
              <div className="tab-insert-box"><span>Tab 9: Online Accounts</span></div>
              <div className="tab-insert-box"><span>Tab 10: Tax & Vital Records</span></div>
              <div className="tab-insert-box"><span>Tab 11: Memories & Wisdom</span></div>
              <div className="tab-insert-box"><span>Tab 12: Heirlooms & Pets</span></div>
            </div>
          </div>

          <div className="print-footer-disclaimer">
            DeathBinder is an administrative organization platform and does not provide legal, tax, financial, or medical advice. Use does not create an attorney-client relationship.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="print-binder-document">
      {/* COVER PAGE */}
      {mode === 'full' && (
        <div className="print-cover-page">
          <div className="print-cover-border">
            <div className="cover-inner">
              <span className="cover-kicker">CONFIDENTIAL CONTINUITY RECORD</span>
              <h1 className="cover-main-title">LEGACY CONTINUITY BINDER</h1>
              <h2 className="cover-profile-title">{profileName}</h2>
              <div className="cover-divider" />
              <p className="cover-prepared-name">
                Prepared by: <strong>{personalInfo.fullName || profileName}</strong>
              </p>
              <p className="cover-date">
                Last Updated: <strong>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
              </p>

              <div className="cover-disclaimer-box">
                <p>
                  <strong>NOTICE TO EXECUTOR & HEIRS:</strong> This binder is designed to provide operational, practical, and administrative instructions to accompany a valid Last Will & Testament or Living Trust. It identifies accounts, vital keys, digital authorizations, and emergency wishes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABLE OF CONTENTS */}
      {mode === 'full' && (
        <div className="print-page print-toc-page">
          <div className="print-section-header">
            <h2>Table of Contents & Divider Index</h2>
          </div>
          <table className="print-toc-table">
            <tbody>
              <tr className="toc-pillar-header"><td colSpan={3}><strong>🚨 EMERGENCY HUB & CRISIS TRIAGE</strong></td></tr>
              <tr><td>Emergency Hub: First 48-Hour Action Plan</td><td className="dots" /><td className="pg">Divider 0</td></tr>
              <tr><td>Executor & Family Crisis Playbook Checklist</td><td className="dots" /><td className="pg">Playbook</td></tr>

              <tr className="toc-pillar-header"><td colSpan={3}><strong>👥 1. PEOPLE & HEALTH</strong></td></tr>
              <tr><td>Tab 1: Personal & Identity Information</td><td className="dots" /><td className="pg">Tab 1</td></tr>
              <tr><td>Tab 2: Key Contacts, Advisors & Next of Kin</td><td className="dots" /><td className="pg">Tab 2</td></tr>
              <tr><td>Tab 8: Medical Profile & Directives</td><td className="dots" /><td className="pg">Tab 8</td></tr>

              <tr className="toc-pillar-header"><td colSpan={3}><strong>💳 2. MONEY & PROPERTY</strong></td></tr>
              <tr><td>Tab 4: Financial Accounts, Banks & Brokerages</td><td className="dots" /><td className="pg">Tab 4</td></tr>
              <tr><td>Tab 5: Recurring Bills, Subscriptions & Utilities</td><td className="dots" /><td className="pg">Tab 5</td></tr>
              <tr><td>Tab 6: Real Estate, Vehicles & Safe Combinations</td><td className="dots" /><td className="pg">Tab 6</td></tr>
              <tr><td>Tab 7: Insurance Policies & Declarations</td><td className="dots" /><td className="pg">Tab 7</td></tr>

              <tr className="toc-pillar-header"><td colSpan={3}><strong>📜 3. PAPERWORK & LEGAL</strong></td></tr>
              <tr><td>Tab 3: Legal Wills, Trusts, POAs & Directives</td><td className="dots" /><td className="pg">Tab 3</td></tr>
              <tr><td>Tab 10: Tax Records & Vital Certificates</td><td className="dots" /><td className="pg">Tab 10</td></tr>

              <tr className="toc-pillar-header"><td colSpan={3}><strong>🌐 4. ONLINE LIFE</strong></td></tr>
              <tr><td>Tab 9: Digital Accounts & Password Vaults</td><td className="dots" /><td className="pg">Tab 9</td></tr>

              <tr className="toc-pillar-header"><td colSpan={3}><strong>🌿 5. MEMORIES & WISHES</strong></td></tr>
              <tr><td>Tab 11: Legacy, Family Origins & Life Wisdom</td><td className="dots" /><td className="pg">Tab 11</td></tr>
              <tr><td>Tab 12: Sentimental Heirlooms & Pet Guardianship</td><td className="dots" /><td className="pg">Tab 12</td></tr>
            </tbody>
          </table>
        </div>
      )}

      {/* FIRST 48-HOUR PLAN */}
      {mode === 'full' && (
        <div className="print-section-block emergency-print-highlight">
          <div className="print-section-header">
            <h2>First 48-Hour Emergency Action Plan</h2>
          </div>

          <div className="print-sleeve-insert-box" style={{ marginBottom: '12px', marginTop: '0' }}>
            <div className="sleeve-badge">📁 PHYSICAL BINDER PLASTIC SLEEVE #0: INSIDE FRONT COVER POCKET</div>
            <p><strong>Instructions for Preparer:</strong> Keep this First 48-Hour Plan, physical spare key set (house, car, fire safe), and $200–$500 in cash in clear Sleeve #0 in the front inside pocket of this binder.</p>
          </div>

          <table className="print-table">
            <tbody>
              <tr><td className="label-cell">Primary Emergency Contact / Executor:</td><td className="value-cell bold">{emergencyPlan.primaryEmergencyContact || '—'}</td></tr>
              <tr><td className="label-cell">Secondary / Alternate Contact:</td><td className="value-cell">{emergencyPlan.secondaryEmergencyContact || '—'}</td></tr>
              <tr><td className="label-cell">Preferred Funeral Home / Mortuary:</td><td className="value-cell">{emergencyPlan.funeralHomePreference || '—'}</td></tr>
              <tr><td className="label-cell">Location of Original Signed Will:</td><td className="value-cell bold">{emergencyPlan.originalWillLocation || legalDocuments.willLocation || '—'}</td></tr>
              <tr><td className="label-cell">Immediate House Keys & Safe Codes:</td><td className="value-cell">{maskValue(emergencyPlan.immediateAccessCodes)}</td></tr>
              <tr><td className="label-cell">Immediate Pet & Dependent Instructions:</td><td className="value-cell">{emergencyPlan.immediatePetCare || '—'}</td></tr>
              <tr><td className="label-cell">Organ Donation Directive:</td><td className="value-cell">{emergencyPlan.organDonationUrgentNote || (medicalProfile.organDonor === 'yes' ? 'Registered Organ Donor' : '—')}</td></tr>
              <tr><td className="label-cell">Family Guidance Directives:</td><td className="value-cell">{emergencyPlan.criticalNotes || '—'}</td></tr>
            </tbody>
          </table>
        </div>
      )}

      {/* EXECUTOR CRISIS PLAYBOOK IN PRINT */}
      {mode === 'full' && (
        <div className="print-section-block">
          <div className="print-section-header">
            <h2>Executor & Family Crisis Action Playbook</h2>
          </div>
          <div className="print-emergency-callout">
            <strong>CRITICAL LEGAL CAUTION FOR EXECUTOR:</strong> Never pay estate debts or funeral expenses with your personal funds. The decedent’s debts are payable exclusively from estate assets in probate order (unless you are a joint co-borrower/co-signer or subject to statutory spousal medical liability laws).
          </div>
          {EXECUTOR_CHECKLIST_PHASES.map((phase) => (
            <div key={phase.id} style={{ marginBottom: '14px' }}>
              <h3 style={{ fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #333', paddingBottom: '3px', marginBottom: '6px' }}>
                {phase.badge} — {phase.title} ({phase.timeframeDescription})
              </h3>
              <table className="print-table">
                <thead>
                  <tr>
                    <th style={{ width: '35px' }}>Status</th>
                    <th style={{ width: '220px' }}>Action Item</th>
                    <th>Instructions & Operational Guidance</th>
                  </tr>
                </thead>
                <tbody>
                  {phase.tasks.map(task => (
                    <tr key={task.id}>
                      <td style={{ textAlign: 'center', fontSize: '14pt' }}>☐</td>
                      <td>
                        <strong>{task.title}</strong>
                        <div style={{ fontSize: '7.5pt', color: '#555' }}>{task.subtitle}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '8pt', lineHeight: '1.35' }}>{task.instructions}</div>
                        {task.caution && (
                          <div style={{ fontSize: '7.5pt', color: '#991b1b', fontWeight: 'bold', marginTop: '3px' }}>
                            ⚠️ {task.caution}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* 1. PERSONAL INFO */}
      {mode === 'full' && !notApplicableSections.personal && (
        <div className="print-section-block">
          <div className="print-section-header">
            <h2>1. Personal & Identity Information</h2>
          </div>
          <table className="print-table">
            <tbody>
              <tr><td className="label-cell">Full Legal Name:</td><td className="value-cell bold">{personalInfo.fullName || '—'}</td></tr>
              <tr><td className="label-cell">Preferred Name / Maiden Name:</td><td className="value-cell">{personalInfo.preferredName || '—'}</td></tr>
              <tr><td className="label-cell">Date of Birth:</td><td className="value-cell">{personalInfo.dateOfBirth || '—'}</td></tr>
              <tr><td className="label-cell">Phone & Email:</td><td className="value-cell">{personalInfo.phone || '—'} / {personalInfo.email || '—'}</td></tr>
              <tr><td className="label-cell">Current Legal Address:</td><td className="value-cell">{personalInfo.currentAddress || '—'}</td></tr>
              <tr><td className="label-cell">Employer / Retirement Status:</td><td className="value-cell">{personalInfo.employer || '—'}</td></tr>
              <tr><td className="label-cell">Military Service / Veteran Status:</td><td className="value-cell">{personalInfo.militaryService || '—'}</td></tr>
              <tr><td className="label-cell">Affiliations & Organizations:</td><td className="value-cell">{personalInfo.groupsOrganizations || '—'}</td></tr>
              {personalInfo.notes && <tr><td className="label-cell">Notes:</td><td className="value-cell">{personalInfo.notes}</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. CONTACTS */}
      {mode === 'full' && !notApplicableSections.contacts && (
        <div className="print-section-block">
          <div className="print-section-header">
            <h2>2. Key Contacts, Advisors & Next of Kin</h2>
          </div>
          {contacts.length === 0 ? <p className="print-empty">No contacts recorded.</p> : (
            <table className="print-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role / Relationship</th>
                  <th>Phone & Email</th>
                  <th>Address & Notes</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c.id}>
                    <td className="bold">{c.name || '—'}</td>
                    <td>{c.relationship || '—'}</td>
                    <td>{c.phone} {c.email ? `<${c.email}>` : ''}</td>
                    <td>{c.address ? `${c.address}. ` : ''}{c.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 3. LEGAL DOCUMENTS */}
      {mode === 'full' && !notApplicableSections.legal && (
        <div className="print-section-block">
          <div className="print-section-header">
            <h2>3. Legal Wills, Trusts, POAs & Directives</h2>
          </div>
          <table className="print-table">
            <tbody>
              <tr><td className="label-cell">Original Signed Will Location:</td><td className="value-cell bold">{legalDocuments.willLocation || '—'} (Date: {legalDocuments.willDate || '—'})</td></tr>
              <tr><td className="label-cell">Trust Name & Trustees:</td><td className="value-cell">{legalDocuments.trustName || '—'} ({legalDocuments.trustees || 'None listed'})</td></tr>
              <tr><td className="label-cell">Trust Agreement Location:</td><td className="value-cell">{legalDocuments.trustLocation || '—'}</td></tr>
              <tr><td className="label-cell">Financial POA Agent & Location:</td><td className="value-cell">{legalDocuments.financialPoaAgent || '—'} — Location: {legalDocuments.financialPoaLocation || '—'}</td></tr>
              <tr><td className="label-cell">Healthcare Proxy Agent & Location:</td><td className="value-cell">{legalDocuments.healthcareProxyAgent || '—'} — Location: {legalDocuments.healthcareProxyLocation || '—'}</td></tr>
              <tr><td className="label-cell">Living Will / DNR / HIPAA:</td><td className="value-cell">Living Will: {legalDocuments.livingWillLocation || '—'} | DNR/HIPAA: {legalDocuments.dnrPolstLocation || '—'}</td></tr>
              <tr><td className="label-cell">Safe Deposit Box & Keys:</td><td className="value-cell">{legalDocuments.safeDepositBoxBank || '—'} {maskValue(legalDocuments.safeDepositBoxLocation)} (Key: {maskValue(legalDocuments.safeDepositBoxKeyLocation)}) (Co-Signers: {legalDocuments.safeDepositBoxCoSigners || 'None'})</td></tr>
              <tr><td className="label-cell">Disposition & Funeral Home:</td><td className="value-cell">{legalDocuments.disposition ? `Preference: ${legalDocuments.disposition.toUpperCase()}. ` : ''} {legalDocuments.funeralHomePreference || '—'}</td></tr>
              <tr><td className="label-cell">Service Wishes & Eulogy:</td><td className="value-cell">{legalDocuments.serviceWishes} {legalDocuments.eulogyNotes ? ` | Eulogy: ${legalDocuments.eulogyNotes}` : ''}</td></tr>
              <tr><td className="label-cell">Personal Letters Location:</td><td className="value-cell">{legalDocuments.personalLettersLocation || '—'}</td></tr>
            </tbody>
          </table>

          <div className="print-sleeve-insert-box">
            <div className="sleeve-badge">📁 PHYSICAL BINDER PLASTIC SLEEVE #1: ORIGINAL LEGAL DOCUMENTS</div>
            <p><strong>Instructions for Preparer:</strong> Place the original physical ink-signed Last Will & Testament, Living Trust declaration, and Durable Power of Attorney forms in the clear plastic sleeve directly behind this divider. <em>(Do NOT unstaple or alter original court binding).</em></p>
          </div>
        </div>
      )}

      {/* 4. FINANCIAL ACCOUNTS */}
      {(!notApplicableSections.financial || mode === 'financial') && (
        <div className="print-section-block">
          <div className="print-section-header">
            <h2>{mode === 'financial' ? 'Financial & Investment Inventory' : '4. Financial Accounts, Brokerages & Loans'}</h2>
          </div>
          {financialAccounts.length === 0 ? <p className="print-empty">No financial accounts recorded.</p> : (
            <table className="print-table">
              <thead>
                <tr>
                  <th>Institution</th>
                  <th>Account Type</th>
                  <th>Identifier (Last 4)</th>
                  <th>Beneficiary Designation</th>
                  <th>Notes / Website</th>
                </tr>
              </thead>
              <tbody>
                {financialAccounts.map(acc => (
                  <tr key={acc.id}>
                    <td className="bold">{acc.institution || '—'}</td>
                    <td>{acc.accountType}</td>
                    <td>{maskValue(acc.accountIdentifier)}</td>
                    <td>{acc.beneficiaryDesignation || '—'}</td>
                    <td>{acc.notes ? `${acc.notes} ` : ''}{acc.website ? `(${acc.website})` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 5. RECURRING PAYMENTS */}
      {(!notApplicableSections.recurring || mode === 'financial') && (
        <div className="print-section-block">
          <div className="print-section-header">
            <h2>5. Recurring Bills, Subscriptions & Utilities</h2>
          </div>
          {recurringPayments.length === 0 ? <p className="print-empty">No recurring payments recorded.</p> : (
            <table className="print-table">
              <thead>
                <tr>
                  <th>Service / Payee</th>
                  <th>Category</th>
                  <th>Estimated Amount</th>
                  <th>Paid Via</th>
                  <th>Cancellation Instructions</th>
                </tr>
              </thead>
              <tbody>
                {recurringPayments.map(r => (
                  <tr key={r.id}>
                    <td className="bold">{r.name || '—'}</td>
                    <td>{r.category}</td>
                    <td>{maskValue(r.estimatedAmount)} ({r.billingCycle})</td>
                    <td>{r.autoPaySource || '—'}</td>
                    <td>{r.cancellationInstructions || r.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 6. ASSETS & REAL ESTATE */}
      {(!notApplicableSections.assets || mode === 'financial') && (
        <div className="print-section-block">
          <div className="print-section-header">
            <h2>6. Real Estate, Vehicles & Safe Combinations</h2>
          </div>
          {assets.length === 0 ? <p className="print-empty">No assets listed.</p> : (
            <table className="print-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Titled As</th>
                  <th>Est. Value</th>
                  <th>Keys / Codes / Notes</th>
                </tr>
              </thead>
              <tbody>
                {assets.map(a => (
                  <tr key={a.id}>
                    <td className="bold">{a.description || '—'}</td>
                    <td>{a.category}</td>
                    <td>{a.location || '—'}</td>
                    <td>{a.titleHolder || '—'}</td>
                    <td>{maskValue(a.estimatedValue)}</td>
                    <td>{maskValue(a.notes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="print-sleeve-insert-box">
            <div className="sleeve-badge">📁 PHYSICAL BINDER PLASTIC SLEEVE #2: PROPERTY DEEDS & TITLES</div>
            <p><strong>Instructions for Preparer:</strong> Place real estate grant deeds, vehicle certificates of title (pink slips), and cemetery plot deeds in the plastic sleeve behind this divider.</p>
          </div>
        </div>
      )}

      {/* 7. INSURANCE */}
      {mode === 'full' && !notApplicableSections.insurance && (
        <div className="print-section-block">
          <div className="print-section-header">
            <h2>7. Insurance Policies</h2>
          </div>
          {insurancePolicies.length === 0 ? <p className="print-empty">No insurance policies recorded.</p> : (
            <table className="print-table">
              <thead>
                <tr>
                  <th>Provider / Carrier</th>
                  <th>Policy Type</th>
                  <th>Policy #</th>
                  <th>Coverage / Benefit</th>
                  <th>Beneficiary</th>
                  <th>Claims Contact / Notes</th>
                </tr>
              </thead>
              <tbody>
                {insurancePolicies.map(p => (
                  <tr key={p.id}>
                    <td className="bold">{p.provider || '—'}</td>
                    <td>{p.policyType}</td>
                    <td>{maskValue(p.policyNumber)}</td>
                    <td>{maskValue(p.coverageAmount)}</td>
                    <td>{p.beneficiaries || '—'}</td>
                    <td>{p.contactNumber || p.agentContact || ''} {p.notes ? `(${p.notes})` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="print-sleeve-insert-box">
            <div className="sleeve-badge">📁 PHYSICAL BINDER PLASTIC SLEEVE #3: INSURANCE DECLARATION PAGES</div>
            <p><strong>Instructions for Preparer:</strong> Insert the policy summary declaration page and primary beneficiary confirmation letters for each life and homeowners policy behind this divider.</p>
          </div>
        </div>
      )}

      {/* 8. MEDICAL PROFILE */}
      {mode === 'full' && !notApplicableSections.medical && (
        <div className="print-section-block">
          <div className="print-section-header">
            <h2>8. Medical Profile & Directives</h2>
          </div>
          <table className="print-table">
            <tbody>
              <tr><td className="label-cell">Blood Type:</td><td className="value-cell bold">{medicalProfile.bloodType || '—'}</td></tr>
              <tr><td className="label-cell">Organ Donor Status:</td><td className="value-cell">{medicalProfile.organDonor.toUpperCase()}</td></tr>
              <tr><td className="label-cell">Severe Allergies:</td><td className="value-cell">{medicalProfile.allergies || 'None listed'}</td></tr>
              <tr><td className="label-cell">Chronic Conditions:</td><td className="value-cell">{medicalProfile.conditions || 'None listed'}</td></tr>
              <tr><td className="label-cell">Active Medications & Dosages:</td><td className="value-cell">{medicalProfile.medications || 'None listed'}</td></tr>
              <tr><td className="label-cell">Primary Physician & Specialists:</td><td className="value-cell">{medicalProfile.primaryPhysician || '—'} | Specialists: {medicalProfile.specialists || '—'}</td></tr>
              <tr><td className="label-cell">Preferred Emergency Hospital:</td><td className="value-cell">{medicalProfile.preferredHospital || '—'}</td></tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 9. DIGITAL ACCOUNTS */}
      {mode === 'full' && !notApplicableSections.digital && (
        <div className="print-section-block">
          <div className="print-section-header">
            <h2>9. Digital Accounts & Password Vaults</h2>
          </div>
          {digitalAccounts.length === 0 ? <p className="print-empty">No digital accounts listed.</p> : (
            <table className="print-table">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Username</th>
                  <th>Digital Executor</th>
                  <th>Legacy Contact</th>
                  <th>Hardware 2FA / Emergency Kit</th>
                  <th>RUFADAA Directives</th>
                </tr>
              </thead>
              <tbody>
                {digitalAccounts.map(d => (
                  <tr key={d.id}>
                    <td className="bold">{d.platform || '—'}</td>
                    <td>{d.username || '—'}</td>
                    <td>{d.digitalExecutor || '—'}</td>
                    <td>{d.legacyContactConfigured ? 'Yes' : 'No'}</td>
                    <td>{maskValue(d.hardwareKeyLocation)}</td>
                    <td>{d.rufadaaDirectives || d.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 10. TAX & VITAL RECORDS */}
      {mode === 'full' && !notApplicableSections.tax && (
        <div className="print-section-block">
          <div className="print-section-header">
            <h2>10. Tax Records & Vital Certificates</h2>
          </div>
          <table className="print-table">
            <tbody>
              <tr><td className="label-cell">Prior 3 Years Tax Returns (1040s):</td><td className="value-cell">{taxVitalRecords.taxReturnsLocation || '—'}</td></tr>
              <tr><td className="label-cell">CPA / Tax Accountant Contact:</td><td className="value-cell">{taxVitalRecords.cpaAccountantContact || '—'}</td></tr>
              <tr><td className="label-cell">Social Security Card Location:</td><td className="value-cell">{taxVitalRecords.socialSecurityCardLocation || '—'}</td></tr>
              <tr><td className="label-cell">Birth & Marriage Certificates:</td><td className="value-cell">Birth: {taxVitalRecords.birthCertificateLocation || '—'} | Marriage: {taxVitalRecords.marriageCertificateLocation || '—'}</td></tr>
              <tr><td className="label-cell">Military Discharge (DD-214):</td><td className="value-cell">{taxVitalRecords.militaryDd214Location || '—'}</td></tr>
              <tr><td className="label-cell">Passports & Citizenship Docs:</td><td className="value-cell">{taxVitalRecords.passportsLocation || '—'}</td></tr>
              <tr><td className="label-cell">Vehicle Titles & Property Deeds:</td><td className="value-cell">{taxVitalRecords.vehicleTitlesLocation || '—'} / {taxVitalRecords.propertyDeedsLocation || '—'}</td></tr>
              {taxVitalRecords.notes && <tr><td className="label-cell">Storage Location & Notes:</td><td className="value-cell">{taxVitalRecords.notes}</td></tr>}
            </tbody>
          </table>

          <div className="print-sleeve-insert-box">
            <div className="sleeve-badge">📁 PHYSICAL BINDER PLASTIC SLEEVE #4: VITAL CERTIFICATES & DD-214</div>
            <p><strong>Instructions for Preparer / Executor:</strong> Place 10 to 15 certified raised-seal Death Certificates, original Birth Certificates, Marriage Certificates, and Military DD-214 discharge papers in the plastic sleeve behind this divider.</p>
          </div>
        </div>
      )}

      {/* 11. LEGACY & WISDOM */}
      {mode === 'full' && !notApplicableSections.legacy && (
        <div className="print-section-block">
          <div className="print-section-header">
            <h2>11. Legacy, Memories & Wisdom</h2>
          </div>
          <table className="print-table">
            <tbody>
              {legacyMemories.familyOrigins && <tr><td className="label-cell">Family Origins & Heritage:</td><td className="value-cell">{legacyMemories.familyOrigins}</td></tr>}
              {legacyMemories.traditionsRecipes && <tr><td className="label-cell">Traditions & Recipes:</td><td className="value-cell">{legacyMemories.traditionsRecipes}</td></tr>}
              {legacyMemories.lifeLessonsWisdom && <tr><td className="label-cell">Life Lessons & Principles:</td><td className="value-cell">{legacyMemories.lifeLessonsWisdom}</td></tr>}
              {legacyMemories.bucketListCompleted && <tr><td className="label-cell">Proudest Moments / Accomplishments:</td><td className="value-cell">{legacyMemories.bucketListCompleted}</td></tr>}
              {legacyMemories.bucketListFuture && <tr><td className="label-cell">Wishes for the Future:</td><td className="value-cell">{legacyMemories.bucketListFuture}</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* 12. SENTIMENTAL & PETS */}
      {mode === 'full' && !notApplicableSections.sentimental && (
        <div className="print-section-block">
          <div className="print-section-header">
            <h2>12. Sentimental Heirlooms & Pet Guardianship</h2>
          </div>

          {sentimentalItems.length > 0 && (
            <>
              <h3 className="print-subheading">Personal Heirlooms & Property Memorandum</h3>
              <table className="print-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Intended Recipient</th>
                    <th>Location</th>
                    <th>Significance</th>
                  </tr>
                </thead>
                <tbody>
                  {sentimentalItems.map(i => (
                    <tr key={i.id}>
                      <td className="bold">{i.description || '—'}</td>
                      <td>{i.recipient || '—'}</td>
                      <td>{i.location || '—'}</td>
                      <td>{i.significance || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {pets.length > 0 && (
            <>
              <h3 className="print-subheading" style={{ marginTop: '16px' }}>Pet Care & Designated Guardians</h3>
              <table className="print-table">
                <thead>
                  <tr>
                    <th>Pet Name & Breed</th>
                    <th>Designated Guardian</th>
                    <th>Vet Contact</th>
                    <th>Feeding / Care Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {pets.map(p => (
                    <tr key={p.id}>
                      <td className="bold">{p.petName} ({p.typeBreed})</td>
                      <td>{p.designatedGuardian || '—'}</td>
                      <td>{p.vetContact || '—'}</td>
                      <td>{p.foodMedicationSchedule ? `${p.foodMedicationSchedule}. ` : ''}{p.careInstructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      <div className="print-footer-disclaimer">
        DeathBinder is an informational, administrative organization platform and does not provide legal, tax, financial, or medical advice. Use does not create an attorney-client relationship. Consult licensed estate planning attorneys and CPAs in your jurisdiction.
      </div>
    </div>
  );
};
