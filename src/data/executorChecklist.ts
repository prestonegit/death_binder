export interface ChecklistTask {
  id: string;
  title: string;
  subtitle: string;
  timeframe: 'hours_0_24' | 'days_2_5' | 'days_5_14' | 'days_15_45';
  priority: 'urgent' | 'important' | 'standard';
  caution?: string;
  binderTabLink?: string;
  instructions: string;
  requiredDocuments?: string[];
}

export interface ChecklistPhase {
  id: 'hours_0_24' | 'days_2_5' | 'days_5_14' | 'days_15_45';
  badge: string;
  title: string;
  timeframeDescription: string;
  tasks: ChecklistTask[];
}

export const EXECUTOR_CHECKLIST_PHASES: ChecklistPhase[] = [
  {
    id: 'hours_0_24',
    badge: 'Phase 1: First 24 Hours',
    title: 'Immediate Care & Notification',
    timeframeDescription: 'Immediate steps upon death or medical crisis',
    tasks: [
      {
        id: 't_hospice_active_dying',
        title: 'Managing the Active Dying Vigil (If Enrolled in Hospice)',
        subtitle: 'CRITICAL: DO NOT call 911 during active dying or breathing pauses',
        timeframe: 'hours_0_24',
        priority: 'urgent',
        binderTabLink: 'emergency',
        caution: 'Calling 911 triggers sirens, police, and mandatory aggressive resuscitation unless a state-specific Out-of-Hospital DNR is handed to first responders instantly.',
        instructions: 'When breathing pauses (Cheyne-Stokes), extremities cool, or respiratory secretions sound noisy ("death rattle"): DO NOT dial 911. Call your 24/7 Hospice Triage Nurse (listed in Section 1). Retrieve the Hospice Emergency Comfort Kit from the refrigerator and administer sublingual drops as directed by the on-call nurse.'
      },
      {
        id: 't_pronounce',
        title: 'Obtain Official Pronouncement of Death',
        subtitle: 'Call attending physician, hospice nurse, or 911 if at home',
        timeframe: 'hours_0_24',
        priority: 'urgent',
        instructions: 'If death occurs at home with hospice, call the hospice nurse directly. If unexpected, call 911. The attending medical professional or medical examiner will sign the official pronouncement.'
      },
      {
        id: 't_funeral_liquidity',
        title: 'Confirm Immediate Funeral Funding ($5,000–$15,000)',
        subtitle: 'Determine funding source before signing mortuary service agreements',
        timeframe: 'hours_0_24',
        priority: 'urgent',
        binderTabLink: 'emergency',
        caution: 'Do NOT write checks from the decedent’s sole bank account. Sole accounts freeze immediately upon death notice, and checks will bounce with penalty fees.',
        instructions: 'Check Section 1 (Emergency Plan) for the immediate cash buffer. Determine payment method: (1) Pre-need contract already funded; (2) Joint checking account with surviving spouse; (3) Cash reserve in home safe; or (4) Funeral Assignment of Life Insurance directly with the mortuary.'
      },
      {
        id: 't_sepulcher_cremation',
        title: 'Verify Right of Sepulcher & Cremation Authorization',
        subtitle: 'Avoid mortuary delays and cremation disputes',
        timeframe: 'hours_0_24',
        priority: 'urgent',
        binderTabLink: 'legal',
        caution: 'Cremation is irreversible. State laws require either a designated disposition agent or notarized signatures from ALL surviving adult children before cremation can take place.',
        instructions: 'Check Section 3 (Legal) for the designated Disposition Agent. If cremation is chosen and no agent was appointed, request cremation authorization forms from all surviving adult children immediately.'
      },
      {
        id: 't_organ',
        title: 'Check Organ & Tissue Donation Directives',
        subtitle: 'Window of opportunity is 2 to 24 hours',
        timeframe: 'hours_0_24',
        priority: 'urgent',
        binderTabLink: 'emergency',
        instructions: 'Check Section 1 (Emergency Plan) or the decedent’s driver’s license. Notify hospital staff immediately so transplant teams can preserve corneas, heart valves, or organs.'
      },
      {
        id: 't_pets',
        title: 'Secure Pets & Immediate Dependents',
        subtitle: 'Ensure immediate food, water, medications, and safe care',
        timeframe: 'hours_0_24',
        priority: 'urgent',
        binderTabLink: 'sentimental',
        instructions: 'Locate designated pet guardian in Section 12. Ensure pets have immediate food, daily medications (e.g. insulin), and a trusted temporary home.'
      },
      {
        id: 't_security',
        title: 'Secure the Physical Home & Vehicles',
        subtitle: 'Lock all doors/windows, park cars in garage, adjust thermostat',
        timeframe: 'hours_0_24',
        priority: 'important',
        binderTabLink: 'emergency',
        instructions: 'Check Section 1 for keypad door codes and safe combinations. Lock exterior doors, close blinds, set lighting timers, and ensure perishable food is discarded.'
      },
      {
        id: 't_freeze_vacant',
        title: 'Vacant Property Freeze & Burglary Protection',
        subtitle: 'Prevent pipe bursts in winter and secure against break-ins during services',
        timeframe: 'hours_0_24',
        priority: 'important',
        caution: 'Public funeral announcements and obituaries can alert burglars to vacant homes.',
        instructions: 'If the home will be unoccupied: set winter heating to 55°F minimum, turn off the main water shutoff valve, retrieve exterior hidden keys, and install light timers.'
      },
      {
        id: 't_mortuary',
        title: 'Contact Funeral Home for Transfer',
        subtitle: 'Call chosen funeral chapel to arrange dignified transport',
        timeframe: 'hours_0_24',
        priority: 'important',
        binderTabLink: 'emergency',
        caution: 'Under the FTC Funeral Rule, you have the legal right to an itemized price list (GPL) and to decline embalming for direct cremation.',
        instructions: 'Call the preferred funeral chapel listed in Section 1. They will transport the decedent into mortuary care and coordinate state vital records filing. You have the right to request an itemized General Price List (GPL) and purchase third-party caskets or urns without fee.'
      }
    ]
  },
  {
    id: 'days_2_5',
    badge: 'Phase 2: Days 2 to 5',
    title: 'Arrangements & Vital Records',
    timeframeDescription: 'Funeral planning, employer benefits, and safeguarding records',
    tasks: [
      {
        id: 't_will_loc',
        title: 'Locate Original Signed Will & Trust Documents',
        subtitle: 'Courts require original physical ink signatures',
        timeframe: 'days_2_5',
        priority: 'urgent',
        binderTabLink: 'legal',
        caution: 'Do NOT remove staples or alter court binding. If the Will is locked in a solo bank safe deposit box, consult an attorney before notifying the bank.',
        instructions: 'Locate the physical original Will using Section 3 (Legal). The named Executor will present this to the probate attorney or county surrogate court.'
      },
      {
        id: 't_death_certs',
        title: 'Order 10 to 15 Certified Death Certificates',
        subtitle: 'Order directly through the funeral director with raised state seal',
        timeframe: 'days_2_5',
        priority: 'important',
        binderTabLink: 'tax',
        instructions: 'Banks, real estate recorders, life insurance companies, and the DMV each require an official certified copy with a raised seal (photocopies are rejected). Request both Short-Form (for banking and real estate public filings) and Long-Form (with medical cause of death for life insurance).'
      },
      {
        id: 't_phone_2fa',
        title: 'Safeguard Mobile Phone & Keep Plan Active',
        subtitle: 'CRITICAL: Do NOT cancel the mobile carrier line',
        timeframe: 'days_2_5',
        priority: 'urgent',
        binderTabLink: 'digital',
        caution: 'Canceling the phone line locks you out of all bank accounts, email vaults, and Apple/Google 2FA verification codes.',
        instructions: 'Keep the decedent’s mobile phone charged and active on its existing carrier plan for at least 6 months. It is needed to receive two-factor authentication (SMS) codes when logging into accounts.'
      },
      {
        id: 't_employer_hr',
        title: 'Notify Employer HR & Transition Health Coverage (COBRA)',
        subtitle: 'Initiate group life claims, final wages, and protect surviving dependents',
        timeframe: 'days_2_5',
        priority: 'important',
        caution: 'Health insurance for surviving spouses/children can terminate at the end of the month of death without prompt COBRA election.',
        instructions: 'Contact the decedent’s HR department to claim employer group life insurance, request payout of accrued PTO/final wages, and enroll dependents in COBRA or individual marketplace health plans.'
      },
      {
        id: 't_vehicle_driving',
        title: 'Vehicle Operation & Insurance Status Review',
        subtitle: 'Verify auto insurance coverage before anyone operates estate vehicles',
        timeframe: 'days_2_5',
        priority: 'important',
        binderTabLink: 'assets',
        caution: 'Auto insurance policies may deny claims if unauthorized non-titled drivers operate a vehicle titled solely in the deceased’s name.',
        instructions: 'Confirm with the auto insurer that permissive use coverage remains in effect while the estate is pending transfer.'
      },
      {
        id: 't_mail',
        title: 'Secure Mail, Wallet & Checkbooks',
        subtitle: 'Collect incoming mail and safeguard purse/wallet contents',
        timeframe: 'days_2_5',
        priority: 'important',
        instructions: 'Collect incoming physical mail daily to discover undisclosed bank accounts, insurance statements, or utility bills. Submit a USPS Forwarding order to the Executor’s address once Letters Testamentary are issued.'
      },
      {
        id: 't_prep_bank_freeze',
        title: 'Bank Death Freeze Preparation: Audit Auto-Debits & Statements',
        subtitle: 'Download statements BEFORE notifying financial institutions of death',
        timeframe: 'days_2_5',
        priority: 'urgent',
        binderTabLink: 'financial',
        caution: 'Once a bank is notified of death, sole accounts freeze instantly and online banking access is revoked.',
        instructions: 'Before presenting death certificates to banks: (1) Download the last 12 months of checking and credit card statements; (2) Identify critical auto-debits (power, heating gas, homeowners insurance, mortgage); (3) Redirect essential household bills to a surviving joint account or credit card to prevent frozen pipes or insurance cancellation.'
      },
      {
        id: 't_credit_card_authorized_users',
        title: 'Cease Use of Deceased Credit Cards & Audit Surviving Credit',
        subtitle: 'Authorized user cards deactivate immediately upon primary death',
        timeframe: 'days_2_5',
        priority: 'urgent',
        binderTabLink: 'financial',
        caution: 'Charging purchases on a deceased person’s credit card—even as an authorized user—constitutes fraud. Surviving spouses who are authorized users lose card access immediately.',
        instructions: 'Cut up or secure all credit cards in the decedent’s name. If the surviving spouse only held authorized user cards, help them open an individual credit card immediately so they maintain purchasing power for living expenses.'
      }
    ]
  },
  {
    id: 'days_5_14',
    badge: 'Phase 3: Days 5 to 14',
    title: 'Legal Protection & Notification',
    timeframeDescription: 'Engaging counsel, life insurance, and stopping leaks',
    tasks: [
      {
        id: 't_attorney',
        title: 'Retain Estate Planning Attorney',
        subtitle: 'Schedule probate petition and executor appointment',
        timeframe: 'days_5_14',
        priority: 'important',
        binderTabLink: 'contacts',
        instructions: 'Meet with the estate attorney (listed in Section 2) to file the Will with the probate court and receive formal "Letters Testamentary" authorizing you to act on behalf of the estate.'
      },
      {
        id: 't_debt_caution',
        title: 'Protect Yourself: Never Pay Debts from Personal Funds',
        subtitle: 'Surviving family is generally NOT personally liable for decedent debts',
        timeframe: 'days_5_14',
        priority: 'urgent',
        caution: 'Never use your personal money to pay solo credit card bills or medical loans. Debts are settled exclusively by the estate in probate order (unless you are a joint co-borrower/co-signer or subject to statutory spousal medical liability laws).',
        instructions: 'If creditors or collection agencies call, notify them that the estate is entering probate and refer them to the estate attorney or executor.'
      },
      {
        id: 't_life_ins',
        title: 'Submit Life Insurance Claims',
        subtitle: 'Proceeds pay directly to beneficiaries and bypass probate',
        timeframe: 'days_5_14',
        priority: 'important',
        binderTabLink: 'insurance',
        instructions: 'Contact life insurance carriers in Section 7 with a certified death certificate. Payouts are typically transferred within 10 to 30 days tax-free.'
      },
      {
        id: 't_stop_subs',
        title: 'Freeze Non-Essential Recurring Subscriptions',
        subtitle: 'Cancel streaming, gym memberships, and digital services',
        timeframe: 'days_5_14',
        priority: 'important',
        binderTabLink: 'recurring',
        instructions: 'Use Section 5 (Recurring Bills) to cancel non-essential services. Keep home electricity, heating, water, and homeowners insurance active until the property is settled.'
      },
      {
        id: 't_claim_pod_fasttrack',
        title: 'Fast-Track Non-Probate Asset Claims (POD / TOD / Beneficiaries)',
        subtitle: 'Claim checking, brokerage, and IRA funds without probate delays',
        timeframe: 'days_5_14',
        priority: 'urgent',
        binderTabLink: 'financial',
        instructions: 'Named beneficiaries do NOT need to wait for probate Letters Testamentary. As soon as certified death certificates arrive, beneficiaries should present their photo ID, SSN, and death certificate directly to banks and brokerages in Section 4 to disburse liquid funds.'
      },
      {
        id: 't_mortgage_garn_st_germain',
        title: 'Assert Garn-St. Germain Mortgage Protections & Maintain Payments',
        subtitle: 'Lenders cannot enforce Due-on-Sale clauses against inheriting relatives',
        timeframe: 'days_5_14',
        priority: 'important',
        binderTabLink: 'assets',
        caution: 'Do NOT allow mortgage servicers to force heirs into refinancing at higher market rates.',
        instructions: 'Under 12 U.S.C. § 1701j-3 (Garn-St. Germain Act), lenders cannot accelerate residential mortgages transferred to surviving relatives. Continue making standard monthly payments (PITI) from joint or estate funds. Notify the loan servicer in writing of the successor-in-interest status.'
      }
    ]
  },
  {
    id: 'days_15_45',
    badge: 'Phase 4: Days 15 to 45+',
    title: 'Financial Settlement & Probate',
    timeframeDescription: 'Opening estate accounts, publishing notices, taxes, and asset distribution',
    tasks: [
      {
        id: 't_letters',
        title: 'Obtain Letters Testamentary & Estate EIN',
        subtitle: 'Apply for IRS EIN and open dedicated Estate Checking Account',
        timeframe: 'days_15_45',
        priority: 'important',
        instructions: 'Obtain court appointment as Executor. Apply for an Estate Employer Identification Number (EIN) on irs.gov and open a dedicated "Estate of [Name]" bank account to deposit liquidation proceeds and pay validated claims.'
      },
      {
        id: 't_creditor_notice',
        title: 'Publish Formal Statutory Notice to Creditors',
        subtitle: 'Legally close the window for unfiled creditor debt claims',
        timeframe: 'days_15_45',
        priority: 'important',
        instructions: 'Coordinate with your probate attorney to publish the formal Notice to Creditors in the designated county newspaper of record. This starts the statutory clock (usually 3 to 9 months) to bar late debt claims forever.'
      },
      {
        id: 't_notify_agencies',
        title: 'Notify SSA, Credit Bureaus & DMV',
        subtitle: 'Prevent identity theft and auto-debit clawbacks',
        timeframe: 'days_15_45',
        priority: 'important',
        binderTabLink: 'tax',
        caution: 'Social Security pays in arrears. Any benefit payment received in the month of death will be automatically clawed back by the Treasury.',
        instructions: 'Funeral directors usually notify the Social Security Administration (SSA). Contact Experian, TransUnion, and Equifax to flag the credit file as "Deceased - Do Not Issue Credit".'
      },
      {
        id: 't_claim_pod',
        title: 'Transfer Named Beneficiary (POD / TOD) Accounts',
        subtitle: 'Direct transfers for 401(k), IRA, and bank accounts',
        timeframe: 'days_15_45',
        priority: 'important',
        binderTabLink: 'financial',
        instructions: 'Beneficiaries present certified death certificates to institutions in Section 4 to claim retirement funds, checking accounts, and brokerage assets directly without probate delay. Note: Direct stock certificate transfers require an official Medallion Signature Guarantee (notary stamps are rejected).'
      },
      {
        id: 't_final_taxes',
        title: 'Coordinate Final 1040 / 1041 Income Taxes with CPA',
        subtitle: 'File final individual tax return and explore Form 706 Portability',
        timeframe: 'days_15_45',
        priority: 'important',
        binderTabLink: 'tax',
        instructions: 'Provide the CPA in Section 10 with the last 3 years of Form 1040s to prepare the decedent’s final individual return and any estate income returns. For surviving spouses, discuss the Form 706 Portability Election (which has up to 5 years under Rev. Proc. 2022-32 for non-taxable estates).'
      }
    ]
  }
];
