import type { 
  LegacyBinderData, 
  ProfileData, 
  PersonalInfo, 
  EmergencyPlan,
  LegalDocuments, 
  MedicalProfile, 
  TaxVitalRecords, 
  LegacyMemories 
} from '../types';

export const createEmptyPersonalInfo = (): PersonalInfo => ({
  fullName: '',
  preferredName: '',
  dateOfBirth: '',
  currentAddress: '',
  phone: '',
  email: '',
  employer: '',
  militaryService: '',
  groupsOrganizations: '',
  notes: '',
});

export const createEmptyEmergencyPlan = (): EmergencyPlan => ({
  primaryEmergencyContact: '',
  secondaryEmergencyContact: '',
  funeralHomePreference: '',
  hospiceOrDoctorContact: '',
  immediatePetCare: '',
  originalWillLocation: '',
  immediateAccessCodes: '',
  organDonationUrgentNote: '',
  criticalNotes: 'Do not pay outstanding debts or credit cards with personal funds prior to probate/estate counsel guidance.',
});

export const createEmptyLegalDocuments = (): LegalDocuments => ({
  willLocation: '',
  willDate: '',
  trustLocation: '',
  trustName: '',
  trustees: '',
  financialPoaLocation: '',
  financialPoaAgent: '',
  healthcareProxyLocation: '',
  healthcareProxyAgent: '',
  livingWillLocation: '',
  dnrPolstLocation: '',
  hipaaReleaseLocation: '',
  safeDepositBoxBank: '',
  safeDepositBoxLocation: '',
  safeDepositBoxKeyLocation: '',
  safeDepositBoxCoSigners: '',
  disposition: '',
  funeralHomePreference: '',
  serviceWishes: '',
  eulogyNotes: '',
  personalLettersLocation: '',
  notes: '',
});

export const createEmptyMedicalProfile = (): MedicalProfile => ({
  bloodType: '',
  allergies: '',
  conditions: '',
  medications: '',
  primaryPhysician: '',
  specialists: '',
  preferredHospital: '',
  organDonor: 'undecided',
  notes: '',
});

export const createEmptyTaxVitalRecords = (): TaxVitalRecords => ({
  taxReturnsLocation: '',
  cpaAccountantContact: '',
  socialSecurityCardLocation: '',
  birthCertificateLocation: '',
  marriageCertificateLocation: '',
  militaryDd214Location: '',
  passportsLocation: '',
  vehicleTitlesLocation: '',
  propertyDeedsLocation: '',
  notes: '',
});

export const createEmptyLegacyMemories = (): LegacyMemories => ({
  familyOrigins: '',
  traditionsRecipes: '',
  lifeLessonsWisdom: '',
  bucketListCompleted: '',
  bucketListFuture: '',
  notes: '',
});

export const createEmptyProfile = (name: string): ProfileData => ({
  profileName: name,
  notApplicableSections: {},
  emergencyPlan: createEmptyEmergencyPlan(),
  personalInfo: createEmptyPersonalInfo(),
  contacts: [
    { id: 'c1', name: '', relationship: 'Executor of Will', phone: '', email: '', notes: '' },
    { id: 'c2', name: '', relationship: 'Estate Attorney', phone: '', email: '', notes: '' },
    { id: 'c3', name: '', relationship: 'Healthcare Proxy', phone: '', email: '', notes: '' }
  ],
  legalDocuments: createEmptyLegalDocuments(),
  financialAccounts: [],
  recurringPayments: [],
  assets: [],
  insurancePolicies: [],
  medicalProfile: createEmptyMedicalProfile(),
  digitalAccounts: [],
  taxVitalRecords: createEmptyTaxVitalRecords(),
  legacyMemories: createEmptyLegacyMemories(),
  sentimentalItems: [],
  pets: []
});

export const DEFAULT_BINDER_DATA: LegacyBinderData = {
  version: 2,
  lastUpdated: new Date().toISOString().split('T')[0],
  profiles: {
    primary: createEmptyProfile('My Packet'),
    secondary: createEmptyProfile("Spouse's Packet")
  }
};

/**
 * Migrates any previous version (v1 or untyped) to current v2 format safely
 */
export function migrateBinderData(raw: unknown): LegacyBinderData {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_BINDER_DATA;
  }

  const data = raw as Record<string, unknown>;
  const rawProfiles = (data.profiles && typeof data.profiles === 'object') ? (data.profiles as Record<string, unknown>) : {};

  const migratedProfiles: Record<string, ProfileData> = {};

  const profileKeys = Object.keys(rawProfiles);
  const keysToProcess = profileKeys.length > 0 ? profileKeys : ['primary', 'secondary'];

  for (const key of keysToProcess) {
    const p = (rawProfiles[key] || {}) as Record<string, unknown>;
    const defaultName = key === 'primary' ? 'My Packet' : key === 'secondary' ? "Spouse's Packet" : 'Family Packet';
    
    // Migrate finalArrangements to legalDocuments if v1
    const v1Arrangements = (p.finalArrangements || {}) as Record<string, string>;
    const existingLegal = (p.legalDocuments || {}) as Record<string, string>;

    const legalDocs: LegalDocuments = {
      ...createEmptyLegalDocuments(),
      ...existingLegal,
      willLocation: existingLegal.willLocation || v1Arrangements.willLocation || '',
      trustLocation: existingLegal.trustLocation || v1Arrangements.trustLocation || '',
      financialPoaLocation: existingLegal.financialPoaLocation || v1Arrangements.powerOfAttorneyLocation || '',
      funeralHomePreference: existingLegal.funeralHomePreference || v1Arrangements.funeralHomePreference || '',
      disposition: (existingLegal.disposition || v1Arrangements.disposition || '') as LegalDocuments['disposition'],
      serviceWishes: existingLegal.serviceWishes || v1Arrangements.serviceWishes || '',
      eulogyNotes: existingLegal.eulogyNotes || v1Arrangements.eulogyNotes || '',
      personalLettersLocation: existingLegal.personalLettersLocation || v1Arrangements.personalLettersLocation || '',
      notes: existingLegal.notes || v1Arrangements.notes || '',
    };

    // Migrate contacts
    const rawContacts = Array.isArray(p.contacts) ? p.contacts : [];

    // Migrate emergency plan
    const existingEmergency = (p.emergencyPlan || {}) as Record<string, string>;
    const primaryContact = rawContacts.find((c: unknown) => {
      const contact = c as Record<string, string>;
      return contact?.relationship?.toLowerCase().includes('executor') || contact?.name;
    }) as Record<string, string> | undefined;

    const emergencyPlan: EmergencyPlan = {
      ...createEmptyEmergencyPlan(),
      ...existingEmergency,
      primaryEmergencyContact: existingEmergency.primaryEmergencyContact || (primaryContact ? `${primaryContact.name} (${primaryContact.phone || primaryContact.relationship || ''})` : ''),
      funeralHomePreference: existingEmergency.funeralHomePreference || legalDocs.funeralHomePreference || '',
      originalWillLocation: existingEmergency.originalWillLocation || legalDocs.willLocation || '',
    };

    migratedProfiles[key] = {
      profileName: typeof p.profileName === 'string' && p.profileName.trim() ? p.profileName : defaultName,
      notApplicableSections: (p.notApplicableSections && typeof p.notApplicableSections === 'object') ? (p.notApplicableSections as Record<string, boolean>) : {},
      emergencyPlan,
      personalInfo: {
        ...createEmptyPersonalInfo(),
        ...(typeof p.personalInfo === 'object' ? (p.personalInfo as Record<string, string>) : {})
      },
      contacts: rawContacts.map((c: unknown, idx: number) => {
        const contact = (c || {}) as Record<string, string>;
        return {
          id: contact.id || `c_${idx}_${Date.now()}`,
          name: contact.name || '',
          relationship: contact.relationship || '',
          phone: contact.phone || '',
          email: contact.email || '',
          address: contact.address || '',
          notes: contact.notes || '',
        };
      }),
      legalDocuments: legalDocs,
      financialAccounts: Array.isArray(p.financialAccounts) ? p.financialAccounts : [],
      recurringPayments: Array.isArray(p.recurringPayments) ? p.recurringPayments : [],
      assets: Array.isArray(p.assets) ? p.assets : [],
      insurancePolicies: Array.isArray(p.insurancePolicies) ? p.insurancePolicies : [],
      medicalProfile: {
        ...createEmptyMedicalProfile(),
        ...(typeof p.medicalProfile === 'object' ? (p.medicalProfile as Record<string, string>) : {})
      },
      digitalAccounts: Array.isArray(p.digitalAccounts) ? p.digitalAccounts : [],
      taxVitalRecords: {
        ...createEmptyTaxVitalRecords(),
        ...(typeof p.taxVitalRecords === 'object' ? (p.taxVitalRecords as Record<string, string>) : {})
      },
      legacyMemories: {
        ...createEmptyLegacyMemories(),
        ...(typeof p.legacyMemories === 'object' ? (p.legacyMemories as Record<string, string>) : {})
      },
      sentimentalItems: Array.isArray(p.sentimentalItems) ? p.sentimentalItems : [],
      pets: Array.isArray(p.pets) ? p.pets : []
    };
  }

  // Ensure primary and secondary always exist
  if (!migratedProfiles.primary) {
    migratedProfiles.primary = createEmptyProfile('My Packet');
  }
  if (!migratedProfiles.secondary) {
    migratedProfiles.secondary = createEmptyProfile("Spouse's Packet");
  }

  return {
    version: 2,
    lastUpdated: typeof data.lastUpdated === 'string' ? data.lastUpdated : new Date().toISOString().split('T')[0],
    profiles: migratedProfiles as LegacyBinderData['profiles']
  };
}
