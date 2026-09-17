import type { ProfileData } from '../types';

export interface SectionStatus {
  id: string;
  number: string;
  title: string;
  category: string;
  isComplete: boolean;
  isNotApplicable: boolean;
  itemCount?: number;
  summary: string;
}

export interface BinderIndexSummary {
  sections: SectionStatus[];
  totalSections: number;
  completedSections: number;
  skippedSections: number;
  pendingSections: number;
  hasEmergencyContact: boolean;
  hasWillLocation: boolean;
}

export function evaluateSectionReadiness(profile: ProfileData): BinderIndexSummary {
  const na = profile.notApplicableSections || {};

  const hasEmergencyContact = !!(
    profile.emergencyPlan?.medicalDecisionMakerContact?.trim() ||
    profile.emergencyPlan?.primaryEmergencyContact?.trim() ||
    profile.emergencyPlan?.primaryExecutorContact?.trim()
  );
  const hasWillLocation = !!profile.emergencyPlan?.originalWillLocation?.trim() || !!profile.legalDocuments?.willLocation?.trim();

  const sections: SectionStatus[] = [
    {
      id: 'emergency',
      number: '01',
      title: 'Emergency & First 48 Hours',
      category: 'Immediate Response',
      isNotApplicable: !!na['emergency'],
      isComplete: !!na['emergency'] || (hasEmergencyContact && hasWillLocation),
      summary: profile.emergencyPlan?.medicalDecisionMakerContact || profile.emergencyPlan?.primaryEmergencyContact
        ? `Primary contact: ${profile.emergencyPlan.medicalDecisionMakerContact || profile.emergencyPlan.primaryEmergencyContact}` 
        : 'Emergency contact and will location needed'
    },
    {
      id: 'personal',
      number: '02',
      title: 'Personal & Identity Records',
      category: 'Identity & Family',
      isNotApplicable: !!na['personal'],
      isComplete: !!na['personal'] || (
        !!profile.personalInfo?.fullName?.trim() && 
        !!profile.personalInfo?.dateOfBirth?.trim()
      ),
      summary: profile.personalInfo?.fullName 
        ? profile.personalInfo.fullName 
        : 'Legal name and date of birth needed'
    },
    {
      id: 'contacts',
      number: '03',
      title: 'Key Advisors & Family Contacts',
      category: 'Identity & Family',
      isNotApplicable: !!na['contacts'],
      isComplete: !!na['contacts'] || profile.contacts.some(c => !!c.name?.trim() && !!c.phone?.trim()),
      itemCount: profile.contacts.filter(c => !!c.name?.trim()).length,
      summary: profile.contacts.filter(c => !!c.name?.trim()).length > 0
        ? `${profile.contacts.filter(c => !!c.name?.trim()).length} contact${profile.contacts.filter(c => !!c.name?.trim()).length === 1 ? '' : 's'} recorded`
        : 'No contacts recorded'
    },
    {
      id: 'medical',
      number: '04',
      title: 'Medical Directives & Care',
      category: 'Health & Care',
      isNotApplicable: !!na['medical'],
      isComplete: !!na['medical'] || (
        !!profile.medicalProfile?.codeStatus ||
        !!profile.medicalProfile?.ventilationSupport ||
        !!profile.medicalProfile?.primaryPhysician?.trim() ||
        profile.medicalProfile?.organDonor !== 'undecided'
      ),
      summary: profile.medicalProfile?.codeStatus 
        ? `Code Status: ${profile.medicalProfile.codeStatus === 'dnr_natural_death' ? 'Natural / DNR' : 'Full CPR'}` 
        : profile.medicalProfile?.primaryPhysician
        ? `Physician: Dr. ${profile.medicalProfile.primaryPhysician}`
        : 'Physician and directives pending'
    },
    {
      id: 'financial',
      number: '05',
      title: 'Banking & Financial Accounts',
      category: 'Property & Finance',
      isNotApplicable: !!na['financial'],
      isComplete: !!na['financial'] || profile.financialAccounts.length > 0,
      itemCount: profile.financialAccounts.length,
      summary: profile.financialAccounts.length > 0
        ? `${profile.financialAccounts.length} account${profile.financialAccounts.length === 1 ? '' : 's'} listed${profile.financialAccounts.some(a => a.immediateLiquidityAccess || a.ownershipType === 'jtwros') ? ' (Liquidity Ready)' : ''}`
        : 'No accounts recorded'
    },
    {
      id: 'assets',
      number: '06',
      title: 'Real Estate & Physical Assets',
      category: 'Property & Finance',
      isNotApplicable: !!na['assets'],
      isComplete: !!na['assets'] || profile.assets.length > 0,
      itemCount: profile.assets.length,
      summary: profile.assets.length > 0
        ? `${profile.assets.length} asset${profile.assets.length === 1 ? '' : 's'} listed`
        : 'No assets recorded'
    },
    {
      id: 'insurance',
      number: '07',
      title: 'Insurance Policies',
      category: 'Property & Finance',
      isNotApplicable: !!na['insurance'],
      isComplete: !!na['insurance'] || profile.insurancePolicies.length > 0,
      itemCount: profile.insurancePolicies.length,
      summary: profile.insurancePolicies.length > 0
        ? `${profile.insurancePolicies.length} polic${profile.insurancePolicies.length === 1 ? 'y' : 'ies'} listed`
        : 'No policies recorded'
    },
    {
      id: 'recurring',
      number: '08',
      title: 'Recurring Bills & Subscriptions',
      category: 'Property & Finance',
      isNotApplicable: !!na['recurring'],
      isComplete: !!na['recurring'] || profile.recurringPayments.length > 0,
      itemCount: profile.recurringPayments.length,
      summary: profile.recurringPayments.length > 0
        ? `${profile.recurringPayments.length} subscription${profile.recurringPayments.length === 1 ? '' : 's'}/bill${profile.recurringPayments.length === 1 ? '' : 's'} listed`
        : 'No recurring bills recorded'
    },
    {
      id: 'legal',
      number: '09',
      title: 'Wills, Trusts & Powers of Attorney',
      category: 'Legal & Vital Records',
      isNotApplicable: !!na['legal'],
      isComplete: !!na['legal'] || (
        !!profile.legalDocuments?.willLocation?.trim() ||
        !!profile.legalDocuments?.financialPoaLocation?.trim() ||
        !!profile.legalDocuments?.healthcareProxyLocation?.trim() ||
        !!profile.legalDocuments?.trustLocation?.trim()
      ),
      summary: profile.legalDocuments?.willLocation 
        ? 'Physical will location specified' 
        : 'Legal document locations pending'
    },
    {
      id: 'tax',
      number: '10',
      title: 'Tax & Vital Records',
      category: 'Legal & Vital Records',
      isNotApplicable: !!na['tax'],
      isComplete: !!na['tax'] || (
        !!profile.taxVitalRecords?.taxReturnsLocation?.trim() ||
        !!profile.taxVitalRecords?.birthCertificateLocation?.trim() ||
        !!profile.taxVitalRecords?.cpaAccountantContact?.trim()
      ),
      summary: profile.taxVitalRecords?.taxReturnsLocation 
        ? 'Tax returns location specified' 
        : 'Vital records pending'
    },
    {
      id: 'digital',
      number: '11',
      title: 'Digital Accounts & Devices',
      category: 'Digital & Legacy',
      isNotApplicable: !!na['digital'],
      isComplete: !!na['digital'] || profile.digitalAccounts.length > 0,
      itemCount: profile.digitalAccounts.length,
      summary: profile.digitalAccounts.length > 0
        ? `${profile.digitalAccounts.length} digital account${profile.digitalAccounts.length === 1 ? '' : 's'} recorded`
        : 'No digital accounts recorded'
    },
    {
      id: 'legacy',
      number: '12',
      title: 'Letters, Messages & Wishes',
      category: 'Digital & Legacy',
      isNotApplicable: !!na['legacy'],
      isComplete: !!na['legacy'] || (
        !!profile.legacyMemories?.familyOrigins?.trim() ||
        !!profile.legacyMemories?.lifeLessonsWisdom?.trim()
      ),
      summary: profile.legacyMemories?.familyOrigins || profile.legacyMemories?.lifeLessonsWisdom
        ? 'Personal messages recorded'
        : 'Optional family messages'
    },
    {
      id: 'history_interview',
      number: '13',
      title: 'Life Story & History Book',
      category: 'Digital & Legacy',
      isNotApplicable: !!na['history_interview'],
      isComplete: !!na['history_interview'] || (
        (profile.historyInterview ? Object.values(profile.historyInterview.entries || {}).filter(e => !!e.answer?.trim()).length + (profile.historyInterview.customQuestions || []).filter(q => !!q.answer?.trim()).length : 0) > 0
      ),
      itemCount: profile.historyInterview ? Object.values(profile.historyInterview.entries || {}).filter(e => !!e.answer?.trim()).length + (profile.historyInterview.customQuestions || []).filter(q => !!q.answer?.trim()).length : 0,
      summary: (profile.historyInterview ? Object.values(profile.historyInterview.entries || {}).filter(e => !!e.answer?.trim()).length + (profile.historyInterview.customQuestions || []).filter(q => !!q.answer?.trim()).length : 0) > 0
        ? `${profile.historyInterview ? Object.values(profile.historyInterview.entries || {}).filter(e => !!e.answer?.trim()).length + (profile.historyInterview.customQuestions || []).filter(q => !!q.answer?.trim()).length : 0} memor${(profile.historyInterview ? Object.values(profile.historyInterview.entries || {}).filter(e => !!e.answer?.trim()).length + (profile.historyInterview.customQuestions || []).filter(q => !!q.answer?.trim()).length : 0) === 1 ? 'y' : 'ies'} recorded`
        : 'Memoir interview pending'
    },
    {
      id: 'sentimental',
      number: '14',
      title: 'Sentimental Heirlooms & Pets',
      category: 'Digital & Legacy',
      isNotApplicable: !!na['sentimental'],
      isComplete: !!na['sentimental'] || (profile.sentimentalItems.length > 0 || profile.pets.length > 0),
      itemCount: profile.sentimentalItems.length + profile.pets.length,
      summary: (profile.sentimentalItems.length > 0 || profile.pets.length > 0)
        ? `${profile.sentimentalItems.length} keepsake${profile.sentimentalItems.length === 1 ? '' : 's'}, ${profile.pets.length} pet${profile.pets.length === 1 ? '' : 's'}`
        : 'No heirlooms or pets recorded'
    }
  ];

  const totalSections = sections.length;
  const completedSections = sections.filter(s => s.isComplete && !s.isNotApplicable).length;
  const skippedSections = sections.filter(s => s.isNotApplicable).length;
  const pendingSections = totalSections - completedSections - skippedSections;

  return {
    sections,
    totalSections,
    completedSections,
    skippedSections,
    pendingSections,
    hasEmergencyContact,
    hasWillLocation
  };
}

