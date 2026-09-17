import type { 
  CodeStatusPreference, 
  VentilationPreference, 
  NutritionHydrationPreference, 
  PainReliefPhilosophy, 
  TerminalCareLocation 
} from '../types';

export interface PhilosophyArchetype {
  id: 'super_hippy' | 'pragmatic_modern' | 'traditional_faith' | 'super_conservative';
  name: string;
  badge: string;
  subtitle: string;
  description: string;
  medical: {
    codeStatus: CodeStatusPreference;
    ventilationSupport: VentilationPreference;
    artificialNutritionHydration: NutritionHydrationPreference;
    painManagementPhilosophy: PainReliefPhilosophy;
    terminalCareLocationPreference: TerminalCareLocation;
    pacemakerIcdDeactivationWishes: string;
    diagnosticIntensityWishes: string;
    qualityOfLife: {
      stopIfCannotRecognizeFamily: boolean;
      stopIfCannotCommunicate: boolean;
      stopIfPermanentlyBedbound: boolean;
      stopIfPermanentComa: boolean;
      stopIfPermanentVentilator: boolean;
      stopIfIntractableSuffering: boolean;
      personalThresholdNotes: string;
    };
  };
  legal: {
    disposition: 'burial' | 'cremation' | 'donation' | 'green_burial' | 'other';
    serviceWishes: string;
    eulogyNotes: string;
  };
}

export const PHILOSOPHY_ARCHETYPES: PhilosophyArchetype[] = [
  {
    id: 'super_hippy',
    name: 'Earth-Centered & Natural',
    badge: '🌿 Super Hippy / Green',
    subtitle: 'Natural peaceful passing, zero machines, holistic comfort, and return to the earth',
    description: 'Prioritizes nature, peaceful surroundings, holistic comfort, and natural passing (DNR). No ventilators or feeding tubes. Green conservation burial or ocean/forest ash scattering with an acoustic outdoor celebration of life.',
    medical: {
      codeStatus: 'dnr_natural_death',
      ventilationSupport: 'no_intubation',
      artificialNutritionHydration: 'pleasure_eating_only',
      painManagementPhilosophy: 'comfort_first',
      terminalCareLocationPreference: 'home_hospice',
      pacemakerIcdDeactivationWishes: 'Deactivate ICD shocks immediately upon comfort care. Let my heart stop naturally.',
      diagnosticIntensityWishes: 'No routine blood draws, fingersticks, or noisy monitors. Only natural comfort measures.',
      qualityOfLife: {
        stopIfCannotRecognizeFamily: true,
        stopIfCannotCommunicate: true,
        stopIfPermanentlyBedbound: true,
        stopIfPermanentComa: true,
        stopIfPermanentVentilator: true,
        stopIfIntractableSuffering: true,
        personalThresholdNotes: 'If I can no longer enjoy the sunshine, interact with nature, or recognize my loved ones, let me go in peace with full comfort.',
      }
    },
    legal: {
      disposition: 'green_burial',
      serviceWishes: 'Outdoor celebration of life in a forest, garden, or beach. Acoustic folk music, casual potluck, storytelling, wildflowers, barefoot and joyous.',
      eulogyNotes: 'Remember me as part of the living earth. Do not mourn; plant a tree or wildflowers, walk in the woods, and cherish the love we shared.'
    }
  },
  {
    id: 'pragmatic_modern',
    name: 'Pragmatic & Family-Protective',
    badge: '⚖️ Balanced Modern',
    subtitle: 'Evidence-based trial, fast shift to comfort care, simple cremation, joyful dinner',
    description: 'Allows a brief time-limited trial of medical interventions if an acute event is reversible, but transitions quickly to comfort care if no recovery is possible. Direct cremation, joyful memorial dinner, and protecting family from guilt.',
    medical: {
      codeStatus: 'dnr_natural_death',
      ventilationSupport: 'time_limited_trial',
      artificialNutritionHydration: 'pleasure_eating_only',
      painManagementPhilosophy: 'comfort_first',
      terminalCareLocationPreference: 'home_hospice',
      pacemakerIcdDeactivationWishes: 'Deactivate ICD shocks when entering hospice or palliative care.',
      diagnosticIntensityWishes: 'Stop routine lab tests and vitals; focus solely on relieving symptoms and pain.',
      qualityOfLife: {
        stopIfCannotRecognizeFamily: true,
        stopIfCannotCommunicate: true,
        stopIfPermanentlyBedbound: false,
        stopIfPermanentComa: true,
        stopIfPermanentVentilator: true,
        stopIfIntractableSuffering: true,
        personalThresholdNotes: 'Try treating reversible conditions for 3 to 5 days. If I have severe permanent brain injury or cannot recognize my family, remove machines and keep me comfortable.',
      }
    },
    legal: {
      disposition: 'cremation',
      serviceWishes: 'Celebration of life at a favorite restaurant or park pavilion. Play my favorite rock/jazz playlist, have good food and wine, and share funny memories.',
      eulogyNotes: 'Live your lives fully and look forward. Support each other, toast to the memories, and know that I loved you all deeply.'
    }
  },
  {
    id: 'traditional_faith',
    name: 'Faith & Sacred Tradition',
    badge: '🕊️ Traditional Faith',
    subtitle: 'Sacred rites, pastoral presence, balanced pain relief, formal church funeral',
    description: 'Preserves life with reasonable medical care while avoiding futile measures when death is imminent. Requests pastoral visits, Last Rites/prayers, balanced pain management to preserve moments of spiritual lucidity, and a formal church service.',
    medical: {
      codeStatus: 'proxy_discretion',
      ventilationSupport: 'proxy_discretion',
      artificialNutritionHydration: 'trial_feeding_tube',
      painManagementPhilosophy: 'balanced_proxy',
      terminalCareLocationPreference: 'hospital_comfort',
      pacemakerIcdDeactivationWishes: 'Consult attending physician and healthcare proxy when active dying begins.',
      diagnosticIntensityWishes: 'Provide reasonable medical care; avoid unnecessary interventions that cause distress.',
      qualityOfLife: {
        stopIfCannotRecognizeFamily: false,
        stopIfCannotCommunicate: false,
        stopIfPermanentlyBedbound: false,
        stopIfPermanentComa: true,
        stopIfPermanentVentilator: true,
        stopIfIntractableSuffering: true,
        personalThresholdNotes: 'Provide ordinary medical care and spiritual comfort. Avoid futile extraordinary means when death is inevitable. Ensure pastoral clergy visits for prayers and final blessing.',
      }
    },
    legal: {
      disposition: 'burial',
      serviceWishes: 'Traditional funeral service in our church or chapel led by our pastor/clergy. Scripture readings, classic hymns, family viewing, and traditional cemetery burial.',
      eulogyNotes: 'A tribute honoring steadfast faith, commitment to family and church community, and eternal peace in the presence of God.'
    }
  },
  {
    id: 'super_conservative',
    name: 'Full Medical Intervention',
    badge: '🛡️ Super Conservative / Maximalist',
    subtitle: 'Fight to the end, explore all clinical trials, full CPR, formal traditional burial',
    description: 'Instructs medical teams to exhaust every clinical therapy, clinical trial, and advanced life-support technology. Full CPR and continuous mechanical ventilation. Formal, solemn funeral and traditional graveside committal.',
    medical: {
      codeStatus: 'cpr_full_code',
      ventilationSupport: 'indefinite_support',
      artificialNutritionHydration: 'full_artificial',
      painManagementPhilosophy: 'alertness_first',
      terminalCareLocationPreference: 'hospital_comfort',
      pacemakerIcdDeactivationWishes: 'Keep pacemaker and ICD active as long as life continues.',
      diagnosticIntensityWishes: 'Continue full monitoring, laboratory work, and intensive medical interventions.',
      qualityOfLife: {
        stopIfCannotRecognizeFamily: false,
        stopIfCannotCommunicate: false,
        stopIfPermanentlyBedbound: false,
        stopIfPermanentComa: false,
        stopIfPermanentVentilator: false,
        stopIfIntractableSuffering: false,
        personalThresholdNotes: 'Never withdraw medical life support. Continue all viable interventions, experimental therapies, and treatments to preserve life.',
      }
    },
    legal: {
      disposition: 'burial',
      serviceWishes: 'Solemn, formal funeral service with viewing/visitation, civic/military honors if eligible, formal eulogy, and graveside committal at family cemetery plot.',
      eulogyNotes: 'Honor a life defined by perseverance, duty, patriotism, self-reliance, and unyielding strength. Emphasize legacy of achievement and moral discipline.'
    }
  }
];

export const MEDICAL_STARTERS = PHILOSOPHY_ARCHETYPES.map(arch => ({
  id: arch.id,
  name: arch.name,
  badge: arch.badge,
  subtitle: arch.subtitle,
  description: arch.description,
  previewItems: [
    `Code Status: ${arch.medical.codeStatus.replace(/_/g, ' ')}`,
    `Ventilator: ${arch.medical.ventilationSupport.replace(/_/g, ' ')}`,
    `Nutrition: ${arch.medical.artificialNutritionHydration.replace(/_/g, ' ')}`,
    `Pain Relief: ${arch.medical.painManagementPhilosophy.replace(/_/g, ' ')}`
  ],
  data: {
    codeStatus: arch.medical.codeStatus,
    ventilationSupport: arch.medical.ventilationSupport,
    artificialNutritionHydration: arch.medical.artificialNutritionHydration,
    painManagementPhilosophy: arch.medical.painManagementPhilosophy,
    terminalCareLocationPreference: arch.medical.terminalCareLocationPreference,
    pacemakerIcdDeactivationWishes: arch.medical.pacemakerIcdDeactivationWishes,
    diagnosticIntensityWishes: arch.medical.diagnosticIntensityWishes,
    qualityOfLife: {
      ...arch.medical.qualityOfLife
    }
  }
}));

// Individual Chip Presets across the spectrum:
export const CODE_STATUS_PRESETS = [
  'Allow Natural Death (DNR / Comfort Only)',
  'Full Code (Attempt CPR & Electric Shocks)',
  'Proxy Discretion (Follow Physician Guidance)'
];

export const VENTILATION_PRESETS = [
  'No Breathing Tube (DNI - Natural/Comfort only)',
  'Time-Limited Trial (Try 3–5 days; withdraw if no recovery)',
  'Maintain Mechanical Breathing as long as needed',
  'Healthcare Proxy decides with ICU physicians'
];

export const NUTRITION_PRESETS = [
  'Pleasure Feeding Only (Sips/bites by mouth; no tubes/IVs)',
  'Short-Term Trial of IV Fluids only if comfort-enhancing',
  'No Feeding Tubes (PEG/G-tube) under any circumstances',
  'Full Artificial Nutrition & Hydration (Feeding tube)'
];

export const PAIN_RELIEF_PRESETS = [
  'Comfort First: Total pain/distress relief even if drowsy',
  'Alertness First: Keep clear-headed to talk with family',
  'Balanced: Discretion of hospice nurse & healthcare proxy'
];

export const TERMINAL_LOCATION_PRESETS = [
  'At Home with visiting Hospice care & family',
  'Inpatient Hospice Residence / Hospice House',
  'Hospital Palliative / Comfort Care Suite',
  'Avoid nursing home/SNF custodial placement at all costs'
];

export const POLST_LOCATION_PRESETS = [
  'Magnetized to front of kitchen refrigerator (State Standard)',
  'Mounted in yellow sleeve on back of front entry door',
  'Directly above bedroom headboard on wall',
  'Wearing state-approved DNR MedicAlert wristband'
];

export const DISPOSITION_PRESETS = [
  'Green Conservation Burial (Biodegradable shroud/wicker, no chemicals)',
  'Direct Cremation (Simple, immediate, dignified)',
  'Traditional Casket Burial in Family Cemetery Plot',
  'Whole-Body Anatomical Donation to Medical Science'
];

export const FUNERAL_SERVICE_PRESETS = [
  'Casual outdoor celebration of life (garden, park, potluck, music)',
  'Intimate family dinner at favorite restaurant with toasts',
  'Traditional church service with hymns, scripture & viewing',
  'Solemn formal chapel service with military/civic honors'
];

export const EULOGY_THEME_PRESETS = [
  'Earth & love: Remember me in nature, plant a tree, celebrate joy',
  'Pragmatic & lighthearted: Live fully, do not dwell in grief, share laughter',
  'Faith & family: Dedication to God, family heritage, and eternal peace',
  'Duty & strength: Honoring discipline, perseverance, and high standards'
];

export const ACCOUNT_TITLING_PRESETS = [
  'Joint Tenants w/ Survivorship (JTWROS - Day 1 Access)',
  'Sole Owner (Subject to Bank Probate Freeze)',
  'Held in Revocable Living Trust (Trustee Access)',
  'Payable on Death (POD / TOD Direct Transfer)'
];

export const CONTINUITY_ACTION_PRESETS = [
  'CRITICAL: Must Maintain (Power / Heat / Water)',
  'CRITICAL: Must Maintain (Homeowners Hazard Insurance)',
  'CRITICAL: Must Maintain (Mortgage / PITI Payment)',
  'CRITICAL: Keep Active 6 Months (Cell Phone for 2FA)',
  'CANCEL: Terminate Immediately (Streaming & Subscriptions)',
  'PROBATE: Settle via Estate (Solo Card / Unsecured Debt)'
];
