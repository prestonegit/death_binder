import type {
  LegalDocuments,
  FinancialAccount,
  DigitalAccount,
  LegacyMemories,
  EmergencyPlan,
  RecurringPayment,
  Contact
} from '../types';

export interface SectionStarterArchetype<T> {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  description: string;
  previewItems?: string[];
  data: T;
}

// -------------------------------------------------------------
// 1. LEGAL & ESTATE DIRECTIVES STARTERS
// -------------------------------------------------------------
export const LEGAL_STARTERS: SectionStarterArchetype<Partial<LegalDocuments>>[] = [
  {
    id: 'simple_will',
    name: 'Simple Will & Direct Estate',
    badge: '📜 Simple Will & POA',
    subtitle: 'Original Will in home safe, named executor, durable POAs, and direct cremation',
    description: 'A standard foundational estate plan for straightforward estates. Directs assets through an original signed Last Will, names durable financial and healthcare agents, and specifies direct cremation with an intimate celebration of life.',
    previewItems: [
      'Original Will located in Home Fireproof Safe',
      'Durable Financial POA & Healthcare Proxy designated',
      'Direct Cremation with casual celebration of life',
      'Standalone HIPAA release authorized for immediate family'
    ],
    data: {
      willLocation: 'Home fireproof safe (Master bedroom closet shelf)',
      willDate: '',
      financialPoaLocation: 'Home fireproof safe (with Original Will)',
      financialPoaAgent: 'Spouse or Primary Executor',
      financialPoaAlternate: 'Adult Child or Trusted Sibling',
      healthcareProxyLocation: 'Home fireproof safe & copy on file with primary doctor',
      healthcareProxyAgent: 'Spouse or Primary Decision Maker',
      healthcareProxyAlternate: 'Adult Child or Trusted Friend',
      livingWillLocation: 'Home fireproof safe',
      hipaaReleaseLocation: 'Home fireproof safe & with primary clinic',
      hipaaAuthorizedAgents: 'Healthcare Proxy & Immediate Family',
      disposition: 'cremation',
      serviceWishes: 'Simple family gathering or celebration of life at home/park with close friends, good food, and favorite music.',
      eulogyNotes: 'Celebrate a life of honesty, quiet generosity, and devotion to family. Keep it warm and lighthearted.'
    }
  },
  {
    id: 'living_trust',
    name: 'Revocable Living Trust & Homeowner',
    badge: '🏡 Living Trust & Pour-Over',
    subtitle: 'Probate avoidance: Living trust, pour-over will, successor trustee, deed in trust',
    description: 'Designed for homeowners and families wanting to avoid costly, lengthy public probate court. Directs real property and accounts into a Revocable Living Trust with named successor trustees.',
    previewItems: [
      'Revocable Living Trust with Pour-Over Will in safe',
      'Successor Trustee designated for immediate control',
      'Bank safe deposit box registered with trust co-signers',
      'Memorial service celebration at family home or hall'
    ],
    data: {
      willLocation: 'Home fireproof safe (Pour-Over Will)',
      trustName: 'The Family Revocable Living Trust',
      trustees: 'Grantor (Self); Successor Trustee: Designated Adult Child or Professional Fiduciary',
      trustLocation: 'Home fireproof safe & Attorney office master binder',
      financialPoaLocation: 'Home fireproof safe (Durable Financial POA)',
      financialPoaAgent: 'Successor Trustee / Spouse',
      financialPoaAlternate: 'Alternate Successor Trustee',
      healthcareProxyLocation: 'Home fireproof safe & Hospital EHR Registry',
      healthcareProxyAgent: 'Spouse or Primary Health Agent',
      healthcareProxyAlternate: 'Designated Adult Child',
      livingWillLocation: 'Home fireproof safe',
      hipaaReleaseLocation: 'Home fireproof safe & Patient Portal',
      hipaaAuthorizedAgents: 'Successor Trustees & Healthcare Proxy',
      safeDepositBoxBank: 'Primary Local Bank / Credit Union',
      safeDepositBoxLocation: 'Main Branch Safe Deposit Vault',
      safeDepositBoxKeyLocation: 'Primary key on master keychain; duplicate in home safe',
      safeDepositBoxCoSigners: 'Successor Trustee registered on bank access card',
      disposition: 'cremation',
      serviceWishes: 'Celebration of life at community hall or family home with toasts, storytelling, and shared memories.',
      eulogyNotes: 'Emphasize family heritage, values passed down through generations, and gratitude for our shared journey.'
    }
  },
  {
    id: 'young_family',
    name: 'Young Family & Minor Children',
    badge: '🧸 Young Family & Guardians',
    subtitle: 'Protect minor children: Named legal guardians, term life trust, and pediatric consents',
    description: 'Prioritizes legal guardian designation for minor children, emergency temporary caregiver powers, life insurance trust instructions, and durable health directives for young parents.',
    previewItems: [
      'Will naming primary & alternate guardians for minor children',
      'Term life insurance and educational trust instructions',
      'Durable POAs authorizing pediatric and household decisions',
      'Family memorial service centered on love and comfort'
    ],
    data: {
      willLocation: 'Home fireproof safe & digital PDF copy with named Guardians',
      willDate: '',
      financialPoaLocation: 'Home fireproof safe (Durable Financial POA)',
      financialPoaAgent: 'Surviving Spouse; Alternate: Named Guardian / Trustee',
      financialPoaAlternate: 'Designated Sibling or Trust Company',
      healthcareProxyLocation: 'Home fireproof safe',
      healthcareProxyAgent: 'Surviving Spouse; Alternate: Trusted Sibling',
      healthcareProxyAlternate: 'Named Guardian',
      livingWillLocation: 'Home fireproof safe',
      hipaaReleaseLocation: 'Home fireproof safe',
      hipaaAuthorizedAgents: 'Spouse and Named Guardians',
      disposition: 'burial',
      serviceWishes: 'Family memorial service with focus on love, comforting our children, and celebrating joyful memories together.',
      eulogyNotes: 'Emphasize deep devotion to our children, warmth, endless encouragement, and optimism for their future.'
    }
  },
  {
    id: 'solo_ager',
    name: 'Solo Ager & Independent Network',
    badge: '🛡️ Solo Ager & Independent',
    subtitle: 'No direct heirs: Professional or trusted friend fiduciary, clear HIPAA, donation wishes',
    description: 'Tailored for single adults, widowers, or individuals without immediate descendants. Appoints a trusted friend or professional fiduciary, authorizes standalone HIPAA disclosures, and details anatomical or charity disposition.',
    previewItems: [
      'Professional fiduciary or trusted friend named in Will',
      'Standalone HIPAA release registered with all clinics',
      'Whole-body donation or direct cremation with scatter garden',
      'Informal celebration of life with dear friends'
    ],
    data: {
      willLocation: 'Estate Attorney Office & Home Lockbox',
      financialPoaLocation: 'With Designated Fiduciary & Bank Legal Dept',
      financialPoaAgent: 'Trusted Friend or Professional Fiduciary',
      financialPoaAlternate: 'Licensed Estate Attorney or Trust Company',
      healthcareProxyLocation: 'On file with Primary Health Network & Advance Directive Registry',
      healthcareProxyAgent: 'Trusted Friend or Patient Advocate',
      livingWillLocation: 'With Primary Care Physician & Advance Directive Registry',
      hipaaReleaseLocation: 'Signed standalone HIPAA on file with all treating clinics',
      hipaaAuthorizedAgents: 'Designated Healthcare Advocate & Close Friend',
      disposition: 'donation',
      dispositionBackupPlan: 'Direct cremation with scatter garden placement if donation ineligible',
      designatedDispositionAgent: 'Named Healthcare Agent / Trusted Friend',
      serviceWishes: 'No solemn formal funeral; an informal gathering of dear friends at a favorite restaurant or garden to share stories.',
      eulogyNotes: 'Celebration of independence, intellectual curiosity, lifelong friendships, and giving back to the community.'
    }
  }
];

// -------------------------------------------------------------
// 2. FINANCIAL ACCOUNTS STARTERS
// -------------------------------------------------------------
export const FINANCIAL_STARTERS: SectionStarterArchetype<FinancialAccount[]>[] = [
  {
    id: 'household_family',
    name: 'Everyday Household Foundation',
    badge: '💼 Everyday Family Baseline',
    subtitle: 'Joint checking for day-1 liquidity, emergency savings with POD, 401(k), and credit card',
    description: 'A standard 4-account foundation for a working household: Joint checking providing immediate Day 1 cash flow, high-yield emergency savings payable on death to spouse, employer retirement 401(k), and primary credit card.',
    previewItems: [
      'Joint Checking (JTWROS) for immediate mortuary & bill liquidity',
      'High-Yield Savings with POD beneficiary designation',
      'Employer 401(k) / 403(b) retirement account',
      'Primary household credit card with auto-pay note'
    ],
    data: [
      {
        id: 'f_init_1',
        institution: 'Primary Bank (e.g. Chase / Bank of America / Credit Union)',
        accountType: 'Checking Account',
        accountIdentifier: '•••• 1234',
        ownershipType: 'jtwros',
        immediateLiquidityAccess: true,
        beneficiaryDesignation: 'Joint Tenants w/ Survivorship (Surviving spouse Day 1 access)',
        cardholderRole: 'joint_co_borrower',
        website: '',
        notes: 'Primary household operating account. Direct deposit and auto-bill pay source. Surviving co-owner has immediate access.'
      },
      {
        id: 'f_init_2',
        institution: 'Online High-Yield Savings (e.g. Ally / Marcus / Capital One)',
        accountType: 'Savings Account',
        accountIdentifier: '•••• 5678',
        ownershipType: 'sole',
        immediateLiquidityAccess: false,
        beneficiaryDesignation: 'Primary: Spouse (100%), Contingent: Children equally (POD)',
        primaryBeneficiary: 'Spouse (100%)',
        contingentBeneficiary: 'Children in equal shares',
        website: '',
        notes: 'Emergency cash reserve. Registered with Payable on Death (POD) beneficiary designation for rapid transfer.'
      },
      {
        id: 'f_init_3',
        institution: 'Employer 401(k) (e.g. Fidelity / Vanguard / Empower)',
        accountType: '401(k) / 403(b) Retirement',
        accountIdentifier: '•••• 9012',
        ownershipType: 'sole',
        immediateLiquidityAccess: false,
        beneficiaryDesignation: 'Primary: Spouse (100%), Contingent: Children (50/50)',
        primaryBeneficiary: 'Spouse (100%)',
        contingentBeneficiary: 'Children (50/50)',
        website: '',
        notes: 'Employer retirement plan. Claims bypass probate directly to named beneficiaries upon submission of certified death certificate.'
      },
      {
        id: 'f_init_4',
        institution: 'Primary Rewards Credit Card (e.g. Chase / Citi / Amex)',
        accountType: 'Credit Card',
        accountIdentifier: '•••• 3456',
        ownershipType: 'sole',
        immediateLiquidityAccess: false,
        beneficiaryDesignation: 'N/A - Unsecured debt',
        cardholderRole: 'primary',
        website: '',
        notes: 'Auto-paid in full monthly from checking. Reminder: Authorized user cards freeze immediately when bank learns of primary cardholder death.'
      }
    ]
  },
  {
    id: 'retiree_preservation',
    name: 'Retiree & Wealth Preservation',
    badge: '🌾 Retiree / Fixed Income',
    subtitle: 'JTWROS credit union, Traditional IRA with RMDs, taxable index brokerage, credit card',
    description: 'Structured for retirees and wealth preservation: Joint checking for pension/Social Security direct deposits, Traditional/Roth IRA with primary & contingent beneficiaries, taxable brokerage, and joint credit card.',
    previewItems: [
      'Credit Union Checking with pension / Social Security deposits',
      'Traditional / Roth IRA with structured RMD and beneficiaries',
      'Taxable Brokerage Portfolio with step-up in basis',
      'Joint co-borrower credit card for credit continuity'
    ],
    data: [
      {
        id: 'f_ret_1',
        institution: 'Local Credit Union / Community Bank',
        accountType: 'Checking Account',
        accountIdentifier: '•••• 4321',
        ownershipType: 'jtwros',
        immediateLiquidityAccess: true,
        beneficiaryDesignation: 'Joint Tenancy with Right of Survivorship (JTWROS)',
        cardholderRole: 'joint_co_borrower',
        website: '',
        notes: 'Social Security and pension direct deposit destination. Day 1 immediate liquidity for surviving co-owner.'
      },
      {
        id: 'f_ret_2',
        institution: 'Vanguard / Charles Schwab IRA',
        accountType: 'Traditional / Roth IRA',
        accountIdentifier: '•••• 8765',
        ownershipType: 'sole',
        immediateLiquidityAccess: false,
        beneficiaryDesignation: 'Primary: Spouse (100%), Contingent: Children in equal shares',
        primaryBeneficiary: 'Spouse (100%)',
        contingentBeneficiary: 'Children in equal shares',
        website: '',
        notes: 'Subject to annual Required Minimum Distributions (RMD). Designated beneficiaries claim directly without probate.'
      },
      {
        id: 'f_ret_3',
        institution: 'Brokerage Investment Portfolio (Fidelity / Schwab)',
        accountType: 'Brokerage / Investment',
        accountIdentifier: '•••• 2109',
        ownershipType: 'jtwros',
        immediateLiquidityAccess: true,
        beneficiaryDesignation: 'JTWROS w/ Survivorship; TOD to Heirs',
        website: '',
        notes: 'Dividend and index fund portfolio. Surviving joint owner receives step-up in cost basis upon passing.'
      },
      {
        id: 'f_ret_4',
        institution: 'Joint Visa / Mastercard',
        accountType: 'Credit Card',
        accountIdentifier: '•••• 6543',
        ownershipType: 'jtwros',
        immediateLiquidityAccess: true,
        beneficiaryDesignation: 'Joint Co-Borrower Liability',
        cardholderRole: 'joint_co_borrower',
        website: '',
        notes: 'Joint co-borrower account ensures surviving spouse credit rating and payment history remain active.'
      }
    ]
  },
  {
    id: 'modern_digital',
    name: 'Modern Digital & Index Investor',
    badge: '⚡ Modern Digital & Tech-Forward',
    subtitle: 'Online high-yield savings (POD), low-cost index brokerage, Roth IRA, and rewards card',
    description: 'Optimized for digital-first individuals using online banks and fintech brokerages: Online checking, HYSA with clear Payable on Death (POD) designation, Roth IRA, and index investment brokerage.',
    previewItems: [
      'Online Checking with automated bill pay',
      'High-Yield Savings with registered POD beneficiary',
      'Roth IRA with named heir for tax-free transfer',
      'Index Fund Brokerage with Transfer on Death (TOD)'
    ],
    data: [
      {
        id: 'f_dig_1',
        institution: 'Online Bank (e.g. Schwab / Ally / SoFi)',
        accountType: 'Checking Account',
        accountIdentifier: '•••• 7890',
        ownershipType: 'sole',
        immediateLiquidityAccess: false,
        beneficiaryDesignation: 'Payable on Death (POD) registered in online banking',
        website: '',
        notes: 'Daily operating checking. Direct deposit destination and auto-pay funding source.'
      },
      {
        id: 'f_dig_2',
        institution: 'High-Yield Online Savings (e.g. Marcus / Capital One / Wealthfront)',
        accountType: 'Savings Account',
        accountIdentifier: '•••• 2345',
        ownershipType: 'sole',
        immediateLiquidityAccess: false,
        beneficiaryDesignation: 'Primary: Designated Partner/Heir (100% POD)',
        website: '',
        notes: 'Emergency cash cushion. POD beneficiary claims funds upon submitting death certificate.'
      },
      {
        id: 'f_dig_3',
        institution: 'Roth IRA (Fidelity / Vanguard / Schwab)',
        accountType: 'Traditional / Roth IRA',
        accountIdentifier: '•••• 6789',
        ownershipType: 'sole',
        immediateLiquidityAccess: false,
        beneficiaryDesignation: 'Primary: Designated Heir (100%)',
        website: '',
        notes: 'Tax-free growth account. Inherited Roth IRA rules apply (10-year distribution window for non-spouses).'
      },
      {
        id: 'f_dig_4',
        institution: 'Low-Cost Index Brokerage (Vanguard / Fidelity)',
        accountType: 'Brokerage / Investment',
        accountIdentifier: '•••• 0123',
        ownershipType: 'sole',
        immediateLiquidityAccess: false,
        beneficiaryDesignation: 'Transfer on Death (TOD) registered online',
        website: '',
        notes: 'S&P 500 / Total Market index funds. TOD designation bypasses probate proceedings.'
      }
    ]
  },
  {
    id: 'trust_funded',
    name: 'Trust-Centric Portfolio',
    badge: '🏛️ Trust-Titled Portfolio',
    subtitle: 'Trust checking, trust brokerage, retirement accounts with named human beneficiaries',
    description: 'Designed for estates utilizing a Revocable Living Trust: Non-retirement accounts are titled in the name of the Trust so successor trustees take immediate legal signing authority without probate delay.',
    previewItems: [
      'Checking Account titled to Revocable Living Trust',
      'Brokerage Portfolio held in Revocable Living Trust',
      'Retirement IRA with individual human beneficiaries',
      'Trustee immediate management authority'
    ],
    data: [
      {
        id: 'f_tru_1',
        institution: 'Commercial Bank Trust Checking',
        accountType: 'Checking Account',
        accountIdentifier: '•••• 9988',
        ownershipType: 'revocable_trust',
        immediateLiquidityAccess: true,
        beneficiaryDesignation: 'Titled: [Family Name] Revocable Living Trust',
        website: '',
        notes: 'Titled in name of Living Trust. Successor Trustee assumes immediate signing power upon presenting death certificate and Acceptance of Trusteeship.'
      },
      {
        id: 'f_tru_2',
        institution: 'Trust Brokerage (Charles Schwab / Fidelity)',
        accountType: 'Brokerage / Investment',
        accountIdentifier: '•••• 7766',
        ownershipType: 'revocable_trust',
        immediateLiquidityAccess: true,
        beneficiaryDesignation: 'Titled: [Family Name] Revocable Living Trust',
        website: '',
        notes: 'All taxable equity and fixed-income assets held in Trust. Bypasses probate court entirely.'
      },
      {
        id: 'f_tru_3',
        institution: 'Retirement IRA (Individual Name)',
        accountType: 'Traditional / Roth IRA',
        accountIdentifier: '•••• 5544',
        ownershipType: 'sole',
        immediateLiquidityAccess: false,
        beneficiaryDesignation: 'Primary: Surviving Spouse (100%); Contingent: Children equally',
        website: '',
        notes: 'Retirement accounts must remain in individual name during life. Named human beneficiaries qualify for standard rollover/stretch provisions.'
      }
    ]
  }
];

// -------------------------------------------------------------
// 3. DIGITAL LIFE & PASSWORDS STARTERS
// -------------------------------------------------------------
export const DIGITAL_STARTERS: SectionStarterArchetype<DigitalAccount[]>[] = [
  {
    id: 'apple_ecosystem',
    name: 'Apple Ecosystem Centric',
    badge: '🍎 Apple Ecosystem',
    subtitle: 'Apple ID & iCloud Legacy Contact, Apple Keychain / 1Password, iPhone lock passcode',
    description: 'Tailored for users whose digital life revolves around iPhone, iPad, Mac, and iCloud. Sets up Apple Legacy Contact instructions, password vault storage, and phone lock screen access for two-factor SMS codes.',
    previewItems: [
      'Apple ID & iCloud with configured Legacy Contact access',
      'Password Manager Vault with printed emergency kit in safe',
      'iPhone Lock Screen passcode recorded for executor 2FA',
      'Primary Email Hub for account recovery'
    ],
    data: [
      {
        id: 'd_app_1',
        platform: 'Apple ID & iCloud (Photos & Backup)',
        category: 'cloud_storage',
        username: 'me@icloud.com',
        recoveryEmailPhone: 'Primary mobile number',
        legacyContactConfigured: true,
        digitalExecutor: 'Spouse or Primary Executor',
        rufadaaDirectives: 'Configured Apple Legacy Contact in iPhone Settings > Apple ID > Sign-In & Security > Legacy Contact. Access key printed and stored in home safe.',
        hardwareKeyLocation: 'Apple Legacy Access Key printed in safe; iPhone master passcode',
        notes: 'Allows designated contact to request access to photos, notes, and device backups after death with certificate.'
      },
      {
        id: 'd_app_2',
        platform: 'Apple Passwords / 1Password Master Vault',
        category: 'password_manager',
        username: 'Vault Master Account',
        recoveryEmailPhone: 'Primary email address',
        legacyContactConfigured: false,
        digitalExecutor: 'Primary Executor',
        rufadaaDirectives: 'Export password vault to secure file; transfer financial logins to estate executor.',
        hardwareKeyLocation: 'Master Emergency Kit printed on paper in home fireproof safe',
        notes: 'Contains all website logins, security question answers, and software license keys.'
      },
      {
        id: 'd_app_3',
        platform: 'iPhone Lock Screen Passcode',
        category: 'device_passcode',
        username: 'Primary iPhone',
        recoveryEmailPhone: '',
        legacyContactConfigured: false,
        digitalExecutor: 'Spouse / Executor',
        rufadaaDirectives: 'Keep iPhone active and plugged in for at least 6 months to receive two-factor authentication (2FA) SMS verification codes.',
        hardwareKeyLocation: 'Passcode recorded in physical binder plastic sleeve #1',
        notes: 'Critical: Do not wipe phone! Needed by executor for bank two-factor authentication.'
      },
      {
        id: 'd_app_4',
        platform: 'Primary Email Hub (iCloud / Gmail)',
        category: 'email',
        username: 'primary.name@gmail.com',
        recoveryEmailPhone: 'Secondary recovery address',
        legacyContactConfigured: true,
        digitalExecutor: 'Primary Executor',
        rufadaaDirectives: 'Monitor for incoming bills, subscriptions, tax forms, and account statements.',
        hardwareKeyLocation: 'Login stored in master password manager',
        notes: 'Central communications clearinghouse for estate settlement.'
      }
    ]
  },
  {
    id: 'google_android',
    name: 'Google & Android Modern',
    badge: '🤖 Google & Android',
    subtitle: 'Google Inactive Account Manager, Bitwarden vault, Android lock code, primary Gmail',
    description: 'Optimized for Android and Google workspace users: Configures Google Inactive Account Manager for automatic photo/drive sharing, Bitwarden password vault, and mobile lock PIN.',
    previewItems: [
      'Google Inactive Account Manager configured for automated transfer',
      'Bitwarden open-source password vault with emergency sheet',
      'Android PIN recorded for phone verification codes',
      'Google Drive cloud backup for deeds and tax scans'
    ],
    data: [
      {
        id: 'd_goo_1',
        platform: 'Google Account (Gmail, Photos & Drive)',
        category: 'email',
        username: 'username@gmail.com',
        recoveryEmailPhone: 'Backup mobile phone number',
        legacyContactConfigured: true,
        digitalExecutor: 'Designated Heir / Executor',
        rufadaaDirectives: 'Google Inactive Account Manager configured to notify designated contact after 3 months of inactivity with full photo and document download link.',
        hardwareKeyLocation: 'Google account emergency backup codes printed in home safe',
        notes: 'Master hub for photos, emails, and cloud storage.'
      },
      {
        id: 'd_goo_2',
        platform: 'Bitwarden Open-Source Vault',
        category: 'password_manager',
        username: 'Bitwarden Master Account',
        recoveryEmailPhone: 'Primary Gmail',
        legacyContactConfigured: true,
        digitalExecutor: 'Primary Executor',
        rufadaaDirectives: 'Emergency Access feature configured to grant full vault access after 7-day waiting period.',
        hardwareKeyLocation: 'Master password and 2FA recovery code sealed in envelope in home safe',
        notes: 'Cross-platform password manager accessible on computer and phone.'
      },
      {
        id: 'd_goo_3',
        platform: 'Android Phone Lock Screen PIN',
        category: 'device_passcode',
        username: 'Android Smartphone',
        recoveryEmailPhone: '',
        legacyContactConfigured: false,
        digitalExecutor: 'Primary Executor',
        rufadaaDirectives: 'Keep mobile carrier line active for receiving bank 2FA SMS codes.',
        hardwareKeyLocation: 'PIN recorded in DeathBinder confidential envelope',
        notes: 'Essential for executor to receive login confirmation texts from banks and utilities.'
      }
    ]
  },
  {
    id: 'high_security',
    name: 'High-Privacy & Security-Conscious',
    badge: '🛡️ High Security & Privacy',
    subtitle: '1Password Master Vault + Emergency Kit, Hardware YubiKey, Proton Mail, RUFADAA consent',
    description: 'Designed for privacy-minded individuals: Hardware security key (YubiKey) protocols, encrypted email provider, 1Password emergency kit, and explicit RUFADAA digital executor authorization.',
    previewItems: [
      '1Password Master Vault with secret key on waterproof paper',
      'YubiKey hardware security key location and PIN',
      'Proton / Fastmail encrypted email recovery instructions',
      'Explicit RUFADAA legal authorization for digital executor'
    ],
    data: [
      {
        id: 'd_sec_1',
        platform: '1Password Master Vault',
        category: 'password_manager',
        username: 'Master Vault Account',
        recoveryEmailPhone: 'Encrypted email address',
        legacyContactConfigured: false,
        digitalExecutor: 'Designated Digital Executor',
        rufadaaDirectives: 'Explicit consent under RUFADAA granted to export logins, document licenses, and notify service providers.',
        hardwareKeyLocation: 'Emergency Kit with 34-character Secret Key printed on waterproof paper in fireproof safe',
        notes: 'Full vault of all credentials, credit cards, software licenses, and secure notes.'
      },
      {
        id: 'd_sec_2',
        platform: 'YubiKey 5 NFC Hardware Security Key',
        category: 'hardware_2fa',
        username: 'Hardware Token #1 & #2',
        recoveryEmailPhone: '',
        legacyContactConfigured: false,
        digitalExecutor: 'Digital Executor',
        rufadaaDirectives: 'Required physical touch token for logging into primary email and password manager.',
        hardwareKeyLocation: 'Primary key on main keychain; duplicate backup key stored in home safe',
        notes: 'Hardware 2FA token. Plug into USB port or tap against phone to authorize logins.'
      },
      {
        id: 'd_sec_3',
        platform: 'Proton Mail / Encrypted Email',
        category: 'email',
        username: 'name@proton.me',
        recoveryEmailPhone: 'Sealed recovery seed phrase',
        legacyContactConfigured: false,
        digitalExecutor: 'Digital Executor',
        rufadaaDirectives: 'Decrypt inbox using emergency recovery phrase stored in safe.',
        hardwareKeyLocation: 'Recovery phrase written inside sealed tamper-evident envelope in safe',
        notes: 'End-to-end encrypted email hub.'
      }
    ]
  },
  {
    id: 'simple_lowtech',
    name: 'Simple & Paper-Friendly',
    badge: '📝 Simple & Paper-Friendly',
    subtitle: 'Master handwritten notebook in safe, phone lock screen PIN, primary email, carrier PIN',
    description: 'A clean, approachable setup for non-technical individuals or those who prefer keeping master records on physical paper in a secure home lockbox.',
    previewItems: [
      'Handwritten master password notebook located in home safe',
      'Primary email hub with written login instructions',
      'Phone lock screen PIN for SMS verification',
      'Cell phone carrier account PIN to maintain phone line'
    ],
    data: [
      {
        id: 'd_pap_1',
        platform: 'Handwritten Master Password Notebook',
        category: 'password_manager',
        username: 'Physical Spiral Notebook',
        recoveryEmailPhone: '',
        legacyContactConfigured: false,
        digitalExecutor: 'Spouse / Executor',
        rufadaaDirectives: 'Refer to physical alphabetized notebook for all website usernames and passwords.',
        hardwareKeyLocation: 'Top drawer of home fireproof safe (Key kept in master closet)',
        notes: 'Contains all online accounts, security questions, and PIN numbers.'
      },
      {
        id: 'd_pap_2',
        platform: 'Primary Email Account (Yahoo / AOL / Gmail)',
        category: 'email',
        username: 'myemail@yahoo.com',
        recoveryEmailPhone: 'Home landline / Mobile number',
        legacyContactConfigured: false,
        digitalExecutor: 'Primary Executor',
        rufadaaDirectives: 'Check email weekly for incoming bills and account notifications.',
        hardwareKeyLocation: 'Written in password notebook page 1',
        notes: 'Main email where monthly utility and credit card statements are received.'
      },
      {
        id: 'd_pap_3',
        platform: 'Mobile Phone Lock Screen PIN',
        category: 'device_passcode',
        username: 'Smartphone PIN',
        recoveryEmailPhone: '',
        legacyContactConfigured: false,
        digitalExecutor: 'Executor',
        rufadaaDirectives: 'Keep phone charged to check text messages for bank verification codes.',
        hardwareKeyLocation: 'Recorded on Emergency Summary Sheet in Binder Sleeve #1',
        notes: 'Do not disconnect phone line until estate probate is completed.'
      },
      {
        id: 'd_pap_4',
        platform: 'Cell Phone Carrier (Verizon / AT&T / T-Mobile)',
        category: 'other',
        username: 'Carrier Billing Account',
        recoveryEmailPhone: '',
        legacyContactConfigured: false,
        digitalExecutor: 'Executor',
        rufadaaDirectives: 'Transfer account ownership to surviving spouse or executor without disconnecting the phone number.',
        hardwareKeyLocation: 'Carrier 4-digit security PIN in safe',
        notes: 'Critical to prevent losing phone number used for two-factor authentication.'
      }
    ]
  }
];

// -------------------------------------------------------------
// 4. LEGACY, MEMORIES & LIFE WISDOM STARTERS
// -------------------------------------------------------------
export const LEGACY_STARTERS: SectionStarterArchetype<LegacyMemories>[] = [
  {
    id: 'family_storyteller',
    name: 'Family Storyteller & Traditions',
    badge: '📖 Storyteller & Traditions',
    subtitle: 'Family roots, Sunday dinners, holiday rituals, and keeping siblings close',
    description: 'Heartfelt memories and traditions centered on family gatherings, heritage, secret recipes, and keeping the family close across generations.',
    previewItems: [
      'Heritage of hard work, hospitality, and welcoming front door',
      'Holiday customs, Sunday family dinners, and secret family recipes',
      'Core wisdom: Sibling bonds, generosity, and listening before speaking',
      'Hopes for children & grandchildren to stay close through life'
    ],
    data: {
      familyOrigins: 'Our family roots trace back through generations of hardworking individuals who sacrificed to give their children a better life. We learned that wherever we make our home, hospitality, laughter, and an open front door define who we are. Our ancestors valued family unity above all else.',
      traditionsRecipes: 'Never let holiday gatherings become rushed. The Christmas Eve dinner, Sunday sauce gatherings, and summer reunions are the glue that holds us together. Pass down Grandma\'s recipes, cook together from scratch, and always set an extra seat at the table for anyone in need.',
      lifeLessonsWisdom: '1. Sibling bonds are a treasure—forgive quickly, never let money come between family, and call each other often.\n2. Work hard and take pride in whatever you do, but remember that when all is said and done, the people around your table are your only true wealth.\n3. Be quick to listen, slow to speak, and slow to anger.\n4. Celebrate small joys every day—do not wait for an excuse to be happy.',
      bucketListCompleted: 'Raised a loving, independent family, created a warm home full of books and music, and watched our children find their own passions.',
      bucketListFuture: 'I hope my children and grandchildren stay close, travel together, support one another through life\'s storms, and continue our holiday traditions for generations to come.',
      notes: '"The greatest thing you\'ll ever learn is just to love and be loved in return."'
    }
  },
  {
    id: 'practical_character',
    name: 'Practical Wisdom & Grit',
    badge: '⚖️ Practical Wisdom & Grit',
    subtitle: 'Work ethic, living below your means, integrity, resilience, and quiet generosity',
    description: 'Straightforward, practical life advice emphasizing honesty, financial discipline, resilience in adversity, and showing up for friends when it matters.',
    previewItems: [
      'Heritage of grit, perseverance, and quiet self-reliance',
      'Traditions of fixing things with your own hands and outdoor trips',
      'Core wisdom: Live on less than you earn, protect your integrity',
      'Hopes for intellectual curiosity, resilience, and moral courage'
    ],
    data: {
      familyOrigins: 'Built on a heritage of grit, perseverance, and quiet self-reliance. We came from humble circumstances where every dollar was earned through honest labor, careful stewardship, and a commitment to leave things better than we found them.',
      traditionsRecipes: 'Annual camping and fishing trips, making homemade breakfasts on Saturday mornings, and teaching the younger generation how to fix things with their own hands instead of throwing them away.',
      lifeLessonsWisdom: '1. Always live on less than you earn; financial freedom gives you the power to make choices based on principles rather than desperation.\n2. Your word and your integrity are the only things no one can take from you—guard them jealously.\n3. Show up when it\'s hard. Anyone can celebrate success, but true character is standing beside a friend in their darkest hour.\n4. When you make a mistake, own it immediately and make it right without making excuses.\n5. Consistency beats talent when talent doesn\'t work hard.',
      bucketListCompleted: 'Became debt-free, built our family home, mentored dozens of young people in their careers, and traveled across the national parks.',
      bucketListFuture: 'May future generations remain curious, intellectually honest, financially responsible, and brave enough to stand up for what is right even when standing alone.',
      notes: '"Character is doing the right thing when nobody is looking."'
    }
  },
  {
    id: 'gratitude_faith',
    name: 'Gratitude, Love & Faith',
    badge: '🕊️ Gratitude & Faith',
    subtitle: 'Thankfulness, spiritual anchors, kindness to strangers, and blessings for future generations',
    description: 'A deeply grounded reflection of spiritual faith, gratitude for life\'s unmerited gifts, the power of unconditional love, and blessings for future generations.',
    previewItems: [
      'Heritage shaped by faith, prayer, and deep thankfulness',
      'Traditions of family meal blessings, holy day candles, bedtime prayers',
      'Core wisdom: Unconditional love, daily forgiveness, and treating all with dignity',
      'Blessings and prayers for peace, wisdom, and compassionate hearts'
    ],
    data: {
      familyOrigins: 'A family shaped by faith, prayer, and deep gratitude for the unmerited grace we have received throughout our lives. We have walked through valleys and mountain peaks, always held by an enduring spiritual foundation.',
      traditionsRecipes: 'Saying grace together before meals, holding hands, lighting candles during holy days, and giving our children a blessing before they go to sleep. Baking seasonal breads and sharing food with neighbors.',
      lifeLessonsWisdom: '1. Wake up every morning with a grateful heart; gratitude turns what we have into enough.\n2. Love without condition. The people who are hardest to love are often the ones who need it the most.\n3. Practice daily forgiveness—holding a grudge is like drinking poison and expecting the other person to get sick.\n4. Treat every person you meet, from the cashier to the CEO, with dignity and respect as a child of God.\n5. Trust that God is working even when you cannot see the path ahead.',
      bucketListCompleted: 'Walked in faith, served in our community and congregation, supported mission projects, and witnessed the blessings of children and grandchildren.',
      bucketListFuture: 'My greatest prayer is that each of you walks in truth, loves your neighbor, and finds deep peace in your heart regardless of life\'s circumstances.',
      notes: '"Faith, hope, and love abide, these three; but the greatest of these is love." — 1 Corinthians 13:13'
    }
  },
  {
    id: 'adventurer_spirit',
    name: 'Adventurer & Free Spirit',
    badge: '🌍 Adventurer & Free Spirit',
    subtitle: 'Curiosity, seeing the world, dancing in the rain, and laughing through life',
    description: 'An uplifting celebration of curiosity, exploration, joyful risk-taking, humor, and collecting memories rather than material possessions.',
    previewItems: [
      'Heritage of dreamers and explorers unafraid of new horizons',
      'Traditions of spontaneous road trips, outdoor picnics, world music',
      'Core wisdom: Invest in memories, embrace change, stay curious',
      'Hopes for fearless exploration, open-mindedness, and joyful laughter'
    ],
    data: {
      familyOrigins: 'A legacy of wanderers, dreamers, and seekers who were never afraid to leave the beaten path and explore what lay over the next hill. We learned that the world is vast and beautiful, full of good people in every corner.',
      traditionsRecipes: 'Spontaneous road trips, picnics in the rain, trying bizarre local street foods in every town visited, and celebrating milestones with great music and dancing under the stars.',
      lifeLessonsWisdom: '1. Don\'t take yourself too seriously—life is an adventure to be experienced, not a problem to be solved.\n2. Spend money on experiences and memories, not clutter and status symbols.\n3. Take calculated risks; the regret of not trying is always heavier than the sting of failure.\n4. Look up at the stars often. Stay humble, stay wild, and keep your sense of wonder alive.\n5. Laughter is the shortest distance between two people.',
      bucketListCompleted: 'Backpacked across multiple continents, learned to sail, swam in both oceans, wrote poetry, and made lifelong friends across the globe.',
      bucketListFuture: 'I hope you explore the world with an open mind, question dogma, embrace different cultures, and always choose kindness and adventure.',
      notes: '"Not all those who wander are lost." — J.R.R. Tolkien'
    }
  }
];

// -------------------------------------------------------------
// 5. FIRST 48-HOUR EMERGENCY PLAN STARTERS
// -------------------------------------------------------------
export const EMERGENCY_STARTERS: SectionStarterArchetype<Partial<EmergencyPlan>>[] = [
  {
    id: 'spouse_first',
    name: 'Surviving Spouse / Partner Hub',
    badge: '💍 Surviving Spouse First',
    subtitle: 'Spouse handles healthcare proxy & executor, safe in master closet, joint checking liquidity',
    description: 'Designed for married couples or domestic partners where the surviving spouse takes primary charge of both medical directives and initial estate coordination.',
    previewItems: [
      'Spouse named as Primary Medical Decision Maker & Executor',
      'Original Will in home fireproof safe (Master bedroom closet)',
      'Joint checking cash buffer ($5,000–$10,000) for immediate mortuary fees',
      'Critical reminder: Never pay deceased debts from personal funds'
    ],
    data: {
      medicalDecisionMakerContact: 'Surviving Spouse — Mobile: (555) 012-3456',
      primaryExecutorContact: 'Surviving Spouse — Mobile: (555) 012-3456',
      secondaryEmergencyContact: 'Adult Child or Sibling — (555) 987-6543',
      originalWillLocation: 'Home fireproof safe (Master bedroom closet top shelf)',
      immediateAccessCodes: 'Safe combination sealed in confidential envelope; master key on bedroom dresser',
      funeralHomePreference: 'Local Community Funeral Home & Cremation Services',
      funeralFundingMethod: 'joint_account',
      immediateCashBufferLocation: 'Primary Joint Checking account (Unfrozen Day 1 liquidity for mortuary deposit)',
      criticalNotes: 'Surviving spouse should NOT pay deceased credit cards or medical bills from separate personal funds. All claims must go through estate probate.'
    }
  },
  {
    id: 'adult_child_executor',
    name: 'Adult Child Executor Hub',
    badge: '👨‍👩‍👧 Adult Child Executor',
    subtitle: 'Named adult child handles logistics, office safe, direct cremation, prepaid mortuary',
    description: 'Tailored for parents whose adult son or daughter is appointed as primary executor and healthcare proxy to navigate the first 48 hours.',
    previewItems: [
      'Adult Child designated as Healthcare Proxy & Named Executor',
      'Home office safe with front door keypad code',
      'Prepaid cremation contract reference on file',
      'Cash envelope in safe for immediate family expenses'
    ],
    data: {
      medicalDecisionMakerContact: 'Adult Child (Healthcare Proxy) — Mobile: (555) 234-5678',
      primaryExecutorContact: 'Adult Child (Named Executor in Will) — Mobile: (555) 234-5678',
      secondaryEmergencyContact: 'Secondary Sibling or Family Attorney — (555) 876-5432',
      originalWillLocation: 'Home office fireproof filing safe (Top drawer)',
      immediateAccessCodes: 'Front entry lockbox code: 1984; Home office safe key in desk pencil drawer',
      funeralHomePreference: 'Prepaid Funeral Provider / Cremation Society',
      funeralFundingMethod: 'prepaid_contract',
      funeralContractNumberOrRef: 'Pre-Need Contract #NC-84920 on file with mortuary',
      immediateCashBufferLocation: 'Home safe envelope with $1,500 emergency cash buffer; checking account POD',
      criticalNotes: 'Request 10 to 15 certified copies of the death certificate from the funeral director. Do not cancel decedent cell phone line (needed for 2FA).'
    }
  },
  {
    id: 'solo_ager_network',
    name: 'Solo Ager / Trusted Advisor Hub',
    badge: '🛡️ Solo Ager / Fiduciary',
    subtitle: 'Professional or friend fiduciary, bank safe deposit box, anatomical donation / prepaid mortuary',
    description: 'Structured for solo agers, widowers, or independent adults appointing a trusted friend, fiduciary, or estate attorney to lead emergency logistics.',
    previewItems: [
      'Trusted friend or professional fiduciary named as agent',
      'Original Will with Estate Planning Attorney',
      'Anatomical gift coordinator urgent contact note',
      'Designated POD bank account for funeral & utility costs'
    ],
    data: {
      medicalDecisionMakerContact: 'Trusted Friend / Healthcare Advocate — Mobile: (555) 345-6789',
      primaryExecutorContact: 'Estate Planning Attorney / Professional Fiduciary — Office: (555) 765-4321',
      secondaryEmergencyContact: 'Trusted Neighbor (Has house key) — (555) 456-7890',
      originalWillLocation: 'With Estate Planning Attorney; duplicate stamped copy in home lockbox',
      immediateAccessCodes: 'Emergency house key held by neighbor; lockbox key on master keychain',
      funeralHomePreference: 'Anatomical Board of the State Medical University / Mortuary',
      funeralFundingMethod: 'prepaid_contract',
      immediateCashBufferLocation: 'Payable on Death (POD) checking account at primary credit union',
      organDonationUrgentNote: 'Whole-body donation donor card in wallet. Contact university donor coordinator within 2 hours of death.',
      criticalNotes: 'Immediate notification required for pet caretaker and anatomical donor registry upon passing.'
    }
  }
];

// -------------------------------------------------------------
// 6. RECURRING CONTINUITY STARTERS
// -------------------------------------------------------------
export const RECURRING_STARTERS: SectionStarterArchetype<RecurringPayment[]>[] = [
  {
    id: 'homeowner_bills',
    name: 'Homeowner Property Continuity',
    badge: '🏡 Homeowner Baseline',
    subtitle: 'Electric/Power, Water, Homeowners Insurance, Mortgage, Internet, and streaming',
    description: 'A pre-configured template of typical homeowner obligations, tagged with clear continuity actions (must maintain vs cancel immediately) to protect property value and prevent pipe freezing during probate.',
    previewItems: [
      'Electric & Water utilities tagged "Must Maintain" (prevents frozen pipes)',
      'Homeowners Hazard Insurance tagged "Must Maintain" (prevents policy cancellation)',
      'Mortgage payment tagged "Must Maintain" to avoid foreclosure',
      'Digital streaming subscriptions tagged "Cancel Immediately"'
    ],
    data: [
      {
        id: 'r_home_1',
        name: 'Electric & Gas Utility (Local Power Co)',
        category: 'utility',
        estimatedAmount: '$140 / mo',
        billingCycle: 'monthly',
        dueDayOfMonth: '15',
        autoPaySource: 'Auto-debit from primary checking',
        actionOnDeath: 'must_maintain',
        cancellationInstructions: 'Maintain power continuously for heating/AC, sump pump, and security system during estate settlement.',
        notes: 'Prevent frozen pipes in winter and mold in summer.'
      },
      {
        id: 'r_home_2',
        name: 'Municipal Water & Sewer',
        category: 'utility',
        estimatedAmount: '$65 / mo',
        billingCycle: 'monthly',
        dueDayOfMonth: '1',
        autoPaySource: 'Auto-debit from checking',
        actionOnDeath: 'must_maintain',
        cancellationInstructions: 'Keep active for fire sprinkler protection and lawn care during estate transition.',
        notes: 'Critical municipal utility.'
      },
      {
        id: 'r_home_3',
        name: 'Homeowners Hazard Insurance',
        category: 'insurance_premium',
        estimatedAmount: '$1,400 / yr',
        billingCycle: 'annual',
        dueDayOfMonth: '28',
        autoPaySource: 'Escrow / Checking auto-pay',
        actionOnDeath: 'must_maintain',
        cancellationInstructions: 'DO NOT CANCEL. Property must remain fully insured against fire, storm, and liability. Notify agent of vacancy endorsement.',
        notes: 'Unoccupied homes may require a vacancy rider after 30 days.'
      },
      {
        id: 'r_home_4',
        name: 'Primary Mortgage / HOA Dues',
        category: 'loan_debt',
        estimatedAmount: '$1,850 / mo',
        billingCycle: 'monthly',
        dueDayOfMonth: '1',
        autoPaySource: 'Auto-debit from checking',
        actionOnDeath: 'must_maintain',
        cancellationInstructions: 'Maintain monthly payments from estate funds to prevent late penalties or default proceedings.',
        notes: 'Federal Garn-St. Germain Act allows family members to keep mortgage current without immediate payoff.'
      },
      {
        id: 'r_home_5',
        name: 'Cell Phone Carrier (2FA Line)',
        category: 'utility',
        estimatedAmount: '$75 / mo',
        billingCycle: 'monthly',
        dueDayOfMonth: '20',
        autoPaySource: 'Auto-debit from checking',
        actionOnDeath: 'must_maintain',
        cancellationInstructions: 'KEEP ACTIVE FOR AT LEAST 6 MONTHS to receive two-factor authentication codes from banks.',
        notes: 'Do not cancel early!'
      },
      {
        id: 'r_home_6',
        name: 'Streaming Services (Netflix / Spotify / Prime)',
        category: 'subscription',
        estimatedAmount: '$45 / mo',
        billingCycle: 'monthly',
        dueDayOfMonth: '10',
        autoPaySource: 'Credit Card',
        actionOnDeath: 'cancel_immediately',
        cancellationInstructions: 'Log into account or notify card issuer to stop recurring charges immediately upon death.',
        notes: 'Unnecessary ongoing expense during probate.'
      }
    ]
  },
  {
    id: 'renter_bills',
    name: 'Renter & Apartment Continuity',
    badge: '🏢 Renter Baseline',
    subtitle: 'Apartment rent, electric, cell line, and digital subscriptions',
    description: 'Configured for apartment tenants: Rent transition (30-day lease surrender notice), power maintenance while clearing unit, phone line retention, and subscription cancellations.',
    previewItems: [
      'Apartment Rent tagged "Must Maintain" for 30-day transition',
      'Electric utility kept on during packing and cleaning',
      'Cell phone line kept active for 6 months for 2FA SMS codes',
      'Streaming and memberships tagged "Cancel Immediately"'
    ],
    data: [
      {
        id: 'r_rent_1',
        name: 'Apartment Monthly Rent',
        category: 'loan_debt',
        estimatedAmount: '$1,650 / mo',
        billingCycle: 'monthly',
        dueDayOfMonth: '1',
        autoPaySource: 'Checking auto-debit / Resident portal',
        actionOnDeath: 'must_maintain',
        cancellationInstructions: 'Pay final month rent; provide landlord with 30-day written notice of death to schedule move-out and security deposit return.',
        notes: 'Check lease terms for death-termination clause.'
      },
      {
        id: 'r_rent_2',
        name: 'Apartment Electric / Gas',
        category: 'utility',
        estimatedAmount: '$80 / mo',
        billingCycle: 'monthly',
        dueDayOfMonth: '18',
        autoPaySource: 'Checking auto-debit',
        actionOnDeath: 'must_maintain',
        cancellationInstructions: 'Keep active until apartment is completely cleared and final walkthrough is completed.',
        notes: 'Schedule final meter reading on surrender date.'
      },
      {
        id: 'r_rent_3',
        name: 'Cell Phone Line (2FA Security)',
        category: 'utility',
        estimatedAmount: '$60 / mo',
        billingCycle: 'monthly',
        dueDayOfMonth: '12',
        autoPaySource: 'Auto-debit from checking',
        actionOnDeath: 'must_maintain',
        cancellationInstructions: 'Keep line active for 6 months to receive two-factor authentication codes from banks.',
        notes: 'Crucial for executor bank communications.'
      },
      {
        id: 'r_rent_4',
        name: 'Digital Subscriptions & Memberships',
        category: 'subscription',
        estimatedAmount: '$55 / mo',
        billingCycle: 'monthly',
        dueDayOfMonth: '5',
        autoPaySource: 'Credit card auto-charge',
        actionOnDeath: 'cancel_immediately',
        cancellationInstructions: 'Cancel memberships immediately upon death to prevent further billing.',
        notes: 'Notify gym and streaming apps with copy of death notice.'
      }
    ]
  }
];

// -------------------------------------------------------------
// 7. KEY ADVISORS & CONTACTS STARTERS
// -------------------------------------------------------------
export const CONTACTS_STARTERS: SectionStarterArchetype<Contact[]>[] = [
  {
    id: 'family_circle',
    name: 'Family Core Circle',
    badge: '👨‍👩‍👦 Family Core Circle',
    subtitle: 'Spouse, adult child / sibling alternate, primary care doctor, and local friend/neighbor',
    description: 'A foundational contact group covering personal decision makers: Primary Executor/Proxy, Alternate Agent, Primary Care Physician, and local neighbor keyholder.',
    previewItems: [
      'Primary Executor & Healthcare Proxy (Spouse / Partner)',
      'Alternate Executor & Medical Agent (Adult Child / Sibling)',
      'Primary Care Physician for death certification & records',
      'Local Neighbor / Friend for spare key and emergency pet care'
    ],
    data: [
      {
        id: 'c_fam_1',
        name: 'Eleanor Vance (Spouse / Partner)',
        relationship: 'Primary Executor',
        phone: '(555) 012-3456',
        email: 'eleanor.vance@example.com',
        address: '124 Elmwood Court, Springfield',
        notes: 'Named as Primary Executor in Last Will and Primary Healthcare Proxy.'
      },
      {
        id: 'c_fam_2',
        name: 'Sarah Vance (Daughter / Alternate Agent)',
        relationship: 'Secondary / Alternate Executor',
        phone: '(555) 234-5678',
        email: 'sarah.vance@example.com',
        address: '782 Highland Ave, Apt 4B, Chicago, IL',
        notes: 'Alternate Executor and Secondary Medical Decision Maker.'
      },
      {
        id: 'c_fam_3',
        name: 'Dr. Arthur Mitchell, MD',
        relationship: 'Primary Care Physician',
        phone: '(555) 345-6789',
        email: 'office@springfieldclinic.org',
        address: 'Springfield Medical Arts, Suite 210',
        notes: 'Primary physician for last 12 years. Contact for death certificate signing and medical history.'
      },
      {
        id: 'c_fam_4',
        name: 'David Miller (Neighbor & Pet Caretaker)',
        relationship: 'Pet Caretaker / Guardian',
        phone: '(555) 456-7890',
        email: 'dmiller@example.com',
        address: '126 Elmwood Court (Next door)',
        notes: 'Holds spare house key. Agreed to take immediate custody of dog/cat in emergency.'
      }
    ]
  },
  {
    id: 'professional_team',
    name: 'Professional Advisory Team',
    badge: '⚖️ Professional Advisory Team',
    subtitle: 'Estate attorney, CPA accountant, financial wealth manager, and primary executor',
    description: 'Structured for estates requiring professional guidance: Estate planning attorney, certified public accountant (CPA), financial wealth manager, and designated executor.',
    previewItems: [
      'Estate Planning Attorney (Original Will & Trust repository)',
      'CPA / Tax Accountant for final 1040 and estate 1041 filings',
      'Financial Advisor / Wealth Manager for IRA & brokerage transfers',
      'Designated Estate Representative / Fiduciary'
    ],
    data: [
      {
        id: 'c_pro_1',
        name: 'Patricia Hayes, Esq. (Estate Attorney)',
        relationship: 'Estate Planning Attorney',
        phone: '(555) 890-1234',
        email: 'phayes@hayeslaw.com',
        address: 'Hayes & Associates, 500 Main St, Suite 400',
        notes: 'Drafted Last Will and Revocable Living Trust. Holds original attorney vault copy.'
      },
      {
        id: 'c_pro_2',
        name: 'Marcus Bell, CPA',
        relationship: 'CPA / Accountant',
        phone: '(555) 901-2345',
        email: 'mbell@bellaccounting.com',
        address: 'Bell Financial Services, 120 Oak St',
        notes: 'Handles annual income tax returns. Contact to prepare final individual Form 1040 and fiduciary estate Form 1041.'
      },
      {
        id: 'c_pro_3',
        name: 'Caroline Reed (Wealth Advisor)',
        relationship: 'Financial Advisor / Wealth Manager',
        phone: '(555) 012-7890',
        email: 'creed@fidelityadvisors.com',
        address: 'Fidelity Wealth Management, Springfield Branch',
        notes: 'Manages IRA and taxable brokerage portfolios. Contact for beneficiary transfer paperwork.'
      },
      {
        id: 'c_pro_4',
        name: 'Thomas Vance (Designated Executor)',
        relationship: 'Primary Executor',
        phone: '(555) 123-9876',
        email: 'tvance@example.com',
        address: '45 Lakeview Dr, Madison, WI',
        notes: 'Appointed personal representative in Last Will.'
      }
    ]
  }
];
