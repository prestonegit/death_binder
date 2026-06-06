export interface PersonalInfo {
  fullName: string;
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
  relationship: string; // e.g. Spouse, Child, Executor, Attorney, Doctor
  phone: string;
  email: string;
  notes: string;
}

export interface FinancialAccount {
  id: string;
  institution: string; // e.g. Chase Bank, Vanguard
  accountType: string; // e.g. Checking, Brokerage, Credit Card, Mortgage
  accountIdentifier: string; // e.g. Last 4 digits (highly recommended over full number)
  website: string;
  notes: string; // e.g. "Auto-pay on 5th", "Joint account"
}

export interface Asset {
  id: string;
  description: string; // e.g. "Main House", "2018 Honda Civic", "Fireproof safe in closet"
  category: 'real_estate' | 'vehicle' | 'valuable' | 'safe_storage' | 'other';
  location: string;
  titleHolder: string;
  estimatedValue: string;
  notes: string; // e.g. "Key is in master bedroom desk drawer", "Safe code is 1234"
}

export interface InsurancePolicy {
  id: string;
  provider: string;
  policyType: string; // e.g. Life, Health, Auto, Homeowners
  policyNumber: string;
  coverageAmount: string;
  beneficiaries: string;
  contactNumber: string;
  notes: string;
}

export interface MedicalProfile {
  bloodType: string;
  allergies: string;
  conditions: string; // Chronic conditions
  medications: string;
  primaryPhysician: string;
  livingWillLocation: string;
  organDonor: 'yes' | 'no' | 'undecided';
  notes: string;
}

export interface DigitalAccount {
  id: string;
  platform: string; // e.g. Google, Facebook, iCloud, 1Password
  username: string;
  recoveryEmailPhone: string;
  digitalExecutor: string; // Who should handle this account
  notes: string; // e.g. "Request memorialization", "Close account"
}

export interface FinalArrangements {
  willLocation: string;
  trustLocation: string;
  powerOfAttorneyLocation: string;
  funeralHomePreference: string;
  disposition: 'burial' | 'cremation' | 'donation' | 'other' | '';
  serviceWishes: string; // Music, readings, guests
  eulogyNotes: string;
  personalLettersLocation: string;
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
  notes: string;
}

export interface PetCare {
  id: string;
  petName: string;
  typeBreed: string;
  vetContact: string;
  careInstructions: string;
  designatedGuardian: string;
  notes: string;
}

export interface ProfileData {
  profileName: string; // e.g. "John Doe" or "Wife's Packet"
  personalInfo: PersonalInfo;
  contacts: Contact[];
  financialAccounts: FinancialAccount[];
  assets: Asset[];
  insurancePolicies: InsurancePolicy[];
  medicalProfile: MedicalProfile;
  digitalAccounts: DigitalAccount[];
  finalArrangements: FinalArrangements;
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
  };
}
