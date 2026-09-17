import { useState, useEffect, useRef } from 'react';
import type { 
  LegacyBinderData, 
  ProfileData, 
  EmergencyPlan,
  PersonalInfo, 
  Contact, 
  LegalDocuments, 
  FinancialAccount, 
  RecurringPayment, 
  Asset, 
  InsurancePolicy, 
  MedicalProfile, 
  DigitalAccount, 
  TaxVitalRecords, 
  LegacyMemories, 
  SentimentalItem,
  PetCare,
  HistoryInterviewData
} from './types';
import { migrateBinderData, DEFAULT_BINDER_DATA } from './utils/migrations';

// Components
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { SectionNavFooter } from './components/common/SectionNavFooter';

// Modals
import { ExportModal } from './components/modals/ExportModal';
import { ImportModal } from './components/modals/ImportModal';
import { RenameProfileModal } from './components/modals/RenameProfileModal';
import { PrintOptionsModal, type PrintMode } from './components/modals/PrintOptionsModal';

// Sections
import { DashboardSection } from './components/sections/DashboardSection';
import { ExecutorChecklistSection } from './components/sections/ExecutorChecklistSection';
import { EmergencySection } from './components/sections/EmergencySection';
import { PersonalSection } from './components/sections/PersonalSection';
import { ContactsSection } from './components/sections/ContactsSection';
import { LegalSection } from './components/sections/LegalSection';
import { FinancialSection } from './components/sections/FinancialSection';
import { RecurringSection } from './components/sections/RecurringSection';
import { AssetsSection } from './components/sections/AssetsSection';
import { InsuranceSection } from './components/sections/InsuranceSection';
import { MedicalSection } from './components/sections/MedicalSection';
import { DigitalSection } from './components/sections/DigitalSection';
import { TaxVitalSection } from './components/sections/TaxVitalSection';
import { LegacySection } from './components/sections/LegacySection';
import { HistoryInterviewSection } from './components/sections/HistoryInterviewSection';
import { SentimentalPetsSection } from './components/sections/SentimentalPetsSection';

// Print Views
import { PrintBinder } from './components/print/PrintBinder';
import { PrintEmergencySheet } from './components/print/PrintEmergencySheet';

const STORAGE_KEY = 'legacy_binder_v2';
const V1_STORAGE_KEY = 'legacy_binder_v1';

const TABS_ORDER = [
  'dashboard',
  'executor_playbook',
  'emergency',
  'personal',
  'contacts',
  'medical',
  'financial',
  'assets',
  'insurance',
  'recurring',
  'legal',
  'tax',
  'digital',
  'legacy',
  'history_interview',
  'sentimental'
];

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Privacy Shield Mask State
  const [isPrivacyMasked, setIsPrivacyMasked] = useState<boolean>(() => {
    return localStorage.getItem('privacy_mask_default') === 'true';
  });

  const togglePrivacyMask = () => {
    setIsPrivacyMasked(prev => {
      const next = !prev;
      localStorage.setItem('privacy_mask_default', String(next));
      return next;
    });
  };

  // Main Binder State (with seamless backwards migration)
  const [binderData, setBinderData] = useState<LegacyBinderData>(() => {
    try {
      const v2Data = localStorage.getItem(STORAGE_KEY);
      if (v2Data) {
        return migrateBinderData(JSON.parse(v2Data));
      }
      const v1Data = localStorage.getItem(V1_STORAGE_KEY);
      if (v1Data) {
        const migrated = migrateBinderData(JSON.parse(v1Data));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    } catch (e) {
      console.error('Failed to load local binder data:', e);
    }
    return DEFAULT_BINDER_DATA;
  });

  // Active Profile & Tab
  const [activeProfileKey, setActiveProfileKey] = useState<string>('primary');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modal Visibility
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Print Configuration
  const [printMode, setPrintMode] = useState<PrintMode>('full');
  const [printMaskSensitive, setPrintMaskSensitive] = useState(false);

  // Auto-Save Status Feedback
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  // Save to LocalStorage with Reassurance Indicator
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setSaveStatus('saving');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(binderData));
    const timer = setTimeout(() => {
      setSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 350);
    return () => clearTimeout(timer);
  }, [binderData]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside standard inputs or modals
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput = targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select';

      // 1. Profile Switch: Alt + 1 (Primary), Alt + 2 (Secondary)
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        setActiveProfileKey('primary');
      } else if (e.altKey && e.key === '2') {
        e.preventDefault();
        setActiveProfileKey('secondary');
      }

      // 2. Privacy Shield Toggle: Alt + P
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        togglePrivacyMask();
      }

      // 3. Tab Cycle: Alt + ArrowLeft / Alt + ArrowRight (only outside input fields)
      if (e.altKey && !isInput) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const currentIndex = TABS_ORDER.indexOf(activeTab);
          if (currentIndex > 0) setActiveTab(TABS_ORDER[currentIndex - 1]);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          const currentIndex = TABS_ORDER.indexOf(activeTab);
          if (currentIndex < TABS_ORDER.length - 1) setActiveTab(TABS_ORDER[currentIndex + 1]);
        }
      }

      // 4. Save reassurance: Cmd/Ctrl + S
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setSaveStatus('saving');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(binderData));
        setTimeout(() => {
          setSaveStatus('saved');
          setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, binderData]);

  const activeProfile = binderData.profiles[activeProfileKey] || binderData.profiles.primary;

  // Generic profile updater
  const updateActiveProfile = (updates: Partial<ProfileData>) => {
    setBinderData(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString().split('T')[0],
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...(prev.profiles[activeProfileKey] || prev.profiles.primary),
          ...updates
        }
      }
    }));
  };

  // Section Not Applicable toggle
  const toggleSectionNotApplicable = (sectionId: string, isNA: boolean) => {
    const currentNA = activeProfile.notApplicableSections || {};
    updateActiveProfile({
      notApplicableSections: {
        ...currentNA,
        [sectionId]: isNA
      }
    });
  };

  // Profile-specific Sub-Module Updaters
  const updateEmergencyPlan = (updated: Partial<EmergencyPlan>) => {
    updateActiveProfile({ emergencyPlan: { ...activeProfile.emergencyPlan, ...updated } });
  };

  const updatePersonalInfo = (updated: Partial<PersonalInfo>) => {
    updateActiveProfile({ personalInfo: { ...activeProfile.personalInfo, ...updated } });
  };

  const updateLegalDocuments = (updated: Partial<LegalDocuments>) => {
    updateActiveProfile({ legalDocuments: { ...activeProfile.legalDocuments, ...updated } });
  };

  const updateMedicalProfile = (updated: Partial<MedicalProfile>) => {
    updateActiveProfile({ medicalProfile: { ...activeProfile.medicalProfile, ...updated } });
  };

  const updateTaxVitalRecords = (updated: Partial<TaxVitalRecords>) => {
    updateActiveProfile({ taxVitalRecords: { ...activeProfile.taxVitalRecords, ...updated } });
  };

  const updateLegacyMemories = (updated: Partial<LegacyMemories>) => {
    updateActiveProfile({ legacyMemories: { ...activeProfile.legacyMemories, ...updated } });
  };

  const updateHistoryInterview = (updated: HistoryInterviewData) => {
    updateActiveProfile({ historyInterview: updated });
  };

  // Contacts Handlers
  const addContact = (contact: Contact) => {
    updateActiveProfile({ contacts: [...activeProfile.contacts, contact] });
  };
  const setContacts = (contacts: Contact[]) => {
    updateActiveProfile({ contacts });
  };
  const updateContact = (id: string, updated: Partial<Contact>) => {
    updateActiveProfile({
      contacts: activeProfile.contacts.map(c => c.id === id ? { ...c, ...updated } : c)
    });
  };
  const deleteContact = (id: string) => {
    updateActiveProfile({
      contacts: activeProfile.contacts.filter(c => c.id !== id)
    });
  };

  // Financial Accounts Handlers
  const addFinancialAccount = (acc: FinancialAccount) => {
    updateActiveProfile({ financialAccounts: [...activeProfile.financialAccounts, acc] });
  };
  const setFinancialAccounts = (accounts: FinancialAccount[]) => {
    updateActiveProfile({ financialAccounts: accounts });
  };
  const updateFinancialAccount = (id: string, updated: Partial<FinancialAccount>) => {
    updateActiveProfile({
      financialAccounts: activeProfile.financialAccounts.map(a => a.id === id ? { ...a, ...updated } : a)
    });
  };
  const deleteFinancialAccount = (id: string) => {
    updateActiveProfile({
      financialAccounts: activeProfile.financialAccounts.filter(a => a.id !== id)
    });
  };

  // Recurring Payments Handlers
  const addRecurringPayment = (pay: RecurringPayment) => {
    updateActiveProfile({ recurringPayments: [...activeProfile.recurringPayments, pay] });
  };
  const setRecurringPayments = (payments: RecurringPayment[]) => {
    updateActiveProfile({ recurringPayments: payments });
  };
  const updateRecurringPayment = (id: string, updated: Partial<RecurringPayment>) => {
    updateActiveProfile({
      recurringPayments: activeProfile.recurringPayments.map(r => r.id === id ? { ...r, ...updated } : r)
    });
  };
  const deleteRecurringPayment = (id: string) => {
    updateActiveProfile({
      recurringPayments: activeProfile.recurringPayments.filter(r => r.id !== id)
    });
  };

  // Assets Handlers
  const addAsset = (asset: Asset) => {
    updateActiveProfile({ assets: [...activeProfile.assets, asset] });
  };
  const updateAsset = (id: string, updated: Partial<Asset>) => {
    updateActiveProfile({
      assets: activeProfile.assets.map(a => a.id === id ? { ...a, ...updated } : a)
    });
  };
  const deleteAsset = (id: string) => {
    updateActiveProfile({
      assets: activeProfile.assets.filter(a => a.id !== id)
    });
  };

  // Insurance Policies Handlers
  const addInsurancePolicy = (pol: InsurancePolicy) => {
    updateActiveProfile({ insurancePolicies: [...activeProfile.insurancePolicies, pol] });
  };
  const updateInsurancePolicy = (id: string, updated: Partial<InsurancePolicy>) => {
    updateActiveProfile({
      insurancePolicies: activeProfile.insurancePolicies.map(p => p.id === id ? { ...p, ...updated } : p)
    });
  };
  const deleteInsurancePolicy = (id: string) => {
    updateActiveProfile({
      insurancePolicies: activeProfile.insurancePolicies.filter(p => p.id !== id)
    });
  };

  // Digital Accounts Handlers
  const addDigitalAccount = (acc: DigitalAccount) => {
    updateActiveProfile({ digitalAccounts: [...activeProfile.digitalAccounts, acc] });
  };
  const setDigitalAccounts = (accounts: DigitalAccount[]) => {
    updateActiveProfile({ digitalAccounts: accounts });
  };
  const updateDigitalAccount = (id: string, updated: Partial<DigitalAccount>) => {
    updateActiveProfile({
      digitalAccounts: activeProfile.digitalAccounts.map(d => d.id === id ? { ...d, ...updated } : d)
    });
  };
  const deleteDigitalAccount = (id: string) => {
    updateActiveProfile({
      digitalAccounts: activeProfile.digitalAccounts.filter(d => d.id !== id)
    });
  };

  // Sentimental Items Handlers
  const addSentimentalItem = (item: SentimentalItem) => {
    updateActiveProfile({ sentimentalItems: [...activeProfile.sentimentalItems, item] });
  };
  const updateSentimentalItem = (id: string, updated: Partial<SentimentalItem>) => {
    updateActiveProfile({
      sentimentalItems: activeProfile.sentimentalItems.map(i => i.id === id ? { ...i, ...updated } : i)
    });
  };
  const deleteSentimentalItem = (id: string) => {
    updateActiveProfile({
      sentimentalItems: activeProfile.sentimentalItems.filter(i => i.id !== id)
    });
  };

  // Pets Handlers
  const addPet = (pet: PetCare) => {
    updateActiveProfile({ pets: [...activeProfile.pets, pet] });
  };
  const updatePet = (id: string, updated: Partial<PetCare>) => {
    updateActiveProfile({
      pets: activeProfile.pets.map(p => p.id === id ? { ...p, ...updated } : p)
    });
  };
  const deletePet = (id: string) => {
    updateActiveProfile({
      pets: activeProfile.pets.filter(p => p.id !== id)
    });
  };

  // Print Execution
  const handleConfirmPrint = (options: { mode: PrintMode; maskSensitive: boolean }) => {
    setPrintMode(options.mode);
    setPrintMaskSensitive(options.maskSensitive);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        binderData={binderData}
        activeProfileKey={activeProfileKey}
        activeTab={activeTab}
        onSelectProfile={key => setActiveProfileKey(key)}
        onSelectTab={tabId => setActiveTab(tabId)}
        onOpenPrintModal={() => setShowPrintModal(true)}
        onOpenExportModal={() => setShowExportModal(true)}
        onOpenImportModal={() => setShowImportModal(true)}
      />

      {/* Main Workspace Area */}
      <div className="main-wrapper">
        <Header
          profile={activeProfile}
          theme={theme}
          isPrivacyMasked={isPrivacyMasked}
          saveStatus={saveStatus}
          lastSavedTime={lastSavedTime}
          onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          onTogglePrivacyMask={togglePrivacyMask}
          onOpenRenameProfile={() => setShowRenameModal(true)}
        />

        <main className="main-content">
          {activeTab === 'dashboard' && (
            <DashboardSection
              profile={activeProfile}
              onNavigateTab={tabId => setActiveTab(tabId)}
              onOpenPrintModal={() => setShowPrintModal(true)}
              onOpenExportModal={() => setShowExportModal(true)}
            />
          )}

          {activeTab === 'executor_playbook' && (
            <ExecutorChecklistSection
              onNavigateTab={tabId => setActiveTab(tabId)}
              onOpenPrintModal={() => setShowPrintModal(true)}
            />
          )}

          {activeTab === 'emergency' && (
            <EmergencySection
              plan={activeProfile.emergencyPlan}
              isPrivacyMasked={isPrivacyMasked}
              isNotApplicable={!!activeProfile.notApplicableSections?.emergency}
              onUpdate={updateEmergencyPlan}
              onToggleNA={isNA => toggleSectionNotApplicable('emergency', isNA)}
            />
          )}

          {activeTab === 'personal' && (
            <PersonalSection
              info={activeProfile.personalInfo}
              isNotApplicable={!!activeProfile.notApplicableSections?.personal}
              onUpdate={updatePersonalInfo}
              onToggleNA={isNA => toggleSectionNotApplicable('personal', isNA)}
            />
          )}

          {activeTab === 'contacts' && (
            <ContactsSection
              contacts={activeProfile.contacts}
              isNotApplicable={!!activeProfile.notApplicableSections?.contacts}
              onAddContact={addContact}
              onSetContacts={setContacts}
              onUpdateContact={updateContact}
              onDeleteContact={deleteContact}
              onToggleNA={isNA => toggleSectionNotApplicable('contacts', isNA)}
            />
          )}

          {activeTab === 'legal' && (
            <LegalSection
              legal={activeProfile.legalDocuments}
              isPrivacyMasked={isPrivacyMasked}
              isNotApplicable={!!activeProfile.notApplicableSections?.legal}
              onUpdate={updateLegalDocuments}
              onToggleNA={isNA => toggleSectionNotApplicable('legal', isNA)}
            />
          )}

          {activeTab === 'financial' && (
            <FinancialSection
              accounts={activeProfile.financialAccounts}
              isPrivacyMasked={isPrivacyMasked}
              isNotApplicable={!!activeProfile.notApplicableSections?.financial}
              onAddAccount={addFinancialAccount}
              onSetAccounts={setFinancialAccounts}
              onUpdateAccount={updateFinancialAccount}
              onDeleteAccount={deleteFinancialAccount}
              onToggleNA={isNA => toggleSectionNotApplicable('financial', isNA)}
            />
          )}

          {activeTab === 'recurring' && (
            <RecurringSection
              payments={activeProfile.recurringPayments}
              isPrivacyMasked={isPrivacyMasked}
              isNotApplicable={!!activeProfile.notApplicableSections?.recurring}
              onAddPayment={addRecurringPayment}
              onSetPayments={setRecurringPayments}
              onUpdatePayment={updateRecurringPayment}
              onDeletePayment={deleteRecurringPayment}
              onToggleNA={isNA => toggleSectionNotApplicable('recurring', isNA)}
            />
          )}

          {activeTab === 'assets' && (
            <AssetsSection
              assets={activeProfile.assets}
              isPrivacyMasked={isPrivacyMasked}
              isNotApplicable={!!activeProfile.notApplicableSections?.assets}
              onAddAsset={addAsset}
              onUpdateAsset={updateAsset}
              onDeleteAsset={deleteAsset}
              onToggleNA={isNA => toggleSectionNotApplicable('assets', isNA)}
            />
          )}

          {activeTab === 'insurance' && (
            <InsuranceSection
              policies={activeProfile.insurancePolicies}
              isPrivacyMasked={isPrivacyMasked}
              isNotApplicable={!!activeProfile.notApplicableSections?.insurance}
              onAddPolicy={addInsurancePolicy}
              onUpdatePolicy={updateInsurancePolicy}
              onDeletePolicy={deleteInsurancePolicy}
              onToggleNA={isNA => toggleSectionNotApplicable('insurance', isNA)}
            />
          )}

          {activeTab === 'medical' && (
            <MedicalSection
              medical={activeProfile.medicalProfile}
              isNotApplicable={!!activeProfile.notApplicableSections?.medical}
              onUpdate={updateMedicalProfile}
              onToggleNA={isNA => toggleSectionNotApplicable('medical', isNA)}
            />
          )}

          {activeTab === 'digital' && (
            <DigitalSection
              accounts={activeProfile.digitalAccounts}
              isPrivacyMasked={isPrivacyMasked}
              isNotApplicable={!!activeProfile.notApplicableSections?.digital}
              onAddAccount={addDigitalAccount}
              onSetAccounts={setDigitalAccounts}
              onUpdateAccount={updateDigitalAccount}
              onDeleteAccount={deleteDigitalAccount}
              onToggleNA={isNA => toggleSectionNotApplicable('digital', isNA)}
            />
          )}

          {activeTab === 'tax' && (
            <TaxVitalSection
              records={activeProfile.taxVitalRecords}
              isNotApplicable={!!activeProfile.notApplicableSections?.tax}
              onUpdate={updateTaxVitalRecords}
              onToggleNA={isNA => toggleSectionNotApplicable('tax', isNA)}
            />
          )}

          {activeTab === 'legacy' && (
            <LegacySection
              memories={activeProfile.legacyMemories}
              isNotApplicable={!!activeProfile.notApplicableSections?.legacy}
              onUpdate={updateLegacyMemories}
              onToggleNA={isNA => toggleSectionNotApplicable('legacy', isNA)}
              onNavigateTab={tabId => setActiveTab(tabId)}
            />
          )}

          {activeTab === 'history_interview' && (
            <HistoryInterviewSection
              interviewData={activeProfile.historyInterview}
              isNotApplicable={!!activeProfile.notApplicableSections?.history_interview}
              onUpdate={updateHistoryInterview}
              onToggleNA={isNA => toggleSectionNotApplicable('history_interview', isNA)}
              onOpenPrintBook={() => handleConfirmPrint({ mode: 'history', maskSensitive: false })}
            />
          )}

          {activeTab === 'sentimental' && (
            <SentimentalPetsSection
              items={activeProfile.sentimentalItems}
              pets={activeProfile.pets}
              isNotApplicable={!!activeProfile.notApplicableSections?.sentimental}
              onAddItem={addSentimentalItem}
              onUpdateItem={updateSentimentalItem}
              onDeleteItem={deleteSentimentalItem}
              onAddPet={addPet}
              onUpdatePet={updatePet}
              onDeletePet={deletePet}
              onToggleNA={isNA => toggleSectionNotApplicable('sentimental', isNA)}
            />
          )}

          {/* Sequential Section Navigation Footer */}
          <SectionNavFooter
            currentTab={activeTab}
            onNavigateTab={tabId => setActiveTab(tabId)}
          />

          <footer className="app-platform-disclaimer-footer">
            <p><strong>Notice:</strong> DeathBinder is an administrative organization tool and does not provide legal, tax, financial, or medical advice. Consult licensed estate planning attorneys and CPAs in your jurisdiction.</p>
          </footer>
        </main>
      </div>

      {/* PRINT-ONLY VIEWS */}
      <div className="print-portal-container">
        {printMode === 'emergency' ? (
          <PrintEmergencySheet profile={activeProfile} maskSensitive={printMaskSensitive} />
        ) : (
          <PrintBinder profile={activeProfile} mode={printMode} maskSensitive={printMaskSensitive} />
        )}
      </div>

      {/* MODALS */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        binderData={binderData}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={imported => setBinderData(imported)}
      />

      <RenameProfileModal
        isOpen={showRenameModal}
        currentName={activeProfile.profileName}
        onClose={() => setShowRenameModal(false)}
        onSave={newName => updateActiveProfile({ profileName: newName })}
      />

      <PrintOptionsModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        onConfirmPrint={handleConfirmPrint}
      />
    </div>
  );
}
