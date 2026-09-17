export interface InfoDefinition {
  title: string;
  explanation: string;
  example?: string;
}

export const INFO_DEFINITIONS: Record<string, InfoDefinition> = {
  // Financial
  pod_tod_beneficiary: {
    title: 'Named Beneficiaries (POD / TOD) & Beneficiary Supremacy',
    explanation: 'A Payable on Death (POD) or Transfer on Death (TOD) designation tells a financial institution who immediately receives the account upon your passing. CRITICAL LEGAL RULE: Beneficiary designations supersede and override any contrary instructions in your Last Will & Testament. WARNING FOR MINORS: Never name a minor child directly as a POD beneficiary without designating a UTMA Custodian or Trust, or the funds will be locked in court-supervised guardianship.',
    example: 'Listing your spouse or adult child as the 100% beneficiary on your checking, IRA, or brokerage account allows them to claim the money directly with a death certificate and bypass probate court entirely.'
  },
  pod_beneficiary: {
    title: 'Named Beneficiaries (POD / TOD) & Beneficiary Supremacy',
    explanation: 'A Payable on Death (POD) or Transfer on Death (TOD) designation tells a financial institution who immediately receives the account upon your passing. CRITICAL LEGAL RULE: Beneficiary designations supersede and override any contrary instructions in your Last Will & Testament.',
    example: 'Listing your spouse or adult child as the 100% beneficiary allows them to claim funds directly with a death certificate, bypassing probate court.'
  },
  account_titling: {
    title: 'Account Ownership Titling & Day 1 Access',
    explanation: 'How an account is titled determines what happens the instant the bank learns of your passing. Sole accounts are immediately frozen pending probate court appointment of an executor. In contrast, Joint Accounts with Rights of Survivorship (JTWROS) and Living Trust accounts allow surviving owners or successor trustees immediate, uninterrupted Day 1 access to pay funeral and living expenses.',
    example: 'Having at least one JTWROS checking account with your spouse or adult child guarantees immediate cash is available for the funeral home and household mortgage.'
  },
  contingent_beneficiary: {
    title: 'Why Contingent (Secondary) Beneficiaries Are Critical',
    explanation: 'A contingent beneficiary is the backup recipient who inherits the account if your primary beneficiary passes away before you, or if both of you pass away simultaneously (e.g. in a common transit accident). Without a named contingent beneficiary, the account "lapses" into your probate estate, subjecting the funds to court delays, attorney fees, and creditor claims.',
    example: 'Naming "Primary: Spouse (100%), Contingent: Children equally (50% each)" ensures your money passes smoothly without probate even in a tragic simultaneous accident.'
  },
  institution_identifiers: {
    title: 'Why only write the last 4 digits?',
    explanation: 'For your security, never write full account numbers or plain passwords. When settling an estate, an executor only needs the Institution Name (e.g. Chase) and Last 4 Digits (e.g. ...4819) to present to the branch along with certified death certificates and Letters Testamentary.',
    example: 'Writing "Vanguard - Brokerage (...1092)" gives your executor everything necessary to locate and claim the account without exposing you to fraud while you are alive.'
  },
  medallion_signature: {
    title: 'What is a Medallion Signature Guarantee (MSG)?',
    explanation: 'A Medallion Signature Guarantee is a specialized security certification issued by participating financial institutions (STAMP, SEMP, or MSP programs) required to transfer physical stock certificates, DRS shares with transfer agents (Computershare, Equiniti), or securities accounts. Standard notary public stamps are legally rejected for securities transfers.',
    example: 'When transferring shares of public stock to an heir, your executor must obtain a Medallion Guarantee stamp from their commercial bank branch.'
  },

  // Legal & Decisions
  poa_vs_executor: {
    title: 'Power of Attorney vs. Executor: What is the difference?',
    explanation: 'A Financial Power of Attorney (POA) grants someone legal authority to pay bills and manage assets ONLY while you are alive. The exact second you pass away, all Powers of Attorney become legally void, and your court-appointed Executor (named in your Will) takes over. A Durable POA takes effect immediately upon signing; a Springing POA requires two physician certifications of incapacity, which can cause delays during medical emergencies.',
    example: 'Your agent holding your Power of Attorney cannot use it to manage your accounts after you pass. They must file your original Will with the probate court to receive formal Letters Testamentary.'
  },
  trust_funding: {
    title: 'Why Living Trusts Require "Funding" (Re-titling Assets)',
    explanation: 'Simply signing a Revocable Living Trust agreement does NOT avoid probate. You must formally change the title/ownership of your real estate deeds, brokerage accounts, and bank accounts into the name of the Trust (e.g. "John Smith, Trustee of the John Smith Revocable Trust"). Unfunded assets remain in your probate estate.',
    example: 'If you sign a trust but never record a new deed transferring your house to the trust, the house must still go through probate court upon your passing.'
  },
  healthcare_proxy: {
    title: 'What is a Healthcare Proxy (Medical Decision Maker)?',
    explanation: 'A Healthcare Proxy (or Medical Power of Attorney) is the trusted person you legally designate to make medical treatment decisions for you if you become unconscious, incapacitated, or unable to communicate.',
    example: 'If you are in a coma following a severe accident, your Healthcare Proxy speaks with treating physicians regarding surgical decisions based on your written values.'
  },
  living_will: {
    title: 'What is a Living Will & Advance Directive?',
    explanation: 'A Living Will is a legal document specifying your written choices regarding end-of-life medical treatments—such as mechanical ventilators, CPR, artificial nutrition/hydration, and pain management—if you are diagnosed with a terminal illness or permanent unconsciousness.',
    example: 'It gives doctors and loved ones clear, written permission to transition to comfort/hospice care rather than prolonged mechanical life support.'
  },
  safe_deposit_box: {
    title: 'Caution: Bank Safe Deposit Box Probate Freezes',
    explanation: 'In many states, banks are legally required to seal safe deposit boxes immediately upon learning of the account holder’s death until an executor obtains formal letters from the probate court. Never store emergency items (like your only original Will or burial instructions) in a solo bank box.',
    example: 'Keep your original Will in a home fireproof safe with a known key/combination, or ensure a co-owner is registered on your bank safe deposit box signature card.'
  },
  original_will: {
    title: 'Why is the Original Physical Will Required?',
    explanation: 'Probate courts require the physical original paper document bearing live ink signatures and notary seals. Digital scans or photocopies are heavily scrutinized and often require costly legal hearings to prove they were not revoked. WARNING: Never remove staples or alter court binding, as doing so creates a legal presumption of tampering or revocation.',
    example: 'Always record the exact physical location (e.g., "Top shelf of fire safe in bedroom closet") so your family can hand the original intact document to the estate attorney.'
  },

  // Crisis & Emergency
  cell_phone_2fa: {
    title: 'Crucial: Never Cancel the Mobile Phone Line Immediately',
    explanation: 'Family members often cancel a deceased person’s cell phone carrier plan immediately to stop monthly billing. This is a severe mistake: all banks, email accounts (Google, Apple), and password vaults require SMS two-factor verification codes sent to that phone number.',
    example: 'Keep the cell phone plan active for at least 6 months so the executor can log in, receive verification codes, and recover photos or financial records.'
  },
  death_certificates: {
    title: 'Why Order 10–15 Certified Copies of the Death Certificate?',
    explanation: 'Almost every institution—banks, county deed recorders, life insurance carriers, pension plans, title companies, and the DMV—requires an official certified copy with a raised state seal (photocopies are rejected). TIP: Order both Short-Form (no cause of death, for public real estate and banking records to protect medical privacy) and Long-Form (with medical cause of death, required for life insurance claims).',
    example: 'Ordering 10 to 15 certified copies directly through the funeral director saves weeks of delays compared to ordering them individually from county vital records offices later.'
  },
  estate_debts: {
    title: 'Important: Never Pay Estate Debts from Personal Funds',
    explanation: 'Surviving spouses and children are generally NOT personally liable for the credit card debts, medical bills, or personal loans of the deceased. Debts must be paid exclusively by the deceased’s estate during probate. EXCEPTIONS: You remain personally liable if you were a joint account co-borrower/co-signer, or in certain states under statutory spousal medical liability (Doctrine of Necessaries) or community property debt laws.',
    example: 'If debt collectors call demanding immediate payment for a solo credit card, the family should inform them that the estate is entering probate and provide the executor’s contact info.'
  },
  ftc_funeral_rule: {
    title: 'Your Consumer Rights Under the FTC Funeral Rule',
    explanation: 'Under the Federal Trade Commission (FTC) Funeral Rule (16 C.F.R. Part 453), funeral homes must provide you with an itemized General Price List (GPL) by law. You have the right to choose only the goods and services you want, purchase caskets or urns from third-party vendors without paying handling fees, and decline embalming for direct cremation or immediate burial.',
    example: 'You can request the itemized General Price List and choose direct cremation without being required to purchase a full package or expensive ceremonial casket.'
  },
  organ_donation: {
    title: 'Why Organ & Tissue Donation Requires Immediate Action',
    explanation: 'Organ and tissue donation (including corneas, heart valves, and skin grafts) must be retrieved within a strict 2 to 24-hour window following death. Clear written directives allow emergency medical staff to act in time.',
    example: 'Listing your registration status on your emergency sheet ensures EMTs and hospital staff honor your donation choice before the window closes.'
  },
  home_access_codes: {
    title: 'Why Record Door Codes & Safe Combinations?',
    explanation: 'In the first 24 hours, emergency contacts and executors must access the residence to secure the property, care for pets, and locate vital documents without calling emergency locksmiths or damaging physical locks.',
    example: 'Recording "Front door keypad code: 4921#" and "Fire safe combination: 18-92-04" enables immediate, non-destructive access.'
  },

  // Digital & Accounts
  rufadaa_digital: {
    title: 'Why Tech Companies Lock Accounts (Digital Legacy Laws)',
    explanation: 'Under federal and state privacy statutes (like RUFADAA), tech companies like Apple and Google cannot legally grant family members access to your accounts after death unless you have configured their built-in Legacy Contact settings or provided explicit written consent for electronic communication CONTENT (not just metadata).',
    example: 'Setting up Apple Legacy Contact in your iPhone settings generates an access key that lets your spouse download family photos and contacts with an official death certificate.'
  },

  // Assets & Taxes
  property_titling: {
    title: 'How Property Titling Affects Probate & Surviving Owners',
    explanation: 'Property owned solely in your individual name must pass through probate court. Property owned as "Joint Tenants with Right of Survivorship" (JTWROS), "Tenancy by the Entirety" (TBE for married couples), or held inside a Revocable Living Trust transfers immediately to the co-owner without probate.',
    example: 'If your house deed lists "John and Mary Smith, Joint Tenants with Right of Survivorship", full ownership automatically transfers to Mary upon John’s passing simply by recording a certified death certificate with the county clerk.'
  },
  tax_dd214: {
    title: 'What is a Military DD-214 & Why is it Critical?',
    explanation: 'A DD-214 is the Certificate of Release or Discharge from Active Duty issued to military veterans. The Veterans Administration (VA) requires this physical document to provide free burial in a national cemetery, a government-provided headstone, and military honor guard ceremonies.',
    example: 'Keeping a copy of your DD-214 in this binder allows your family to request VA burial benefits and the presentation of the ceremonial burial flag.'
  },
  recurring_stoppage: {
    title: 'Why List Recurring Bills & Subscriptions?',
    explanation: 'Automated recurring charges (streaming services, gym memberships, software subscriptions, insurance premiums) continue draining a bank account every month after death. A clear list allows the executor to cancel non-essential services immediately.',
    example: 'Canceling auto-renewing subscriptions prevents overdraft fees while keeping essential services (like electric and home heating) active until the home is sold.'
  },
  heirloom_memo: {
    title: 'What is a Personal Property Memorandum for Heirlooms?',
    explanation: 'Under Uniform Probate Code § 2-513, a Personal Property Memorandum is a written list referenced by your Will that designates who receives specific sentimental tangible belongings (like jewelry, family heirlooms, tools, or art). It can be updated at any time without paying an attorney to re-draft your Will (note: it cannot distribute cash, promissory notes, real estate, or titled vehicles).',
    example: 'Writing "Grandmother’s pearl necklace to granddaughter Sarah" in this record clearly communicates your wishes and prevents painful family disputes.'
  },

  // Clinical End-of-Life & Palliative Directives
  polst_vs_living_will: {
    title: 'POLST vs. Living Will: Why EMS Cannot Follow a Living Will Alone',
    explanation: 'A Living Will is an advisory legal document for doctors in a hospital. Emergency EMTs and Paramedics (911) CANNOT legally read or follow a Living Will during a cardiac arrest or breathing crisis. By law, EMS must perform aggressive CPR and intubation UNLESS presented with an official, physician-signed Out-of-Hospital DNR or POLST/MOLST form. In most states, this form must be physically posted on the outside of your refrigerator or the front door to be honored.',
    example: 'Keep your state-approved brightly colored POLST (signed by your doctor) magnetized to your kitchen refrigerator door where emergency responders are trained to look immediately.'
  },
  cpr_clinical_reality: {
    title: 'The Reality of CPR in Serious Illness and Frailty',
    explanation: 'Television shows depict CPR as saving over 70% of lives. In reality, for older adults with serious chronic illness or frailty, survival to leave the hospital with intact brain function is between 2% and 15%. Chest compressions break ribs in over 70% of older patients. Choosing "Allow Natural Death" (DNR) does NOT mean giving up care; it means ensuring a peaceful, pain-free transition without violent mechanical trauma when the heart naturally stops.',
    example: 'Selecting "Allow Natural Death" instructs medical staff to focus 100% on comfort, warmth, and dignity rather than aggressive electrical shocks and chest compressions.'
  },
  time_limited_trial: {
    title: 'What is a "Time-Limited Trial" of a Breathing Machine (Ventilator)?',
    explanation: 'Many people fear either dying too soon or being kept alive forever on machines. A Time-Limited Trial bridges this gap: you permit doctors to put you on a breathing machine for a brief, defined period (usually 3 to 7 days) to see if an acute, reversible condition (like severe pneumonia) heals. If there is no improvement or severe irreversible brain damage occurs, the breathing tube is removed with peaceful comfort medication so you pass away naturally.',
    example: '"Try the breathing machine for 3–5 days. If my lungs cannot breathe on their own or I suffer permanent brain damage, take the tube out and keep me comfortable."'
  },
  artificial_nutrition_hydration: {
    title: 'Food & IV Fluids at the End of Life: Why Less is More',
    explanation: 'When a person is naturally passing away, the digestive tract naturally downregulates. The brain produces natural pain-relieving endorphins that eliminate hunger and thirst. Giving IV fluids or feeding tubes in the final days causes water retention, leading to painful swelling in the legs, nausea, and fluid accumulating in the lungs ("death rattle"), making breathing noisy and difficult. Gentle mouth swabs with cold water or ice chips provide immense comfort without the risks of IV lines.',
    example: 'Authorizing "Pleasure Feeding Only" means offering favorite tastes and sips of liquid for enjoyment as long as desired, without placing artificial tubes into the stomach.'
  },
  double_effect_pain: {
    title: 'The Bioethics of Comfort: The Principle of Double Effect',
    explanation: 'Under the established medical and ethical "Principle of Double Effect," the clinical team\'s sole intention is relieving your pain, air hunger, and distress. Giving sufficient pain and calming medications (such as morphine) is completely legal, medically standard, and morally praised, even if a foreseeable secondary effect is deeper sleep or slightly hastening the biological moment of passing.',
    example: 'Choosing "Comfort First" gives your medical team full permission to make you completely calm and pain-free, even if you sleep for your remaining days.'
  },
  cognitive_thresholds: {
    title: 'Why Defining "Acceptable Quality of Life" Protects Your Family',
    explanation: 'The hardest moment for a spouse or child is standing in an ICU being asked: "Do we keep your parent on the ventilator or let them go?" Families carry lifelong guilt if they do not know what you consider worth living. By explicitly stating: "If I can never recognize my family or speak again, shift everything to comfort care," you take the burden off their shoulders and make the decision yourself.',
    example: 'Stating clearly in writing that you would not want life prolonged if you have severe dementia relieves your healthcare proxy of moral agonizing.'
  },
  hospice_comfort_kit: {
    title: 'What is a Hospice Emergency Comfort Kit ("E-Kit")?',
    explanation: 'When enrolled in home hospice, the hospice pharmacy delivers a small, sealed medication kit kept in the refrigerator. It contains concentrated liquid morphine (for acute pain and shortness of breath), Ativan (for agitation and anxiety), and patches to dry secretions. Knowing exactly where this box is allows family members to administer doctor-directed drops under the tongue within minutes during a crisis.',
    example: 'Keep the sealed blue Hospice Kit on the top shelf of the kitchen refrigerator and ensure your primary caregiver knows where it is.'
  },

  // Elder Law & Advance Directives Triad
  advance_directives_triad: {
    title: 'The Advance Healthcare Directives Triad',
    explanation: 'Comprehensive medical planning requires three distinct documents: (1) Healthcare Proxy (appoints WHO decides when you cannot), (2) Living Will (instructs WHAT medical treatments you consent to or refuse during terminal illness), and (3) Standalone HIPAA Release (authorizes WHO can receive your medical charts and talk to doctors immediately, without waiting for incapacity).',
    example: 'If you are conscious in an ER but too disoriented to manage complex calls, a standalone HIPAA release lets your adult children speak to treating physicians immediately without declaring you incompetent.'
  },
  right_of_sepulcher: {
    title: 'Right of Sepulcher & The Cremation Freeze',
    explanation: 'The "Right of Sepulcher" is the legal authority to control final body disposition. Because cremation is 100% irreversible, funeral directors face severe civil liability for unauthorized cremations. Under state law, if you do not designate a specific disposition agent in writing, funeral homes require notarized written consent from ALL surviving adult children. If one estranged sibling cannot be found or objects, the mortuary will freeze the cremation and demand a court order.',
    example: 'Executing an official statutory "Appointment of Agent to Control Disposition of Remains" grants your designated agent ironclad legal authority to order cremation without obtaining sibling signatures.'
  },
  whole_body_donation_rules: {
    title: 'Whole-Body Anatomical Donation vs. Organ Donation',
    explanation: 'Registering as an organ donor on your driver\'s license only covers transplant organs. Whole-body anatomical donation to medical science requires formal pre-death registration with an accredited medical school or bio-bank. Furthermore, programs regularly reject donors at death due to autopsies, infectious disease, or because organs were harvested for transplant. A secondary, funded disposition backup plan (such as direct cremation) is legally and practically mandatory.',
    example: 'Complete enrollment with a willed-body program in advance, and confirm with your family that if the university declines the gift at death, your backup preference is direct cremation.'
  },

  // Estate Liquidity & Financial Continuity
  bank_death_freeze: {
    title: 'The "Bank Death Freeze" on Solo Accounts',
    explanation: 'When financial institutions learn of an account holder\'s death, all sole accounts are immediately frozen. Powers of Attorney expire instantly upon death. The bank will not release a single dollar until the probate court issues formal Letters Testamentary (which can take 4 to 12 weeks). Only Joint Accounts with Survivorship (JTWROS), Trust Accounts, and accounts with named Payable on Death (POD) beneficiaries remain accessible.',
    example: 'Ensure at least one checking account is held jointly with survivorship rights, or maintain an emergency cash buffer in a home fireproof safe to pay immediate living expenses.'
  },
  funeral_liquidity_buffer: {
    title: 'Securing Immediate Funeral Liquidity ($5,000–$15,000)',
    explanation: 'Funeral homes, cemeteries, and crematories routinely require immediate payment or deposit before carrying out services. If the deceased\'s only bank account is frozen, family members are forced to pay out-of-pocket or advance personal credit cards. Preparing a funded pre-need contract, joint account, or life insurance funeral assignment avoids acute financial distress.',
    example: 'Listing "Chase Joint Checking has $10,000 liquid buffer for mortuary expenses" gives surviving family immediate peace of mind.'
  },
  credit_card_authorized_user: {
    title: 'Credit Cards: Authorized Users vs. Co-Signers',
    explanation: 'When a primary cardholder passes away, the account is closed immediately. All cards issued to secondary "Authorized Users" (frequently surviving spouses or adult children) are canceled automatically. Surviving spouses who only held authorized user cards suddenly find themselves with zero credit. WARNING: Charging purchases on a deceased person\'s card constitutes credit card fraud.',
    example: 'If a surviving spouse is only an authorized user, help them open an independent credit card immediately so their purchasing power is not cut off.'
  },
  garn_st_germain_mortgage: {
    title: 'Inherited Mortgages: The Garn-St. Germain Federal Protection',
    explanation: 'Under federal law (12 U.S.C. § 1701j-3, Garn-St. Germain Act), mortgage lenders are strictly prohibited from exercising "Due-on-Sale" acceleration clauses when residential real estate (1 to 4 units) transfers to an inheriting relative upon the borrower\'s death. Heirs do NOT need to refinance into higher interest rates; they have the statutory right under CFPB rules to simply continue making existing monthly mortgage payments.',
    example: 'Surviving relatives can continue paying the existing 3% mortgage without paying refinancing fees or higher interest rates.'
  }
};
