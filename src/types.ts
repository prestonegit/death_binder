export interface PersonalInfo {
  fullName: string;
  preferredName: string;
  dateOfBirth: string;
  currentAddress: string;
  phone: string;
  email: string;
  employer: string;
  militaryService: string;
  groupsOrganizations: string;
  notes: string;
}

export interface Contact {
  id: string;
  name: string;
  relationship: string; // e.g. Executor, Estate Attorney, CPA, Doctor, Spouse, Child
  phone: string;
  email: string;
  address?: string;
  notes: string;
}

export interface EmergencyPlan {
  primaryEmergencyContact: string;
  secondaryEmergencyContact: string;
  funeralHomePreference: string;
  hospiceOrDoctorContact: string;
  immediatePetCare: string;
  originalWillLocation: string;
  immediateAccessCodes: string; // Home entry code, safe code, or where key is hidden
  organDonationUrgentNote: string;
  criticalNotes: string; // e.g. "Do not pay debts from personal accounts before probate"
}

export interface LegalDocuments {
  willLocation: string;
  willDate: string;
  trustLocation: string;
  trustName: string;
  trustees: string;
  financialPoaLocation: string;
  financialPoaAgent: string;
  healthcareProxyLocation: string;
  healthcareProxyAgent: string;
  livingWillLocation: string;
  dnrPolstLocation: string;
  hipaaReleaseLocation: string;
  safeDepositBoxBank: string;
  safeDepositBoxLocation: string;
  safeDepositBoxKeyLocation: string;
  safeDepositBoxCoSigners: string;
  disposition: 'burial' | 'cremation' | 'donation' | 'other' | '';
  funeralHomePreference: string;
  serviceWishes: string;
  eulogyNotes: string;
  personalLettersLocation: string;
  notes: string;
}

export interface FinancialAccount {
  id: string;
  institution: string; // e.g. Chase, Vanguard, Fidelity
  accountType: string; // e.g. Checking, Savings, Brokerage, 401(k), IRA, Mortgage, Credit Card
  accountIdentifier: string; // Recommended: Last 4 digits
  beneficiaryDesignation: string; // e.g. "Primary: Spouse (100%), Contingent: Children"
  website: string;
  notes: string; // e.g. "Direct deposit destination", "Joint account"
}

export interface RecurringPayment {
  id: string;
  name: string; // e.g. Electric Utility, Netflix, Auto Loan, Health Insurance
  category: 'utility' | 'subscription' | 'loan_debt' | 'insurance_premium' | 'membership' | 'other';
  estimatedAmount: string;
  billingCycle: 'monthly' | 'annual' | 'quarterly' | 'other';
  autoPaySource: string; // e.g. "Auto-debit from Chase checking ...4812"
  cancellationInstructions: string;
  notes: string;
}

export interface Asset {
  id: string;
  description: string; // e.g. "Main House", "2020 Subaru Outback", "Fireproof Home Safe"
  category: 'real_estate' | 'vehicle' | 'valuable' | 'safe_storage' | 'business_interest' | 'other';
  location: string;
  titleHolder: string; // e.g. "Joint Tenancy with Right of Survivorship", "Revocable Living Trust"
  estimatedValue: string;
  notes: string; // Safe combination, key location, title deed location
}

export interface InsurancePolicy {
  id: string;
  provider: string;
  policyType: 'life' | 'health' | 'auto' | 'homeowners' | 'umbrella' | 'disability' | 'long_term_care' | 'other';
  policyNumber: string;
  coverageAmount: string;
  beneficiaries: string;
  contactNumber: string;
  agentContact: string;
  notes: string;
}

export interface MedicalProfile {
  bloodType: string;
  allergies: string;
  conditions: string; // Chronic conditions
  medications: string;
  primaryPhysician: string;
  specialists: string;
  preferredHospital: string;
  organDonor: 'yes' | 'no' | 'undecided';
  notes: string;
}

export interface DigitalAccount {
  id: string;
  platform: string; // e.g. Apple ID, Google Account, 1Password, Bitwarden
  category: 'cloud_storage' | 'email' | 'password_manager' | 'hardware_2fa' | 'social_media' | 'financial_crypto' | 'device_passcode' | 'other';
  username: string;
  recoveryEmailPhone: string;
  legacyContactConfigured: boolean; // Configured Apple Legacy Contact / Google Inactive Account
  digitalExecutor: string; // Designated individual under RUFADAA
  rufadaaDirectives: string; // Specific instruction (e.g. download photos then delete, memorialize)
  hardwareKeyLocation: string; // Location of Yubikey or emergency kit
  notes: string;
}

export interface TaxVitalRecords {
  taxReturnsLocation: string; // e.g. "Last 3 years filed 1040s in bottom desk drawer"
  cpaAccountantContact: string;
  socialSecurityCardLocation: string;
  birthCertificateLocation: string;
  marriageCertificateLocation: string;
  militaryDd214Location: string; // Essential for VA burial benefits
  passportsLocation: string;
  vehicleTitlesLocation: string;
  propertyDeedsLocation: string;
  notes: string;
}

export interface LegacyMemories {
  familyOrigins: string;
  traditionsRecipes: string;
  lifeLessonsWisdom: string;
  bucketListCompleted: string;
  bucketListFuture: string;
  notes: string;
}

export interface SentimentalItem {
  id: string;
  description: string;
  significance: string;
  recipient: string;
  location: string;
  notes: string;
}

export interface PetCare {
  id: string;
  petName: string;
  typeBreed: string;
  vetContact: string;
  careInstructions: string;
  microchipInfo: string;
  designatedGuardian: string;
  foodMedicationSchedule: string;
  notes: string;
}

export interface ProfileData {
  profileName: string; // e.g. "Primary Binder", "Spouse's Packet"
  notApplicableSections?: Record<string, boolean>; // e.g. { pets: true, recurring: false }
  emergencyPlan: EmergencyPlan;
  personalInfo: PersonalInfo;
  contacts: Contact[];
  legalDocuments: LegalDocuments;
  financialAccounts: FinancialAccount[];
  recurringPayments: RecurringPayment[];
  assets: Asset[];
  insurancePolicies: InsurancePolicy[];
  medicalProfile: MedicalProfile;
  digitalAccounts: DigitalAccount[];
  taxVitalRecords: TaxVitalRecords;
  legacyMemories: LegacyMemories;
  sentimentalItems: SentimentalItem[];
  pets: PetCare[];
}

export interface LegacyBinderData {
  version: number;
  lastUpdated: string;
  profiles: {
    primary: ProfileData;
    secondary: ProfileData;
    [key: string]: ProfileData;
  };
}

