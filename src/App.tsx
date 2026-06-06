import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Users, DollarSign, Home, Key, FileCheck, Layers, 
  Download, Upload, Printer, Edit3, Trash2, Plus, 
  AlertCircle, HelpCircle, ChevronDown, ChevronUp, User, 
  FileText, Shield, Sparkles, CheckCircle2, Info, Sun, Moon
} from 'lucide-react';
import type { 
  LegacyBinderData, ProfileData, PersonalInfo, Contact, 
  FinancialAccount, Asset, InsurancePolicy, MedicalProfile, 
  DigitalAccount, FinalArrangements, LegacyMemories, SentimentalItem,
  PetCare 
} from './types';
import { encryptData, decryptData } from './utils/crypto';

// Helper to create a new empty profile
const createEmptyProfile = (name: string): ProfileData => ({
  profileName: name,
  personalInfo: {
    fullName: '',
    dateOfBirth: '',
    currentAddress: '',
    phone: '',
    email: '',
    employer: '',
    militaryService: '',
    groupsOrganizations: '',
    notes: '',
  },
  contacts: [
    { id: 'c1', name: '', relationship: 'Executor of Will', phone: '', email: '', notes: '' },
    { id: 'c2', name: '', relationship: 'Estate Attorney', phone: '', email: '', notes: '' }
  ],
  financialAccounts: [],
  assets: [],
  insurancePolicies: [],
  medicalProfile: {
    bloodType: '',
    allergies: '',
    conditions: '',
    medications: '',
    primaryPhysician: '',
    livingWillLocation: '',
    organDonor: 'undecided',
    notes: '',
  },
  digitalAccounts: [],
  finalArrangements: {
    willLocation: '',
    trustLocation: '',
    powerOfAttorneyLocation: '',
    funeralHomePreference: '',
    disposition: '',
    serviceWishes: '',
    eulogyNotes: '',
    personalLettersLocation: '',
    notes: '',
  },
  legacyMemories: {
    familyOrigins: '',
    traditionsRecipes: '',
    lifeLessonsWisdom: '',
    bucketListCompleted: '',
    bucketListFuture: '',
    notes: '',
  },
  sentimentalItems: [],
  pets: []
});

const DEFAULT_DATA: LegacyBinderData = {
  version: 1,
  lastUpdated: new Date().toISOString().split('T')[0],
  profiles: {
    primary: createEmptyProfile('My Packet'),
    secondary: createEmptyProfile("Spouse's Packet")
  }
};

const STORAGE_KEY = 'legacy_binder_v1';

export default function App() {
  // Theme State (Dark mode)
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

  // Main State
  const [binderData, setBinderData] = useState<LegacyBinderData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local storage binder data', e);
      }
    }
    return DEFAULT_DATA;
  });

  // Active Profile key: 'primary' or 'secondary'
  const [activeProfileKey, setActiveProfileKey] = useState<'primary' | 'secondary'>('primary');
  
  // Navigation active tab: 'dashboard' or 'personal' | 'contacts' | 'financial' | 'assets' | 'insurance' | 'medical' | 'digital' | 'estate'
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Active item being edited in list forms
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // UI state for collapses, modal, renames
  const [isRenamingProfile, setIsRenamingProfile] = useState(false);
  const [tempProfileName, setTempProfileName] = useState('');
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(true);

  // Encryption modals
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState('');
  const [importPassword, setImportPassword] = useState('');
  const [importFileContent, setImportFileContent] = useState<string>('');
  const [importError, setImportError] = useState('');
  const [exportError, setExportError] = useState('');
  const [encryptExport, setEncryptExport] = useState(true);

  // Auto-save feedback states
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  // Sync state with local storage with auto-save animation feedback
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
      const d = new Date();
      setLastSavedTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 400);
    return () => clearTimeout(timer);
  }, [binderData]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Switch profile: Alt + 1 (Primary), Alt + 2 (Secondary)
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        setActiveProfileKey('primary');
      } else if (e.altKey && e.key === '2') {
        e.preventDefault();
        setActiveProfileKey('secondary');
      }
      
      // 2. Switch tab: Alt + ArrowLeft (Previous Tab), Alt + ArrowRight (Next Tab)
      const TABS = [
        'dashboard', 'personal', 'contacts', 'digital', 
        'financial', 'assets', 'insurance', 'medical', 
        'estate', 'legacy', 'sentimental'
      ];
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        const currentIndex = TABS.indexOf(activeTab);
        if (currentIndex > 0) {
          setActiveTab(TABS[currentIndex - 1]);
        }
      } else if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        const currentIndex = TABS.indexOf(activeTab);
        if (currentIndex < TABS.length - 1) {
          setActiveTab(TABS[currentIndex + 1]);
        }
      }

      // 3. Escape key to clear editing item
      if (e.key === 'Escape') {
        setEditingItemId(null);
      }

      // 4. Ctrl + S / Cmd + S to show saving reassurance feedback
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setSaveStatus('saving');
        setTimeout(() => {
          setSaveStatus('saved');
          const d = new Date();
          setLastSavedTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Reset editing item when changing sections or profiles
  useEffect(() => {
    setEditingItemId(null);
  }, [activeTab, activeProfileKey]);

  const activeProfile = binderData.profiles[activeProfileKey];

  // Update specific sub-sections of active profile
  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setBinderData(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString().split('T')[0],
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          personalInfo: { ...prev.profiles[activeProfileKey].personalInfo, ...info }
        }
      }
    }));
  };

  const updateMedicalProfile = (medical: Partial<MedicalProfile>) => {
    setBinderData(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString().split('T')[0],
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          medicalProfile: { ...prev.profiles[activeProfileKey].medicalProfile, ...medical }
        }
      }
    }));
  };

  const updateFinalArrangements = (estate: Partial<FinalArrangements>) => {
    setBinderData(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString().split('T')[0],
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          finalArrangements: { ...prev.profiles[activeProfileKey].finalArrangements, ...estate }
        }
      }
    }));
  };

  const updateLegacyMemories = (memories: Partial<LegacyMemories>) => {
    setBinderData(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString().split('T')[0],
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          legacyMemories: { ...prev.profiles[activeProfileKey].legacyMemories, ...memories }
        }
      }
    }));
  };

  const addSentimentalItem = () => {
    const newId = 's_' + Date.now();
    const newItem: SentimentalItem = {
      id: newId,
      description: '',
      significance: '',
      recipient: '',
      notes: ''
    };
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          sentimentalItems: [...prev.profiles[activeProfileKey].sentimentalItems, newItem]
        }
      }
    }));
    setEditingItemId(newId);
  };

  const updateSentimentalItem = (id: string, updated: Partial<SentimentalItem>) => {
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          sentimentalItems: prev.profiles[activeProfileKey].sentimentalItems.map(item => item.id === id ? { ...item, ...updated } : item)
        }
      }
    }));
  };

  const deleteSentimentalItem = (id: string) => {
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          sentimentalItems: prev.profiles[activeProfileKey].sentimentalItems.filter(item => item.id !== id)
        }
      }
    }));
  };

  const addPet = () => {
    const newId = 'p_' + Date.now();
    const newPet: PetCare = {
      id: newId,
      petName: '',
      typeBreed: '',
      vetContact: '',
      careInstructions: '',
      designatedGuardian: '',
      notes: ''
    };
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          pets: [...prev.profiles[activeProfileKey].pets, newPet]
        }
      }
    }));
    setEditingItemId(newId);
  };

  const updatePet = (id: string, updated: Partial<PetCare>) => {
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          pets: prev.profiles[activeProfileKey].pets.map(pet => pet.id === id ? { ...pet, ...updated } : pet)
        }
      }
    }));
  };

  const deletePet = (id: string) => {
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          pets: prev.profiles[activeProfileKey].pets.filter(pet => pet.id !== id)
        }
      }
    }));
  };

  // Helper lists handlers
  const addContact = () => {
    const newId = 'c_' + Date.now();
    const newContact: Contact = {
      id: newId,
      name: '',
      relationship: '',
      phone: '',
      email: '',
      notes: ''
    };
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          contacts: [...prev.profiles[activeProfileKey].contacts, newContact]
        }
      }
    }));
    setEditingItemId(newId);
  };

  const updateContact = (id: string, updated: Partial<Contact>) => {
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          contacts: prev.profiles[activeProfileKey].contacts.map(c => c.id === id ? { ...c, ...updated } : c)
        }
      }
    }));
  };

  const deleteContact = (id: string) => {
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          contacts: prev.profiles[activeProfileKey].contacts.filter(c => c.id !== id)
        }
      }
    }));
  };

  const addFinancialAccount = () => {
    const newId = 'f_' + Date.now();
    const newAccount: FinancialAccount = {
      id: newId,
      institution: '',
      accountType: '',
      accountIdentifier: '',
      website: '',
      notes: ''
    };
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          financialAccounts: [...prev.profiles[activeProfileKey].financialAccounts, newAccount]
        }
      }
    }));
    setEditingItemId(newId);
  };

  const updateFinancialAccount = (id: string, updated: Partial<FinancialAccount>) => {
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          financialAccounts: prev.profiles[activeProfileKey].financialAccounts.map(a => a.id === id ? { ...a, ...updated } : a)
        }
      }
    }));
  };

  const deleteFinancialAccount = (id: string) => {
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          financialAccounts: prev.profiles[activeProfileKey].financialAccounts.filter(a => a.id !== id)
        }
      }
    }));
  };

  const addAsset = () => {
    const newId = 'a_' + Date.now();
    const newAsset: Asset = {
      id: newId,
      description: '',
      category: 'other',
      location: '',
      titleHolder: '',
      estimatedValue: '',
      notes: ''
    };
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          assets: [...prev.profiles[activeProfileKey].assets, newAsset]
        }
      }
    }));
    setEditingItemId(newId);
  };

  const updateAsset = (id: string, updated: Partial<Asset>) => {
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          assets: prev.profiles[activeProfileKey].assets.map(a => a.id === id ? { ...a, ...updated } : a)
        }
      }
    }));
  };

  const deleteAsset = (id: string) => {
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          assets: prev.profiles[activeProfileKey].assets.filter(a => a.id !== id)
        }
      }
    }));
  };

  const addInsurancePolicy = () => {
    const newId = 'i_' + Date.now();
    const newPolicy: InsurancePolicy = {
      id: newId,
      provider: '',
      policyType: '',
      policyNumber: '',
      coverageAmount: '',
      beneficiaries: '',
      contactNumber: '',
      notes: ''
    };
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          insurancePolicies: [...prev.profiles[activeProfileKey].insurancePolicies, newPolicy]
        }
      }
    }));
    setEditingItemId(newId);
  };

  const updateInsurancePolicy = (id: string, updated: Partial<InsurancePolicy>) => {
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          insurancePolicies: prev.profiles[activeProfileKey].insurancePolicies.map(p => p.id === id ? { ...p, ...updated } : p)
        }
      }
    }));
  };

  const deleteInsurancePolicy = (id: string) => {
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          insurancePolicies: prev.profiles[activeProfileKey].insurancePolicies.filter(p => p.id !== id)
        }
      }
    }));
  };

  const addDigitalAccount = () => {
    const newId = 'd_' + Date.now();
    const newDigital: DigitalAccount = {
      id: newId,
      platform: '',
      username: '',
      recoveryEmailPhone: '',
      digitalExecutor: '',
      notes: ''
    };
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          digitalAccounts: [...prev.profiles[activeProfileKey].digitalAccounts, newDigital]
        }
      }
    }));
    setEditingItemId(newId);
  };

  const updateDigitalAccount = (id: string, updated: Partial<DigitalAccount>) => {
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          digitalAccounts: prev.profiles[activeProfileKey].digitalAccounts.map(a => a.id === id ? { ...a, ...updated } : a)
        }
      }
    }));
  };

  const deleteDigitalAccount = (id: string) => {
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          digitalAccounts: prev.profiles[activeProfileKey].digitalAccounts.filter(a => a.id !== id)
        }
      }
    }));
  };

  // Section completion calculations
  const getSectionCompletion = (profile: ProfileData, section: string): number => {
    const checkFieldsFilled = (obj: any): number => {
      const keys = Object.keys(obj).filter(k => k !== 'notes');
      if (keys.length === 0) return 100;
      const filled = keys.filter(k => obj[k] !== undefined && obj[k] !== null && obj[k] !== '');
      return Math.round((filled.length / keys.length) * 100);
    };

    switch (section) {
      case 'personal':
        return checkFieldsFilled(profile.personalInfo);
      case 'contacts':
        const namedContacts = profile.contacts.filter(c => c.name.trim() !== '');
        return namedContacts.length > 0 ? 100 : 0;
      case 'financial':
        const filledAccounts = profile.financialAccounts.filter(a => a.institution.trim() !== '');
        return filledAccounts.length > 0 ? 100 : 0;
      case 'assets':
        const filledAssets = profile.assets.filter(a => a.description.trim() !== '');
        return filledAssets.length > 0 ? 100 : 0;
      case 'insurance':
        const filledPolicies = profile.insurancePolicies.filter(p => p.provider.trim() !== '');
        return filledPolicies.length > 0 ? 100 : 0;
      case 'medical':
        return checkFieldsFilled(profile.medicalProfile);
      case 'digital':
        const filledDigitals = profile.digitalAccounts.filter(a => a.platform.trim() !== '');
        return filledDigitals.length > 0 ? 100 : 0;
      case 'estate':
        return checkFieldsFilled(profile.finalArrangements);
      case 'legacy':
        return checkFieldsFilled(profile.legacyMemories);
      case 'sentimental':
        const hasSentimental = profile.sentimentalItems.some(s => s.description.trim() !== '');
        const hasPets = profile.pets.some(p => p.petName.trim() !== '');
        return (hasSentimental || hasPets) ? 100 : 0;
      default:
        return 0;
    }
  };

  const getOverallCompletion = (profile: ProfileData): number => {
    const sections = ['personal', 'contacts', 'financial', 'assets', 'insurance', 'medical', 'digital', 'estate', 'legacy', 'sentimental'];
    const total = sections.reduce((acc, sec) => acc + getSectionCompletion(profile, sec), 0);
    return Math.round(total / sections.length);
  };

  // File Import/Export Mechanics
  const handleExport = async () => {
    try {
      let exportString = JSON.stringify(binderData, null, 2);
      let filename = `legacy-binder-${new Date().toISOString().split('T')[0]}.json`;

      if (encryptExport) {
        if (!encryptionPassword) {
          setExportError('Encryption password is required when encryption is enabled.');
          return;
        }
        exportString = await encryptData(exportString, encryptionPassword);
        filename = `legacy-binder-encrypted-${new Date().toISOString().split('T')[0]}.json`;
      }

      const blob = new Blob([exportString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      
      // Reset Export Modal state
      setShowExportModal(false);
      setEncryptionPassword('');
      setExportError('');
    } catch (e) {
      setExportError('Failed to generate export file. Check your password or try again.');
      console.error(e);
    }
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportFileContent(text);
      
      // Determine if encrypted or plain JSON
      try {
        const parsed = JSON.parse(text);
        if (parsed.salt && parsed.iv && parsed.ciphertext) {
          // It's encrypted!
          setImportError('');
        } else if (parsed.version && parsed.profiles) {
          // Plain binder JSON!
          setImportError('');
        } else {
          setImportError('Invalid file structure. This does not appear to be a Legacy Binder file.');
        }
      } catch (err) {
        setImportError('Failed to parse file. Make sure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = async () => {
    if (!importFileContent) {
      setImportError('Please select a valid binder file first.');
      return;
    }

    try {
      let dataToParse = importFileContent;
      const parsed = JSON.parse(importFileContent);

      // Decrypt if it's encrypted
      if (parsed.salt && parsed.iv && parsed.ciphertext) {
        if (!importPassword) {
          setImportError('This file is encrypted. Please enter the password.');
          return;
        }
        dataToParse = await decryptData(importFileContent, importPassword);
      }

      const finalData: LegacyBinderData = JSON.parse(dataToParse);
      if (finalData.version && finalData.profiles) {
        setBinderData(finalData);
        setShowImportModal(false);
        setImportPassword('');
        setImportFileContent('');
        setImportError('');
        alert('Binder data successfully imported!');
      } else {
        throw new Error('Missing core binder sections');
      }
    } catch (err: any) {
      setImportError(err.message || 'Decryption/Import failed. Check the password and try again.');
    }
  };

  const handleResetData = () => {
    if (confirm('Are you absolutely sure you want to delete all binder data? This action is permanent and cannot be undone.')) {
      setBinderData(DEFAULT_DATA);
      setActiveTab('dashboard');
      alert('All local data has been reset.');
    }
  };

  const handleRenameProfile = () => {
    if (!tempProfileName.trim()) return;
    setBinderData(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [activeProfileKey]: {
          ...prev.profiles[activeProfileKey],
          profileName: tempProfileName.trim()
        }
      }
    }));
    setIsRenamingProfile(false);
  };

  const triggerPrint = () => {
    window.print();
  };

  // Reusable Form Input Renderer
  const renderInput = (
    label: string, 
    value: string, 
    onChange: (val: string) => void, 
    placeholder = '', 
    type = 'text',
    isTextArea = false
  ) => {
    return (
      <div className="form-group">
        <label>{label}</label>
        <div className="no-print">
          {isTextArea ? (
            <textarea
              className="form-input"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
            />
          ) : (
            <input
              type={type}
              className="form-input"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
            />
          )}
        </div>
        <span className={`print-only print-val ${!value ? 'print-val-empty' : ''}`}>
          {value || 'Not provided'}
        </span>
      </div>
    );
  };

  // Reusable Collapsible Guidance Box
  const renderGuidance = (title: string, tips: string[]) => {
    return (
      <div className="guidance-box no-print">
        <div 
          className="guidance-header" 
          onClick={() => setIsGuidanceOpen(!isGuidanceOpen)}
        >
          <HelpCircle size={18} />
          <span>{title} Guidance & Tips</span>
          {isGuidanceOpen ? <ChevronUp size={16} style={{marginLeft: 'auto'}} /> : <ChevronDown size={16} style={{marginLeft: 'auto'}} />}
        </div>
        {isGuidanceOpen && (
          <div className="guidance-content">
            <ul>
              {tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Sidebar Panel */}
      <aside className="sidebar no-print">
        <div className="logo-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles className="logo-icon" size={24} />
            <span className="logo-text">Legacy Binder</span>
          </div>
          <button 
            className="theme-toggle"
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>

        {/* Profile Switcher */}
        <div className="profile-card">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase'}}>
              Active Profile
            </span>
            <button 
              className="btn" 
              style={{padding: '2px 6px', fontSize: '0.75rem', display: 'flex', gap: '4px', background: 'transparent', border: 'none', color: 'var(--accent-secondary)'}}
              onClick={() => {
                setTempProfileName(activeProfile.profileName);
                setIsRenamingProfile(!isRenamingProfile);
              }}
            >
              <Edit3 size={12} /> Rename
            </button>
          </div>

          {isRenamingProfile ? (
            <div style={{marginTop: '8px', display: 'flex', gap: '4px'}}>
              <input
                type="text"
                className="profile-rename-input"
                value={tempProfileName}
                onChange={(e) => setTempProfileName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRenameProfile(); }}
                autoFocus
              />
              <button 
                className="btn btn-primary" 
                style={{padding: '4px 8px', marginTop: '8px', fontSize: '0.8rem'}}
                onClick={handleRenameProfile}
              >
                Save
              </button>
            </div>
          ) : (
            <div style={{fontSize: '1.05rem', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px'}}>
              <User size={16} className="logo-icon" />
              {activeProfile.profileName}
            </div>
          )}

          <div className="profile-selector">
            <button 
              className={`profile-tab ${activeProfileKey === 'primary' ? 'active' : ''}`}
              onClick={() => { setActiveProfileKey('primary'); setIsRenamingProfile(false); }}
            >
              Primary
            </button>
            <button 
              className={`profile-tab ${activeProfileKey === 'secondary' ? 'active' : ''}`}
              onClick={() => { setActiveProfileKey('secondary'); setIsRenamingProfile(false); }}
            >
              Spouse
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-menu">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="nav-label">
              <Layers className="nav-icon" />
              <span>Dashboard Overview</span>
            </div>
            <span className="nav-progress-badge">{getOverallCompletion(activeProfile)}%</span>
          </div>

          <div className="nav-section-title">Logistics & Contacts</div>
          
          <div 
            className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <div className="nav-label">
              <User className="nav-icon" />
              <span>Personal Info</span>
            </div>
            <span className={`nav-progress-badge ${getSectionCompletion(activeProfile, 'personal') === 100 ? 'completed' : ''}`}>
              {getSectionCompletion(activeProfile, 'personal')}%
            </span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            <div className="nav-label">
              <Users className="nav-icon" />
              <span>Key Contacts</span>
            </div>
            <span className={`nav-progress-badge ${getSectionCompletion(activeProfile, 'contacts') === 100 ? 'completed' : ''}`}>
              {getSectionCompletion(activeProfile, 'contacts')}%
            </span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'digital' ? 'active' : ''}`}
            onClick={() => setActiveTab('digital')}
          >
            <div className="nav-label">
              <Key className="nav-icon" />
              <span>Digital Accounts</span>
            </div>
            <span className={`nav-progress-badge ${getSectionCompletion(activeProfile, 'digital') === 100 ? 'completed' : ''}`}>
              {getSectionCompletion(activeProfile, 'digital')}%
            </span>
          </div>

          <div className="nav-section-title">Financial & Assets</div>

          <div 
            className={`nav-item ${activeTab === 'financial' ? 'active' : ''}`}
            onClick={() => setActiveTab('financial')}
          >
            <div className="nav-label">
              <DollarSign className="nav-icon" />
              <span>Bank & Credit</span>
            </div>
            <span className={`nav-progress-badge ${getSectionCompletion(activeProfile, 'financial') === 100 ? 'completed' : ''}`}>
              {getSectionCompletion(activeProfile, 'financial')}%
            </span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'assets' ? 'active' : ''}`}
            onClick={() => setActiveTab('assets')}
          >
            <div className="nav-label">
              <Home className="nav-icon" />
              <span>Real Estate & Safes</span>
            </div>
            <span className={`nav-progress-badge ${getSectionCompletion(activeProfile, 'assets') === 100 ? 'completed' : ''}`}>
              {getSectionCompletion(activeProfile, 'assets')}%
            </span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'insurance' ? 'active' : ''}`}
            onClick={() => setActiveTab('insurance')}
          >
            <div className="nav-label">
              <FileCheck className="nav-icon" />
              <span>Insurance Policies</span>
            </div>
            <span className={`nav-progress-badge ${getSectionCompletion(activeProfile, 'insurance') === 100 ? 'completed' : ''}`}>
              {getSectionCompletion(activeProfile, 'insurance')}%
            </span>
          </div>

          <div className="nav-section-title">Legacy & Wishes</div>

          <div 
            className={`nav-item ${activeTab === 'medical' ? 'active' : ''}`}
            onClick={() => setActiveTab('medical')}
          >
            <div className="nav-label">
              <Heart className="nav-icon" />
              <span>Medical History</span>
            </div>
            <span className={`nav-progress-badge ${getSectionCompletion(activeProfile, 'medical') === 100 ? 'completed' : ''}`}>
              {getSectionCompletion(activeProfile, 'medical')}%
            </span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'estate' ? 'active' : ''}`}
            onClick={() => setActiveTab('estate')}
          >
            <div className="nav-label">
              <FileText className="nav-icon" />
              <span>Final Arrangements</span>
            </div>
            <span className={`nav-progress-badge ${getSectionCompletion(activeProfile, 'estate') === 100 ? 'completed' : ''}`}>
              {getSectionCompletion(activeProfile, 'estate')}%
            </span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'legacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('legacy')}
          >
            <div className="nav-label">
              <Sparkles className="nav-icon" />
              <span>Legacy & Memories</span>
            </div>
            <span className={`nav-progress-badge ${getSectionCompletion(activeProfile, 'legacy') === 100 ? 'completed' : ''}`}>
              {getSectionCompletion(activeProfile, 'legacy')}%
            </span>
          </div>

          <div 
            className={`nav-item ${activeTab === 'sentimental' ? 'active' : ''}`}
            onClick={() => setActiveTab('sentimental')}
          >
            <div className="nav-label">
              <Heart className="nav-icon" />
              <span>Sentimental & Pets</span>
            </div>
            <span className={`nav-progress-badge ${getSectionCompletion(activeProfile, 'sentimental') === 100 ? 'completed' : ''}`}>
              {getSectionCompletion(activeProfile, 'sentimental')}%
            </span>
          </div>
        </nav>

        {/* Global Sidebar Actions */}
        <div className="sidebar-actions">
          <button className="btn btn-primary" onClick={triggerPrint}>
            <Printer size={16} /> Print Binder
          </button>
          
          <div style={{display: 'flex', gap: '8px'}}>
            <button className="btn btn-secondary" style={{flex: 1}} onClick={() => setShowExportModal(true)}>
              <Download size={14} /> Backup
            </button>
            <button className="btn btn-secondary" style={{flex: 1}} onClick={() => setShowImportModal(true)}>
              <Upload size={14} /> Restore
            </button>
          </div>

          <button className="btn btn-danger" style={{marginTop: '12px'}} onClick={handleResetData}>
            Reset All
          </button>

          {/* Keyboard Shortcuts Cheatsheet */}
          <div className="shortcuts-cheatsheet">
            <span className="shortcuts-title">Keyboard Shortcuts</span>
            <div className="shortcut-row">
              <span>Alt + 1 / 2</span>
              <span>Switch Profile</span>
            </div>
            <div className="shortcut-row">
              <span>Alt + ← / →</span>
              <span>Next/Prev Section</span>
            </div>
            <div className="shortcut-row">
              <span>Esc</span>
              <span>Done Editing</span>
            </div>
            <div className="shortcut-row">
              <span>Ctrl + S</span>
              <span>Force Save</span>
            </div>
          </div>

          <div style={{fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px'}}>
            Last updated: {binderData.lastUpdated}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Print Cover Page (visible only when printing) */}
        <div className="print-only print-cover">
          <h1 className="print-cover-title">Legacy Continuity Binder</h1>
          <p className="print-cover-subtitle">Important Estate, Financial, and Personal Records</p>
          <div className="print-cover-meta">
            <div style={{marginBottom: '8px'}}><strong>Prepared For:</strong> {activeProfile.profileName}</div>
            <div><strong>Last Updated:</strong> {binderData.lastUpdated}</div>
          </div>
          <p style={{marginTop: '60px', fontSize: '9pt', color: '#555', maxWidth: '400px', textAlign: 'center'}}>
            Notice: This document contains sensitive personal and financial details. Store securely in a lockbox or fireproof safe.
          </p>
        </div>

        {/* Top Header Bar for Status & Actions */}
        <div className="main-header no-print">
          <div className="main-header-left">
            <span className="main-header-profile">
              Profile: <strong>{activeProfile.profileName}</strong>
            </span>
            <span className="main-header-sep">|</span>
            <span className="main-header-reassurance">
              Private Offline Draft (saved in browser)
            </span>
          </div>
          <div className="main-header-right">
            <div className={`save-status-indicator save-status-${saveStatus}`}>
              <span className="save-status-dot"></span>
              <span>
                {saveStatus === 'saving' 
                  ? 'Saving draft...' 
                  : `Draft saved at ${lastSavedTime}`}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DASHBOARD VIEW */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="no-print">
            <div className="security-alert">
              <Shield size={24} style={{color: 'var(--accent-success)', flexShrink: 0}} />
              <div className="security-alert-content">
                <h4>Offline & Secure Storage</h4>
                <p>
                  To maximize privacy, all information entered is stored directly in your local browser storage. No data is transmitted to the cloud. You can export a secure, encrypted backup file below for safe keeping.
                </p>
              </div>
            </div>

            <div className="form-card glass-panel" style={{marginBottom: '28px'}}>
              <h2 style={{fontFamily: 'var(--font-family-title)', fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px', color: 'var(--accent-secondary)'}}>
                {activeProfile.profileName}
              </h2>
              <p style={{color: 'var(--text-muted)', marginBottom: '20px'}}>
                Welcome to your estate continuity packet. Fill out the sections on the left. Once completed, print it to attach to your will, and back up your digital files.
              </p>

              <div className="dashboard-grid">
                <div className="stat-card glass-panel">
                  <span className="stat-title">Overall Progress</span>
                  <span className="stat-value">{getOverallCompletion(activeProfile)}%</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{width: `${getOverallCompletion(activeProfile)}%`}}></div>
                  </div>
                </div>

                <div className="stat-card glass-panel">
                  <span className="stat-title">Contacts & Assets</span>
                  <span className="stat-value" style={{fontSize: '1.75rem'}}>
                    {activeProfile.contacts.filter(c => c.name).length} Contacts / {activeProfile.assets.length} Assets
                  </span>
                  <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Active items documented</span>
                </div>

                <div className="stat-card glass-panel">
                  <span className="stat-title">Print Status</span>
                  <span className="stat-value" style={{fontSize: '1.65rem', display: 'flex', gap: '8px', alignItems: 'center'}}>
                    {getOverallCompletion(activeProfile) > 80 ? (
                      <><CheckCircle2 size={24} style={{color: 'var(--accent-success)'}} /> Ready to Print</>
                    ) : (
                      <><Info size={24} style={{color: 'var(--accent-warning)'}} /> Draft mode</>
                    )}
                  </span>
                  <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Attach physical copy to your will</span>
                </div>
              </div>
            </div>

            <div className="glass-panel vision-panel">
              <h4 style={{fontFamily: 'var(--font-family-title)', color: 'var(--accent-secondary)', fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px'}}>
                <Sparkles size={16} /> Product Vision: AI Legacy Interviewer
              </h4>
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                Imagine if you didn't have to type this out. In the future, this binder could feature a gentle, private AI interviewer that talks with you and your spouse directly—helping you tell your stories, list your accounts conversationally, and automatically compiling your continuity packet.
              </p>
            </div>

            {/* Completion by Section Table */}
            <div className="dashboard-table-card glass-panel">
              <h3>Section Checklist</h3>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                {[
                  {
                    title: "Logistics & Contacts",
                    items: [
                      { id: 'personal', name: 'Personal & Background Profile', desc: 'Biographical history, employment, and service details', icon: <User size={18} /> },
                      { id: 'contacts', name: 'Key Contacts & Family', desc: 'Executors, attorneys, doctors, family members to notify', icon: <Users size={18} /> },
                      { id: 'digital', name: 'Digital Accounts & Subscriptions', desc: 'Recovery details, subscription renewals, social media rules', icon: <Key size={18} /> },
                    ]
                  },
                  {
                    title: "Financial & Assets",
                    items: [
                      { id: 'financial', name: 'Financial Accounts & Liabilities', desc: 'Banks, investments, retirement accounts, credit cards', icon: <DollarSign size={18} /> },
                      { id: 'assets', name: 'Physical Assets & Safes', desc: 'Real estate properties, vehicles, safes, storage locker codes', icon: <Home size={18} /> },
                      { id: 'insurance', name: 'Insurance Policies', desc: 'Life, health, auto, homeowners, and disability details', icon: <FileCheck size={18} /> },
                    ]
                  },
                  {
                    title: "Legacy & Wishes",
                    items: [
                      { id: 'medical', name: 'Medical Profile & Directives', desc: 'Blood type, medications, medical directives, living will location', icon: <Heart size={18} /> },
                      { id: 'estate', name: 'Estate Plans & Final arrangements', desc: 'Location of original Will, funeral preferences, obituary notes', icon: <FileText size={18} /> },
                      { id: 'legacy', name: 'Legacy, Memories & Ancestry', desc: 'Ancestry origins, holiday traditions, life wisdom, and checked/unchecked bucket lists', icon: <Sparkles size={18} /> },
                      { id: 'sentimental', name: 'Sentimental Items & Pets', desc: 'High sentimental belongings distribution registry, detailed pet care arrangements', icon: <Heart size={18} /> },
                    ]
                  }
                ].map(pillar => (
                  <div key={pillar.title} style={{marginBottom: '24px'}}>
                    <h4 style={{
                      fontSize: '0.8rem', 
                      color: 'var(--accent-secondary)', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em', 
                      marginBottom: '12px',
                      borderBottom: '1px solid var(--border-color)',
                      paddingBottom: '4px'
                    }}>
                      {pillar.title}
                    </h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                      {pillar.items.map(sec => {
                        const comp = getSectionCompletion(activeProfile, sec.id);
                        return (
                          <div key={sec.id} className="category-row">
                            <div className="category-info">
                              <div style={{color: comp === 100 ? 'var(--accent-success)' : 'var(--text-muted)', background: 'var(--bg-input)', padding: '8px', borderRadius: '8px'}}>
                                {sec.icon}
                              </div>
                              <div className="category-details">
                                <h4 style={{cursor: 'pointer'}} onClick={() => setActiveTab(sec.id)}>{sec.name}</h4>
                                <p>{sec.desc}</p>
                              </div>
                            </div>
                            <div className="category-progress-col">
                              <div className="progress-bar-container" style={{flex: 1}}>
                                <div 
                                  className="progress-bar-fill" 
                                  style={{
                                    width: `${comp}%`,
                                    background: comp === 100 ? 'var(--accent-success)' : 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))'
                                  }}
                                ></div>
                              </div>
                              <span className="category-percentage" style={{color: comp === 100 ? 'var(--accent-success)' : 'var(--text-main)'}}>
                                {comp}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 1: PERSONAL INFORMATION */}
        {/* ========================================================================= */}
        {activeTab === 'personal' && (
          <div className="form-card glass-panel no-print">
            <div className="form-header">
              <div className="form-title-group">
                <h2>Personal & Background Information</h2>
                <p>Basic biographical and personal history to help executors draft obituaries or resolve employment/tax matters.</p>
              </div>
            </div>

            {renderGuidance(
              "Personal Profile", 
              [
                "Full Legal Name: Include any suffixes (Jr, III) and maiden names to avoid confusion on official certificates.",
                "Employer Details: Helps human resource departments resolve final payouts, pension transitions, and healthcare benefit extensions.",
                "Military Record: Documenting service allows executors to claim VA burial benefits, flags, or pension increments.",
                "Groups & Memberships: Include professional associations, alumni groups, or unions which might offer auxiliary death benefits."
              ]
            )}

            <div className="form-grid">
              {renderInput("Full Legal Name", activeProfile.personalInfo.fullName, (val) => updatePersonalInfo({ fullName: val }), "e.g. John Albert Smith")}
              {renderInput("Date of Birth", activeProfile.personalInfo.dateOfBirth, (val) => updatePersonalInfo({ dateOfBirth: val }), "e.g. November 12, 1978", "text")}
              
              <div className="form-grid-full">
                {renderInput("Current Home Address", activeProfile.personalInfo.currentAddress, (val) => updatePersonalInfo({ currentAddress: val }), "Street, City, State, ZIP")}
              </div>
              
              {renderInput("Primary Phone", activeProfile.personalInfo.phone, (val) => updatePersonalInfo({ phone: val }), "e.g. (555) 019-2834")}
              {renderInput("Primary Email", activeProfile.personalInfo.email, (val) => updatePersonalInfo({ email: val }), "e.g. john.smith@domain.com")}
              
              {renderInput("Current Employer & Contact Info", activeProfile.personalInfo.employer, (val) => updatePersonalInfo({ employer: val }), "Company Name, HR phone, manager contact")}
              {renderInput("Military Service Record", activeProfile.personalInfo.militaryService, (val) => updatePersonalInfo({ militaryService: val }), "Branch, years, rank, location of DD-214")}
              
              <div className="form-grid-full">
                {renderInput("Organizations, Clubs & Memberships", activeProfile.personalInfo.groupsOrganizations, (val) => updatePersonalInfo({ groupsOrganizations: val }), "Clubs, professional unions, alumni associations")}
              </div>
              <div className="form-grid-full">
                {renderInput("Biographical Notes / Additional History", activeProfile.personalInfo.notes, (val) => updatePersonalInfo({ notes: val }), "Any extra background info to compile for obituaries or historical context", "text", true)}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: KEY CONTACTS */}
        {/* ========================================================================= */}
        {activeTab === 'contacts' && (
          <div className="form-card glass-panel no-print">
            <div className="form-header">
              <div className="form-title-group">
                <h2>Key Contacts & Advisors</h2>
                <p>The individuals and professional advisors who need to be notified or called upon to execute your wishes.</p>
              </div>
            </div>

            {renderGuidance(
              "Key Contacts",
              [
                "Executors: Identify who has the primary copy of your will and is legally responsible for administration.",
                "Advisors: Put down your CPA, estate attorney, insurance brokers, or financial planners so they can quickly freeze/transfer accounts.",
                "Specific Relatives/Friends: Identify key neighbors or friends who know emergency arrangements (like pet care or housesitting)."
              ]
            )}

            <div>
              <div className="summary-grid">
                {activeProfile.contacts.map(contact => {
                  const isEditing = contact.id === editingItemId;
                  if (isEditing) {
                    return (
                      <div key={contact.id} className="list-item-card form-grid-full" style={{gridColumn: 'span 2'}}>
                        <div className="list-item-card-header">
                          <span className="list-item-index">Editing Contact</span>
                          <div style={{display: 'flex', gap: '8px'}}>
                            <button 
                              className="btn btn-primary" 
                              style={{padding: '4px 12px', fontSize: '0.8rem'}}
                              onClick={() => setEditingItemId(null)}
                            >
                              Done
                            </button>
                            <button 
                              className="btn btn-danger no-print" 
                              style={{padding: '4px 12px', fontSize: '0.8rem'}}
                              onClick={() => { deleteContact(contact.id); setEditingItemId(null); }}
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        </div>
                        <div className="form-grid">
                          {renderInput("Contact Name", contact.name, (val) => updateContact(contact.id, { name: val }), "Full Name")}
                          {renderInput("Relationship / Role", contact.relationship, (val) => updateContact(contact.id, { relationship: val }), "e.g. Executor, Attorney, Daughter")}
                          {renderInput("Phone Number", contact.phone, (val) => updateContact(contact.id, { phone: val }), "(555) 123-4567")}
                          {renderInput("Email Address", contact.email, (val) => updateContact(contact.id, { email: val }), "name@example.com")}
                          <div className="form-grid-full">
                            {renderInput("Notes / Instructions", contact.notes, (val) => updateContact(contact.id, { notes: val }), "e.g. 'Has key to safe', 'Call immediately to handle funeral logistics'")}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={contact.id} className="summary-card">
                      <div>
                        <div className="summary-card-title">{contact.name || "Unnamed Contact"}</div>
                        <div className="summary-card-subtitle">{contact.relationship || "No relationship specified"}</div>
                        {contact.phone && <div className="summary-card-text">📞 {contact.phone}</div>}
                        {contact.email && <div className="summary-card-text">✉️ {contact.email}</div>}
                      </div>
                      <div className="summary-card-actions">
                        <button 
                          className="btn btn-secondary" 
                          style={{padding: '4px 8px', fontSize: '0.75rem'}}
                          onClick={() => setEditingItemId(contact.id)}
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{padding: '4px 8px', fontSize: '0.75rem'}}
                          onClick={() => deleteContact(contact.id)}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button className="add-item-btn no-print" onClick={addContact}>
                <Plus size={16} /> Add New Contact / Advisor
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: FINANCIAL ACCOUNTS */}
        {/* ========================================================================= */}
        {activeTab === 'financial' && (
          <div className="form-card glass-panel no-print">
            <div className="form-header">
              <div className="form-title-group">
                <h2>Financial Accounts & Liabilities</h2>
                <p>Document financial institutions, checking/savings, retirement plans, credit cards, and mortgage details.</p>
              </div>
            </div>

            {renderGuidance(
              "Financial Security Advice",
              [
                "Security Recommendation: DO NOT document full passwords, PINs, or complete account numbers here.",
                "Identification: Use institutional names (e.g. Chase Bank) and the last 4 digits of account numbers. This is sufficient for executors to identify accounts without exposing them to identity theft.",
                "Liabilities: List credit cards, mortgages, auto loans, and outstanding lines of credit. This ensures bills are paid and balances aren't defaulted."
              ]
            )}

            <div>
              <div className="summary-grid">
                {activeProfile.financialAccounts.map(account => {
                  const isEditing = account.id === editingItemId;
                  if (isEditing) {
                    return (
                      <div key={account.id} className="list-item-card form-grid-full" style={{gridColumn: 'span 2'}}>
                        <div className="list-item-card-header">
                          <span className="list-item-index">Editing Financial Record</span>
                          <div style={{display: 'flex', gap: '8px'}}>
                            <button 
                              className="btn btn-primary" 
                              style={{padding: '4px 12px', fontSize: '0.8rem'}}
                              onClick={() => setEditingItemId(null)}
                            >
                              Done
                            </button>
                            <button 
                              className="btn btn-danger no-print" 
                              style={{padding: '4px 12px', fontSize: '0.8rem'}}
                              onClick={() => { deleteFinancialAccount(account.id); setEditingItemId(null); }}
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        </div>
                        <div className="form-grid">
                          {renderInput("Institution", account.institution, (val) => updateFinancialAccount(account.id, { institution: val }), "e.g. Vanguard, Chase, Wells Fargo")}
                          {renderInput("Account Type", account.accountType, (val) => updateFinancialAccount(account.id, { accountType: val }), "e.g. checking, IRA, Credit Card, Mortgage")}
                          {renderInput("Identifier (Last 4 Digits)", account.accountIdentifier, (val) => updateFinancialAccount(account.id, { accountIdentifier: val }), "e.g. x-4321")}
                          {renderInput("Website Log-In Page", account.website, (val) => updateFinancialAccount(account.id, { website: val }), "e.g. vanguard.com")}
                          <div className="form-grid-full">
                            {renderInput("Account Details & Notes", account.notes, (val) => updateFinancialAccount(account.id, { notes: val }), "e.g. Joint account with spouse, Autopay active on 15th, Beneficiary designated")}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={account.id} className="summary-card">
                      <div>
                        <div className="summary-card-title">{account.institution || "Unnamed Institution"}</div>
                        <div className="summary-card-subtitle">{account.accountType || "No type specified"}</div>
                        {account.accountIdentifier && <div className="summary-card-text">🆔 Last 4: {account.accountIdentifier}</div>}
                        {account.website && <div className="summary-card-text">🌐 {account.website}</div>}
                      </div>
                      <div className="summary-card-actions">
                        <button 
                          className="btn btn-secondary" 
                          style={{padding: '4px 8px', fontSize: '0.75rem'}}
                          onClick={() => setEditingItemId(account.id)}
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{padding: '4px 8px', fontSize: '0.75rem'}}
                          onClick={() => deleteFinancialAccount(account.id)}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button className="add-item-btn no-print" onClick={addFinancialAccount}>
                <Plus size={16} /> Add Financial Account or Liability
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: ASSETS & VALUABLES */}
        {/* ========================================================================= */}
        {activeTab === 'assets' && (
          <div className="form-card glass-panel no-print">
            <div className="form-header">
              <div className="form-title-group">
                <h2>Real Estate, Vehicles & Physical Safes</h2>
                <p>Location and details of physical properties, vehicles, collections, and home storage units.</p>
              </div>
            </div>

            {renderGuidance(
              "Assets & Physical Safes",
              [
                "Safe Location & Code: Safe locations and combinations/keys are critical. Be descriptive about where keys are hidden.",
                "Real Estate Deeds: State where original house deeds, titles, or mortgage contracts are stored.",
                "Storage Units: List storage facility names, unit numbers, key locations, and who has authorized gate access."
              ]
            )}

            <div>
              <div className="summary-grid">
                {activeProfile.assets.map(asset => {
                  const isEditing = asset.id === editingItemId;
                  if (isEditing) {
                    return (
                      <div key={asset.id} className="list-item-card form-grid-full" style={{gridColumn: 'span 2'}}>
                        <div className="list-item-card-header">
                          <span className="list-item-index">Editing Physical Asset</span>
                          <div style={{display: 'flex', gap: '8px'}}>
                            <button 
                              className="btn btn-primary" 
                              style={{padding: '4px 12px', fontSize: '0.8rem'}}
                              onClick={() => setEditingItemId(null)}
                            >
                              Done
                            </button>
                            <button 
                              className="btn btn-danger no-print" 
                              style={{padding: '4px 12px', fontSize: '0.8rem'}}
                              onClick={() => { deleteAsset(asset.id); setEditingItemId(null); }}
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        </div>
                        <div className="form-grid">
                          <div className="form-grid-full">
                            {renderInput("Asset Description", asset.description, (val) => updateAsset(asset.id, { description: val }), "e.g. Main Residence, 2020 Chevrolet Traverse, Master Bedroom Fireproof Safe")}
                          </div>
                          <div className="form-group">
                            <label>Category</label>
                            <div className="no-print">
                              <select 
                                className="form-input"
                                value={asset.category}
                                onChange={(e) => updateAsset(asset.id, { category: e.target.value as any })}
                              >
                                <option value="real_estate">Real Estate / Land</option>
                                <option value="vehicle">Vehicle (Car/Boat)</option>
                                <option value="valuable">Jewelry / Collections / Cash</option>
                                <option value="safe_storage">Safe / Safety Deposit Box</option>
                                <option value="other">Other Asset</option>
                              </select>
                            </div>
                            <span className="print-only print-val">
                              {asset.category.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          {renderInput("Title Holder / Owner Name", asset.titleHolder, (val) => updateAsset(asset.id, { titleHolder: val }), "e.g. Joint Owners, John Smith Only")}
                          {renderInput("Physical Location", asset.location, (val) => updateAsset(asset.id, { location: val }), "Where is the asset, safe key, or safety box?")}
                          {renderInput("Estimated Value", asset.estimatedValue, (val) => updateAsset(asset.id, { estimatedValue: val }), "e.g. $450,000, Bluebook $18,500")}
                          <div className="form-grid-full">
                            {renderInput("Access Codes / Key Instructions / Notes", asset.notes, (val) => updateAsset(asset.id, { notes: val }), "e.g. Code is 4821; Key is in safety box at Chase Bank. Vehicle title is in filing cabinet.")}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={asset.id} className="summary-card">
                      <div>
                        <div className="summary-card-title">{asset.description || "Unnamed Asset"}</div>
                        <div className="summary-card-subtitle" style={{textTransform: 'capitalize'}}>
                          📁 {asset.category.replace('_', ' ')}
                        </div>
                        {asset.location && <div className="summary-card-text">📍 Location: {asset.location}</div>}
                        {asset.estimatedValue && <div className="summary-card-text">💰 Value: {asset.estimatedValue}</div>}
                      </div>
                      <div className="summary-card-actions">
                        <button 
                          className="btn btn-secondary" 
                          style={{padding: '4px 8px', fontSize: '0.75rem'}}
                          onClick={() => setEditingItemId(asset.id)}
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{padding: '4px 8px', fontSize: '0.75rem'}}
                          onClick={() => deleteAsset(asset.id)}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button className="add-item-btn no-print" onClick={addAsset}>
                <Plus size={16} /> Add Asset / Safe Location
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5: INSURANCE POLICIES */}
        {/* ========================================================================= */}
        {activeTab === 'insurance' && (
          <div className="form-card glass-panel no-print">
            <div className="form-header">
              <div className="form-title-group">
                <h2>Insurance Policies</h2>
                <p>Information on active life, health, auto, homeowner, disability, and long-term care policies.</p>
              </div>
            </div>

            {renderGuidance(
              "Insurance Claiming Tips",
              [
                "Life Insurance: List beneficiaries explicitly. The executor must contact them to initiate claims.",
                "Policy Storage: Make a note if policies are physical folders or digital documents (like PDF in email).",
                "Contacts: List agency customer care phone numbers to make claim notifications efficient."
              ]
            )}

            <div>
              <div className="summary-grid">
                {activeProfile.insurancePolicies.map(policy => {
                  const isEditing = policy.id === editingItemId;
                  if (isEditing) {
                    return (
                      <div key={policy.id} className="list-item-card form-grid-full" style={{gridColumn: 'span 2'}}>
                        <div className="list-item-card-header">
                          <span className="list-item-index">Editing Insurance Record</span>
                          <div style={{display: 'flex', gap: '8px'}}>
                            <button 
                              className="btn btn-primary" 
                              style={{padding: '4px 12px', fontSize: '0.8rem'}}
                              onClick={() => setEditingItemId(null)}
                            >
                              Done
                            </button>
                            <button 
                              className="btn btn-danger no-print" 
                              style={{padding: '4px 12px', fontSize: '0.8rem'}}
                              onClick={() => { deleteInsurancePolicy(policy.id); setEditingItemId(null); }}
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        </div>
                        <div className="form-grid">
                          {renderInput("Insurance Provider", policy.provider, (val) => updateInsurancePolicy(policy.id, { provider: val }), "e.g. MetLife, State Farm, BlueShield")}
                          {renderInput("Policy Type", policy.policyType, (val) => updateInsurancePolicy(policy.id, { policyType: val }), "e.g. Life (Term), Life (Whole), Health, Auto, Homeowners")}
                          {renderInput("Policy Number", policy.policyNumber, (val) => updateInsurancePolicy(policy.id, { policyNumber: val }), "Policy / Group ID")}
                          {renderInput("Coverage Amount", policy.coverageAmount, (val) => updateInsurancePolicy(policy.id, { coverageAmount: val }), "e.g. $500,000, full medical")}
                          {renderInput("Primary Beneficiaries", policy.beneficiaries, (val) => updateInsurancePolicy(policy.id, { beneficiaries: val }), "Who is the policy payable to?")}
                          {renderInput("Agency Contact Number", policy.contactNumber, (val) => updateInsurancePolicy(policy.id, { contactNumber: val }), "Claims phone number")}
                          <div className="form-grid-full">
                            {renderInput("Filing Cabinet / Document Location & Notes", policy.notes, (val) => updateInsurancePolicy(policy.id, { notes: val }), "e.g. Original is in file drawer 2; payments are auto-drafted annually.")}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={policy.id} className="summary-card">
                      <div>
                        <div className="summary-card-title">{policy.provider || "Unnamed Provider"}</div>
                        <div className="summary-card-subtitle">{policy.policyType || "No type specified"}</div>
                        {policy.coverageAmount && <div className="summary-card-text">🛡️ Coverage: {policy.coverageAmount}</div>}
                        {policy.beneficiaries && <div className="summary-card-text">👤 Beneficiary: {policy.beneficiaries}</div>}
                      </div>
                      <div className="summary-card-actions">
                        <button 
                          className="btn btn-secondary" 
                          style={{padding: '4px 8px', fontSize: '0.75rem'}}
                          onClick={() => setEditingItemId(policy.id)}
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{padding: '4px 8px', fontSize: '0.75rem'}}
                          onClick={() => deleteInsurancePolicy(policy.id)}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button className="add-item-btn no-print" onClick={addInsurancePolicy}>
                <Plus size={16} /> Add Insurance Policy
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 6: MEDICAL PROFILE */}
        {/* ========================================================================= */}
        {activeTab === 'medical' && (
          <div className="form-card glass-panel no-print">
            <div className="form-header">
              <div className="form-title-group">
                <h2>Medical Profile & Directives</h2>
                <p>Crucial information regarding health, active medication, doctor contacts, and medical powers of attorney.</p>
              </div>
            </div>

            {renderGuidance(
              "Medical Directives Guidance",
              [
                "Living Will / DNR: State explicitly if you have a Living Will, DNR (Do Not Resuscitate), or Medical Power of Attorney, and exactly where it is.",
                "Organ Donation: Ensure family members know your donation choices; legally, family permission is checked first.",
                "Medications: Keeping a list of medications and allergies helps doctors in emergency critical care."
              ]
            )}

            <div className="form-grid">
              {renderInput("Blood Type", activeProfile.medicalProfile.bloodType, (val) => updateMedicalProfile({ bloodType: val }), "e.g. O+, A-")}
              
              <div className="form-group">
                <label>Organ Donor Status</label>
                <div className="no-print">
                  <select 
                    className="form-input"
                    value={activeProfile.medicalProfile.organDonor}
                    onChange={(e) => updateMedicalProfile({ organDonor: e.target.value as any })}
                  >
                    <option value="undecided">Undecided / No Statement</option>
                    <option value="yes">Yes (Registered Donor)</option>
                    <option value="no">No (Prefer Not to Donate)</option>
                  </select>
                </div>
                <span className="print-only print-val">
                  {activeProfile.medicalProfile.organDonor.toUpperCase()}
                </span>
              </div>

              <div className="form-grid-full">
                {renderInput("Allergies", activeProfile.medicalProfile.allergies, (val) => updateMedicalProfile({ allergies: val }), "Food, drugs, environmental allergies")}
              </div>
              <div className="form-grid-full">
                {renderInput("Active Chronic Medical Conditions", activeProfile.medicalProfile.conditions, (val) => updateMedicalProfile({ conditions: val }), "e.g. Diabetes, hypertension, asthma")}
              </div>
              <div className="form-grid-full">
                {renderInput("Current Medications & Dosages", activeProfile.medicalProfile.medications, (val) => updateMedicalProfile({ medications: val }), "List name of drug, dosage, and frequency")}
              </div>

              {renderInput("Primary Care Physician & Phone", activeProfile.medicalProfile.primaryPhysician, (val) => updateMedicalProfile({ primaryPhysician: val }), "Dr. Name, clinic, phone")}
              {renderInput("Living Will / Medical Directive Location", activeProfile.medicalProfile.livingWillLocation, (val) => updateMedicalProfile({ livingWillLocation: val }), "Where is the physical copy of your medical directive?")}
              
              <div className="form-grid-full">
                {renderInput("Medical Notes / Family History", activeProfile.medicalProfile.notes, (val) => updateMedicalProfile({ notes: val }), "Other instructions for doctors or emergency medical responders", "text", true)}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 7: DIGITAL LEGACY */}
        {/* ========================================================================= */}
        {activeTab === 'digital' && (
          <div className="form-card glass-panel no-print">
            <div className="form-header">
              <div className="form-title-group">
                <h2>Digital Accounts & Legacy Rules</h2>
                <p>Instructions for handling online profiles, primary emails, cloud photos, and device passcodes.</p>
              </div>
            </div>

            {renderGuidance(
              "Digital Legacy Safety",
              [
                "Password Managers: The safest approach is to list one main record for your master password manager (1Password, Bitwarden) rather than typing individual passwords.",
                "Digital Executor: Appoint a trusted person to shut down or memorialize your social profiles.",
                "Devices: List access PINs for laptops and phones so family can recover contact lists or personal photo libraries."
              ]
            )}

            <div>
              <div className="summary-grid">
                {activeProfile.digitalAccounts.map(account => {
                  const isEditing = account.id === editingItemId;
                  if (isEditing) {
                    return (
                      <div key={account.id} className="list-item-card form-grid-full" style={{gridColumn: 'span 2'}}>
                        <div className="list-item-card-header">
                          <span className="list-item-index">Editing Digital Profile</span>
                          <div style={{display: 'flex', gap: '8px'}}>
                            <button 
                              className="btn btn-primary" 
                              style={{padding: '4px 12px', fontSize: '0.8rem'}}
                              onClick={() => setEditingItemId(null)}
                            >
                              Done
                            </button>
                            <button 
                              className="btn btn-danger no-print" 
                              style={{padding: '4px 12px', fontSize: '0.8rem'}}
                              onClick={() => { deleteDigitalAccount(account.id); setEditingItemId(null); }}
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        </div>
                        <div className="form-grid">
                          {renderInput("Platform / Service", account.platform, (val) => updateDigitalAccount(account.id, { platform: val }), "e.g. Master Password Manager, Apple iCloud, Google, Facebook")}
                          {renderInput("Username / Email Used", account.username, (val) => updateDigitalAccount(account.id, { username: val }), "e.g. john.smith@gmail.com")}
                          {renderInput("Recovery Email / Phone", account.recoveryEmailPhone, (val) => updateDigitalAccount(account.id, { recoveryEmailPhone: val }), "Where are recovery codes sent?")}
                          {renderInput("Assigned Digital Executor", account.digitalExecutor, (val) => updateDigitalAccount(account.id, { digitalExecutor: val }), "Who should manage this account?")}
                          <div className="form-grid-full">
                            {renderInput("Wishes & Instructions (PINs/Safe storage notes)", account.notes, (val) => updateDigitalAccount(account.id, { notes: val }), "e.g. 'Memorialize account', 'Device PIN is xxxx', 'Master key is in red envelope in drawer'")}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={account.id} className="summary-card">
                      <div>
                        <div className="summary-card-title">{account.platform || "Unnamed Platform"}</div>
                        <div className="summary-card-subtitle">👤 Username: {account.username || "—"}</div>
                        {account.digitalExecutor && <div className="summary-card-text">🔑 Executor: {account.digitalExecutor}</div>}
                      </div>
                      <div className="summary-card-actions">
                        <button 
                          className="btn btn-secondary" 
                          style={{padding: '4px 8px', fontSize: '0.75rem'}}
                          onClick={() => setEditingItemId(account.id)}
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{padding: '4px 8px', fontSize: '0.75rem'}}
                          onClick={() => deleteDigitalAccount(account.id)}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button className="add-item-btn no-print" onClick={addDigitalAccount}>
                <Plus size={16} /> Add Digital Account / Device Instructions
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 8: ESTATE PLAN & ARRANGEMENTS */}
        {/* ========================================================================= */}
        {activeTab === 'estate' && (
          <div className="form-card glass-panel no-print">
            <div className="form-header">
              <div className="form-title-group">
                <h2>Estate Plans & Final Wishes</h2>
                <p>Exact physical locations of legal wills and trusts, plus details on funeral arrangements and memorial letters.</p>
              </div>
            </div>

            {renderGuidance(
              "Estate & Final Arrangements",
              [
                "Original Copies: Courts require original signatures for wills and powers of attorney, not photocopies. Document precisely where they are.",
                "Disposition Wishes: Clarify wishes for cremation, burial, or tissue donation.",
                "Obituary/Eulogy Notes: Outline details you want included (stories, preferred readings, charities for memorial donations).",
                "Letters to Family: State where you keep letters or recorded video logs for your spouse, children, or family."
              ]
            )}

            <div className="form-grid">
              {renderInput("Location of Original Will", activeProfile.finalArrangements.willLocation, (val) => updateFinalArrangements({ willLocation: val }), "e.g. Safety deposit box, filing cabinet in study")}
              {renderInput("Location of Trust Documents", activeProfile.finalArrangements.trustLocation, (val) => updateFinalArrangements({ trustLocation: val }), "e.g. Binder on top shelf in closet")}
              
              <div className="form-grid-full">
                {renderInput("Location of Powers of Attorney (Financial/Medical)", activeProfile.finalArrangements.powerOfAttorneyLocation, (val) => updateFinalArrangements({ powerOfAttorneyLocation: val }), "State who holds copies and physical location")}
              </div>

              {renderInput("Preferred Funeral Home / Provider", activeProfile.finalArrangements.funeralHomePreference, (val) => updateFinalArrangements({ funeralHomePreference: val }), "e.g. Oakridge Funeral Services")}
              
              <div className="form-group">
                <label>Disposition Preference</label>
                <div className="no-print">
                  <select 
                    className="form-input"
                    value={activeProfile.finalArrangements.disposition}
                    onChange={(e) => updateFinalArrangements({ disposition: e.target.value as any })}
                  >
                    <option value="">Select option</option>
                    <option value="burial">Burial</option>
                    <option value="cremation">Cremation</option>
                    <option value="donation">Scientific Donation</option>
                    <option value="other">Other / Specific requests</option>
                  </select>
                </div>
                <span className="print-only print-val">
                  {activeProfile.finalArrangements.disposition.toUpperCase() || 'Not specified'}
                </span>
              </div>

              <div className="form-grid-full">
                {renderInput("Funeral / Memorial Service Wishes", activeProfile.finalArrangements.serviceWishes, (val) => updateFinalArrangements({ serviceWishes: val }), "Songs, scriptures, invitees, charities to donate to in lieu of flowers", "text", true)}
              </div>
              <div className="form-grid-full">
                {renderInput("Notes for Eulogy / Obituary details", activeProfile.finalArrangements.eulogyNotes, (val) => updateFinalArrangements({ eulogyNotes: val }), "Key milestones, proudest moments, surviving relatives details", "text", true)}
              </div>
              
              {renderInput("Location of Personal Letters to Family", activeProfile.finalArrangements.personalLettersLocation, (val) => updateFinalArrangements({ personalLettersLocation: val }), "e.g. Red box under bed, private google drive link")}
              
              <div className="form-grid-full">
                {renderInput("Additional Instructions / Messages", activeProfile.finalArrangements.notes, (val) => updateFinalArrangements({ notes: val }), "Any final messages or administrative details not covered elsewhere", "text", true)}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 9: LEGACY, MEMORIES & ANCESTRY */}
        {/* ========================================================================= */}
        {activeTab === 'legacy' && (
          <div className="form-card glass-panel no-print">
            <div className="form-header">
              <div className="form-title-group">
                <h2>Legacy, Memories & Ancestry</h2>
                <p>Ancestry origins, holiday traditions, core life lessons, wisdom, and checked/unchecked bucket lists.</p>
              </div>
            </div>

            {renderGuidance(
              "Legacy & Memories Guidance",
              [
                "Family Origins: Write down brief bios, birthplaces, or migration histories of your parents and grandparents.",
                "Traditions: Document recipes, annual family reunions, or holiday traditions you want the family to keep practicing.",
                "Life Lessons: Share any philosophy, guiding principles, or values you hope your children/grandchildren inherit.",
                "Bucket List: List accomplishments you checked off (to remember your adventures), and ones you hope your family will experience in your memory."
              ]
            )}

            <div className="form-grid">
              <div className="form-grid-full">
                {renderInput("Family Origins & Ancestry Details", activeProfile.legacyMemories.familyOrigins, (val) => updateLegacyMemories({ familyOrigins: val }), "Parentage, grandparent histories, immigration stories...", "text", true)}
              </div>
              <div className="form-grid-full">
                {renderInput("Holiday Traditions, Recipes & Customs", activeProfile.legacyMemories.traditionsRecipes, (val) => updateLegacyMemories({ traditionsRecipes: val }), "Favorite family recipes, annual trip customs, holiday traditions...", "text", true)}
              </div>
              <div className="form-grid-full">
                {renderInput("Life Lessons, Values & Wisdom", activeProfile.legacyMemories.lifeLessonsWisdom, (val) => updateLegacyMemories({ lifeLessonsWisdom: val }), "Philosophies, lessons from hardship, moral guidelines, favorite quotes to pass down...", "text", true)}
              </div>
              <div className="form-grid-full">
                {renderInput("Completed Bucket List Accomplishments", activeProfile.legacyMemories.bucketListCompleted, (val) => updateLegacyMemories({ bucketListCompleted: val }), "Milestones you successfully checked off (great for obituaries and eulogies)...", "text", true)}
              </div>
              <div className="form-grid-full">
                {renderInput("Uncompleted Dreams (Future Bucket List)", activeProfile.legacyMemories.bucketListFuture, (val) => updateLegacyMemories({ bucketListFuture: val }), "Dreams you hope your family will experience or complete in your honor...", "text", true)}
              </div>
              <div className="form-grid-full">
                {renderInput("Additional Legacy Notes", activeProfile.legacyMemories.notes, (val) => updateLegacyMemories({ notes: val }), "Any other family history details or messages...", "text", true)}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 10: SENTIMENTAL ITEMS & PETS */}
        {/* ========================================================================= */}
        {activeTab === 'sentimental' && (
          <div className="form-card glass-panel no-print">
            <div className="form-header">
              <div className="form-title-group">
                <h2>Sentimental Items & Pets</h2>
                <p>Distribution wishes for belongings of high sentimental value, and custody/care guidelines for your current pets.</p>
              </div>
            </div>

            {renderGuidance(
              "Sentimental Belongings & Pets",
              [
                "Sentimental Items: Wills handle major assets, but small heirlooms (wedding albums, jewelry, scrapbooks) often cause conflicts. List whom you want them to go to.",
                "Pet Guardianship: Clearly document vet details, medication/feeding schedules, and who has agreed to take custody of your animals."
              ]
            )}

            <h3 style={{fontFamily: 'var(--font-family-title)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', color: 'var(--accent-secondary)'}}>
              🧸 Sentimental Items Registry
            </h3>
            
            <div style={{marginBottom: '32px'}}>
              <div className="summary-grid">
                {activeProfile.sentimentalItems.map(item => {
                  const isEditing = item.id === editingItemId;
                  if (isEditing) {
                    return (
                      <div key={item.id} className="list-item-card form-grid-full" style={{gridColumn: 'span 2'}}>
                        <div className="list-item-card-header">
                          <span className="list-item-index">Editing Belonging</span>
                          <div style={{display: 'flex', gap: '8px'}}>
                            <button 
                              className="btn btn-primary" 
                              style={{padding: '4px 12px', fontSize: '0.8rem'}}
                              onClick={() => setEditingItemId(null)}
                            >
                              Done
                            </button>
                            <button 
                              className="btn btn-danger no-print" 
                              style={{padding: '4px 12px', fontSize: '0.8rem'}}
                              onClick={() => { deleteSentimentalItem(item.id); setEditingItemId(null); }}
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        </div>
                        <div className="form-grid">
                          {renderInput("Item Description", item.description, (val) => updateSentimentalItem(item.id, { description: val }), "e.g. Grandfather's gold pocket watch")}
                          {renderInput("Intended Recipient", item.recipient, (val) => updateSentimentalItem(item.id, { recipient: val }), "e.g. Son (David Smith)")}
                          <div className="form-grid-full">
                            {renderInput("Significance / Story", item.significance, (val) => updateSentimentalItem(item.id, { significance: val }), "e.g. Awarded to grandfather in 1945 for service. It holds great family history.")}
                          </div>
                          <div className="form-grid-full">
                            {renderInput("Physical Location & Notes", item.notes, (val) => updateSentimentalItem(item.id, { notes: val }), "e.g. Kept in master bedroom top drawer in a velvet case.")}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={item.id} className="summary-card">
                      <div>
                        <div className="summary-card-title">{item.description || "Unnamed Item"}</div>
                        <div className="summary-card-subtitle">🎁 Recipient: {item.recipient || "—"}</div>
                        {item.significance && <div className="summary-card-text">📜 {item.significance}</div>}
                      </div>
                      <div className="summary-card-actions">
                        <button 
                          className="btn btn-secondary" 
                          style={{padding: '4px 8px', fontSize: '0.75rem'}}
                          onClick={() => setEditingItemId(item.id)}
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{padding: '4px 8px', fontSize: '0.75rem'}}
                          onClick={() => deleteSentimentalItem(item.id)}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button className="add-item-btn no-print" onClick={addSentimentalItem}>
                <Plus size={16} /> Add Sentimental Belonging
              </button>
            </div>

            <div style={{height: '1px', background: 'var(--border-color)', margin: '24px 0'}}></div>

            <h3 style={{fontFamily: 'var(--font-family-title)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', color: 'var(--accent-secondary)'}}>
              🐾 Pet Care Guidelines
            </h3>

            <div>
              <div className="summary-grid">
                {activeProfile.pets.map(pet => {
                  const isEditing = pet.id === editingItemId;
                  if (isEditing) {
                    return (
                      <div key={pet.id} className="list-item-card form-grid-full" style={{gridColumn: 'span 2'}}>
                        <div className="list-item-card-header">
                          <span className="list-item-index">Editing Pet</span>
                          <div style={{display: 'flex', gap: '8px'}}>
                            <button 
                              className="btn btn-primary" 
                              style={{padding: '4px 12px', fontSize: '0.8rem'}}
                              onClick={() => setEditingItemId(null)}
                            >
                              Done
                            </button>
                            <button 
                              className="btn btn-danger no-print" 
                              style={{padding: '4px 12px', fontSize: '0.8rem'}}
                              onClick={() => { deletePet(pet.id); setEditingItemId(null); }}
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        </div>
                        <div className="form-grid">
                          {renderInput("Pet's Name", pet.petName, (val) => updatePet(pet.id, { petName: val }), "e.g. Bailey")}
                          {renderInput("Animal Type / Breed", pet.typeBreed, (val) => updatePet(pet.id, { typeBreed: val }), "e.g. Golden Retriever, Tabby Cat")}
                          {renderInput("Veterinary Clinic & Contact", pet.vetContact, (val) => updatePet(pet.id, { vetContact: val }), "e.g. Riverfront Vet, (555) 012-3498")}
                          {renderInput("Designated Guardian", pet.designatedGuardian, (val) => updatePet(pet.id, { designatedGuardian: val }), "Who will take this pet?")}
                          <div className="form-grid-full">
                            {renderInput("Daily Care, Diet & Medication Instructions", pet.careInstructions, (val) => updatePet(pet.id, { careInstructions: val }), "e.g. Feed twice daily. Allergy to wheat. Takes daily thyroid pill.", "text", true)}
                          </div>
                          <div className="form-grid-full">
                            {renderInput("Additional Pet Notes", pet.notes, (val) => updatePet(pet.id, { notes: val }), "Microchip numbers, insurance info, quirks...", "text", true)}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={pet.id} className="summary-card">
                      <div>
                        <div className="summary-card-title">{pet.petName || "Unnamed Pet"}</div>
                        <div className="summary-card-subtitle">🐾 {pet.typeBreed || "No breed specified"}</div>
                        {pet.designatedGuardian && <div className="summary-card-text">🏡 Guardian: {pet.designatedGuardian}</div>}
                      </div>
                      <div className="summary-card-actions">
                        <button 
                          className="btn btn-secondary" 
                          style={{padding: '4px 8px', fontSize: '0.75rem'}}
                          onClick={() => setEditingItemId(pet.id)}
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{padding: '4px 8px', fontSize: '0.75rem'}}
                          onClick={() => deletePet(pet.id)}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button className="add-item-btn no-print" onClick={addPet}>
                <Plus size={16} /> Add Pet Care Record
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Continuous Print-friendly Dossier Layout (visible only when printing) */}
        <div className="print-only">
          {/* Section 1 */}
          <div className="form-card">
            <div className="form-header">
              <h2>Personal & Background Information</h2>
            </div>
            <div className="form-grid">
              <div className="form-group"><label>Full Legal Name</label><span className="print-val">{activeProfile.personalInfo.fullName || '—'}</span></div>
              <div className="form-group"><label>Date of Birth</label><span className="print-val">{activeProfile.personalInfo.dateOfBirth || '—'}</span></div>
              <div className="form-grid-full"><div className="form-group"><label>Current Home Address</label><span className="print-val">{activeProfile.personalInfo.currentAddress || '—'}</span></div></div>
              <div className="form-group"><label>Primary Phone</label><span className="print-val">{activeProfile.personalInfo.phone || '—'}</span></div>
              <div className="form-group"><label>Primary Email</label><span className="print-val">{activeProfile.personalInfo.email || '—'}</span></div>
              <div className="form-group"><label>Employer Details</label><span className="print-val">{activeProfile.personalInfo.employer || '—'}</span></div>
              <div className="form-group"><label>Military Service</label><span className="print-val">{activeProfile.personalInfo.militaryService || '—'}</span></div>
              <div className="form-grid-full"><div className="form-group"><label>Clubs & Memberships</label><span className="print-val">{activeProfile.personalInfo.groupsOrganizations || '—'}</span></div></div>
              <div className="form-grid-full"><div className="form-group"><label>Biographical Notes</label><span className="print-val">{activeProfile.personalInfo.notes || '—'}</span></div></div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="form-card">
            <div className="form-header">
              <h2>Key Contacts & Advisors</h2>
            </div>
            {activeProfile.contacts.map(contact => (
              <div key={contact.id} className="list-item-card" style={{pageBreakInside: 'avoid', breakInside: 'avoid'}}>
                <div className="list-item-card-header"><span className="list-item-index">Contact: {contact.relationship || 'Unspecified Relationship'}</span></div>
                <div className="form-grid">
                  <div className="form-group"><label>Name</label><span className="print-val">{contact.name || '—'}</span></div>
                  <div className="form-group"><label>Phone</label><span className="print-val">{contact.phone || '—'}</span></div>
                  <div className="form-group"><label>Email</label><span className="print-val">{contact.email || '—'}</span></div>
                  <div className="form-grid-full"><div className="form-group"><label>Notes</label><span className="print-val">{contact.notes || '—'}</span></div></div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 3 */}
          <div className="form-card">
            <div className="form-header">
              <h2>Financial Accounts & Liabilities</h2>
            </div>
            {activeProfile.financialAccounts.length === 0 ? <p style={{fontStyle: 'italic'}}>No financial accounts listed.</p> : 
              activeProfile.financialAccounts.map(account => (
                <div key={account.id} className="list-item-card" style={{pageBreakInside: 'avoid', breakInside: 'avoid'}}>
                  <div className="list-item-card-header"><span className="list-item-index">Financial Account</span></div>
                  <div className="form-grid">
                    <div className="form-group"><label>Institution</label><span className="print-val">{account.institution || '—'}</span></div>
                    <div className="form-group"><label>Account Type</label><span className="print-val">{account.accountType || '—'}</span></div>
                    <div className="form-group"><label>Identifier (Last 4)</label><span className="print-val">{account.accountIdentifier || '—'}</span></div>
                    <div className="form-group"><label>Website</label><span className="print-val">{account.website || '—'}</span></div>
                    <div className="form-grid-full"><div className="form-group"><label>Details</label><span className="print-val">{account.notes || '—'}</span></div></div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Section 4 */}
          <div className="form-card">
            <div className="form-header">
              <h2>Real Estate, Vehicles & Physical Safes</h2>
            </div>
            {activeProfile.assets.length === 0 ? <p style={{fontStyle: 'italic'}}>No assets listed.</p> : 
              activeProfile.assets.map(asset => (
                <div key={asset.id} className="list-item-card" style={{pageBreakInside: 'avoid', breakInside: 'avoid'}}>
                  <div className="list-item-card-header"><span className="list-item-index">Asset: {asset.category.replace('_', ' ').toUpperCase()}</span></div>
                  <div className="form-grid">
                    <div className="form-grid-full"><div className="form-group"><label>Asset Description</label><span className="print-val">{asset.description || '—'}</span></div></div>
                    <div className="form-group"><label>Title Holder</label><span className="print-val">{asset.titleHolder || '—'}</span></div>
                    <div className="form-group"><label>Physical Location</label><span className="print-val">{asset.location || '—'}</span></div>
                    <div className="form-group"><label>Value</label><span className="print-val">{asset.estimatedValue || '—'}</span></div>
                    <div className="form-grid-full"><div className="form-group"><label>Access Codes / Keys / Notes</label><span className="print-val">{asset.notes || '—'}</span></div></div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Section 5 */}
          <div className="form-card">
            <div className="form-header">
              <h2>Insurance Policies</h2>
            </div>
            {activeProfile.insurancePolicies.length === 0 ? <p style={{fontStyle: 'italic'}}>No insurance policies listed.</p> : 
              activeProfile.insurancePolicies.map(policy => (
                <div key={policy.id} className="list-item-card" style={{pageBreakInside: 'avoid', breakInside: 'avoid'}}>
                  <div className="list-item-card-header"><span className="list-item-index">Insurance Policy: {policy.policyType || 'Unspecified Type'}</span></div>
                  <div className="form-grid">
                    <div className="form-group"><label>Provider</label><span className="print-val">{policy.provider || '—'}</span></div>
                    <div className="form-group"><label>Policy Number</label><span className="print-val">{policy.policyNumber || '—'}</span></div>
                    <div className="form-group"><label>Coverage Amount</label><span className="print-val">{policy.coverageAmount || '—'}</span></div>
                    <div className="form-group"><label>Beneficiaries</label><span className="print-val">{policy.beneficiaries || '—'}</span></div>
                    <div className="form-group"><label>Agency Contact Number</label><span className="print-val">{policy.contactNumber || '—'}</span></div>
                    <div className="form-grid-full"><div className="form-group"><label>File Location & Notes</label><span className="print-val">{policy.notes || '—'}</span></div></div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Section 6 */}
          <div className="form-card">
            <div className="form-header">
              <h2>Medical Profile & Directives</h2>
            </div>
            <div className="form-grid">
              <div className="form-group"><label>Blood Type</label><span className="print-val">{activeProfile.medicalProfile.bloodType || '—'}</span></div>
              <div className="form-group"><label>Organ Donor</label><span className="print-val">{activeProfile.medicalProfile.organDonor.toUpperCase()}</span></div>
              <div className="form-grid-full"><div className="form-group"><label>Allergies</label><span className="print-val">{activeProfile.medicalProfile.allergies || '—'}</span></div></div>
              <div className="form-grid-full"><div className="form-group"><label>Active Conditions</label><span className="print-val">{activeProfile.medicalProfile.conditions || '—'}</span></div></div>
              <div className="form-grid-full"><div className="form-group"><label>Medications & Dosages</label><span className="print-val">{activeProfile.medicalProfile.medications || '—'}</span></div></div>
              <div className="form-group"><label>Primary Care Physician</label><span className="print-val">{activeProfile.medicalProfile.primaryPhysician || '—'}</span></div>
              <div className="form-group"><label>Living Will / Medical Directive Location</label><span className="print-val">{activeProfile.medicalProfile.livingWillLocation || '—'}</span></div>
              <div className="form-grid-full"><div className="form-group"><label>Medical Notes</label><span className="print-val">{activeProfile.medicalProfile.notes || '—'}</span></div></div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="form-card">
            <div className="form-header">
              <h2>Digital Accounts & Legacy Rules</h2>
            </div>
            {activeProfile.digitalAccounts.length === 0 ? <p style={{fontStyle: 'italic'}}>No digital accounts listed.</p> : 
              activeProfile.digitalAccounts.map(account => (
                <div key={account.id} className="list-item-card" style={{pageBreakInside: 'avoid', breakInside: 'avoid'}}>
                  <div className="list-item-card-header"><span className="list-item-index">Digital Account: {account.platform || '—'}</span></div>
                  <div className="form-grid">
                    <div className="form-group"><label>Username</label><span className="print-val">{account.username || '—'}</span></div>
                    <div className="form-group"><label>Recovery contact</label><span className="print-val">{account.recoveryEmailPhone || '—'}</span></div>
                    <div className="form-group"><label>Executor</label><span className="print-val">{account.digitalExecutor || '—'}</span></div>
                    <div className="form-grid-full"><div className="form-group"><label>Wishes & Instructions</label><span className="print-val">{account.notes || '—'}</span></div></div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Section 8 */}
          <div className="form-card">
            <div className="form-header">
              <h2>Estate Plans & Final Wishes</h2>
            </div>
            <div className="form-grid">
              <div className="form-group"><label>Location of Original Will</label><span className="print-val">{activeProfile.finalArrangements.willLocation || '—'}</span></div>
              <div className="form-group"><label>Location of Trust Documents</label><span className="print-val">{activeProfile.finalArrangements.trustLocation || '—'}</span></div>
              <div className="form-grid-full"><div className="form-group"><label>Location of Power of Attorney</label><span className="print-val">{activeProfile.finalArrangements.powerOfAttorneyLocation || '—'}</span></div></div>
              <div className="form-group"><label>Preferred Funeral Home</label><span className="print-val">{activeProfile.finalArrangements.funeralHomePreference || '—'}</span></div>
              <div className="form-group"><label>Disposition Wishes</label><span className="print-val">{activeProfile.finalArrangements.disposition.toUpperCase() || '—'}</span></div>
              <div className="form-grid-full"><div className="form-group"><label>Service / Memorial Wishes</label><span className="print-val">{activeProfile.finalArrangements.serviceWishes || '—'}</span></div></div>
              <div className="form-grid-full"><div className="form-group"><label>Obituary Notes</label><span className="print-val">{activeProfile.finalArrangements.eulogyNotes || '—'}</span></div></div>
              <div className="form-group"><label>Personal Letters Location</label><span className="print-val">{activeProfile.finalArrangements.personalLettersLocation || '—'}</span></div>
              <div className="form-grid-full"><div className="form-group"><label>Extra Instructions</label><span className="print-val">{activeProfile.finalArrangements.notes || '—'}</span></div></div>
            </div>
          </div>

          {/* Section 9 */}
          <div className="form-card">
            <div className="form-header">
              <h2>Legacy, Memories & Ancestry</h2>
            </div>
            <div className="form-grid">
              <div className="form-grid-full"><div className="form-group"><label>Family Origins & Ancestry Details</label><span className="print-val">{activeProfile.legacyMemories.familyOrigins || '—'}</span></div></div>
              <div className="form-grid-full"><div className="form-group"><label>Holiday Traditions, Recipes & Customs</label><span className="print-val">{activeProfile.legacyMemories.traditionsRecipes || '—'}</span></div></div>
              <div className="form-grid-full"><div className="form-group"><label>Life Lessons, Values & Wisdom</label><span className="print-val">{activeProfile.legacyMemories.lifeLessonsWisdom || '—'}</span></div></div>
              <div className="form-grid-full"><div className="form-group"><label>Completed Bucket List Accomplishments</label><span className="print-val">{activeProfile.legacyMemories.bucketListCompleted || '—'}</span></div></div>
              <div className="form-grid-full"><div className="form-group"><label>Uncompleted Dreams (Future Bucket List)</label><span className="print-val">{activeProfile.legacyMemories.bucketListFuture || '—'}</span></div></div>
              <div className="form-grid-full"><div className="form-group"><label>Additional Legacy Notes</label><span className="print-val">{activeProfile.legacyMemories.notes || '—'}</span></div></div>
            </div>
          </div>

          {/* Section 10 */}
          <div className="form-card">
            <div className="form-header">
              <h2>Sentimental Items & Pets</h2>
            </div>
            
            <h3 style={{fontSize: '12pt', fontWeight: 'bold', margin: '15px 0 10px 0', borderBottom: '1px solid #000'}}>🧸 Sentimental Belongings</h3>
            {activeProfile.sentimentalItems.length === 0 ? <p style={{fontStyle: 'italic'}}>No sentimental belongings listed.</p> : 
              activeProfile.sentimentalItems.map(item => (
                <div key={item.id} className="list-item-card" style={{pageBreakInside: 'avoid', breakInside: 'avoid'}}>
                  <div className="list-item-card-header"><span className="list-item-index">Sentimental Belonging: {item.description || '—'}</span></div>
                  <div className="form-grid">
                    <div className="form-group"><label>Recipient</label><span className="print-val">{item.recipient || '—'}</span></div>
                    <div className="form-grid-full"><div className="form-group"><label>Significance / Story</label><span className="print-val">{item.significance || '—'}</span></div></div>
                    <div className="form-grid-full"><div className="form-group"><label>Location & Notes</label><span className="print-val">{item.notes || '—'}</span></div></div>
                  </div>
                </div>
              ))
            }

            <h3 style={{fontSize: '12pt', fontWeight: 'bold', margin: '25px 0 10px 0', borderBottom: '1px solid #000'}}>🐾 Pet Care Guidelines</h3>
            {activeProfile.pets.length === 0 ? <p style={{fontStyle: 'italic'}}>No pets listed.</p> : 
              activeProfile.pets.map(pet => (
                <div key={pet.id} className="list-item-card" style={{pageBreakInside: 'avoid', breakInside: 'avoid'}}>
                  <div className="list-item-card-header"><span className="list-item-index">Pet: {pet.petName || '—'} ({pet.typeBreed || '—'})</span></div>
                  <div className="form-grid">
                    <div className="form-group"><label>Veterinary Clinic</label><span className="print-val">{pet.vetContact || '—'}</span></div>
                    <div className="form-group"><label>Designated Guardian</label><span className="print-val">{pet.designatedGuardian || '—'}</span></div>
                    <div className="form-grid-full"><div className="form-group"><label>Daily Care & Medications</label><span className="print-val">{pet.careInstructions || '—'}</span></div></div>
                    <div className="form-grid-full"><div className="form-group"><label>Notes</label><span className="print-val">{pet.notes || '—'}</span></div></div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Signature / Date Page (Verification/Certification) */}
          <div className="form-card print-signature-section" style={{pageBreakBefore: 'always', breakBefore: 'page'}}>
            <div className="form-header">
              <h2>Binder Certification & Signature</h2>
            </div>
            <p style={{fontSize: '10pt', color: '#333', marginBottom: '40px', lineHeight: '1.6'}}>
              By signing below, I certify that the information contained within this Legacy Continuity Binder represents an accurate summary of my wishes, contacts, financial accounts, and assets at the time of signing. I intend for this document to serve as a guide for my family, executor, and trustees in the event of my death or incapacity.
            </p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '60px'}}>
              <div style={{display: 'flex', gap: '40px'}}>
                <div style={{flex: 1, borderTop: '1px solid #000', paddingTop: '8px'}}>
                  <span style={{fontSize: '8pt', fontWeight: 'bold', textTransform: 'uppercase', display: 'block'}}>Signature of Prepared Individual</span>
                  <span style={{fontSize: '10pt', color: '#555', marginTop: '4px', display: 'block'}}>{activeProfile.profileName}</span>
                </div>
                <div style={{width: '200px', borderTop: '1px solid #000', paddingTop: '8px'}}>
                  <span style={{fontSize: '8pt', fontWeight: 'bold', textTransform: 'uppercase', display: 'block'}}>Date Signed</span>
                </div>
              </div>

              <div style={{display: 'flex', gap: '40px', marginTop: '20px'}}>
                <div style={{flex: 1, borderTop: '1px solid #000', paddingTop: '8px'}}>
                  <span style={{fontSize: '8pt', fontWeight: 'bold', textTransform: 'uppercase', display: 'block'}}>Witness Name & Signature (Optional)</span>
                </div>
                <div style={{width: '200px', borderTop: '1px solid #000', paddingTop: '8px'}}>
                  <span style={{fontSize: '8pt', fontWeight: 'bold', textTransform: 'uppercase', display: 'block'}}>Date</span>
                </div>
              </div>
            </div>
            
            <div style={{marginTop: '60px', border: '1px solid #ccc', padding: '15px', borderRadius: '4px', backgroundColor: '#fafafa', fontSize: '9pt', color: '#555'}}>
              <strong>Note on Validity:</strong> This document is <em>not</em> a legal will or trust. It is a guide to assist your loved ones in finding your legal documents, assets, and online accounts. Please ensure your original signed Will, Trust Agreements, Power of Attorney, and Healthcare Directives are stored in a secure location known to your executors or family members.
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* EXPORT BACKUP MODAL */}
      {/* ========================================================================= */}
      {showExportModal && (
        <div className="modal-overlay no-print">
          <div className="modal-content glass-panel">
            <h3 className="modal-title">Export Legacy Binder</h3>
            <p className="modal-description">
              Save your binder data to a file. You can restore this file on any device later. Since this data is highly sensitive, we recommend encrypting it.
            </p>

            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                <input
                  type="checkbox"
                  checked={encryptExport}
                  onChange={(e) => {
                    setEncryptExport(e.target.checked);
                    setExportError('');
                  }}
                />
                <span>Encrypt file with a password (Recommended)</span>
              </label>

              {encryptExport && (
                <div className="form-group">
                  <label>Encryption Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter a strong password"
                    value={encryptionPassword}
                    onChange={(e) => setEncryptionPassword(e.target.value)}
                  />
                  <span style={{fontSize: '0.75rem', color: 'var(--accent-warning)', display: 'flex', gap: '4px', marginTop: '4px'}}>
                    <AlertCircle size={12} /> Do not lose this password. You cannot decrypt the backup file without it.
                  </span>
                </div>
              )}

              {exportError && (
                <div style={{color: 'var(--accent-danger)', fontSize: '0.85rem', fontWeight: 600}}>
                  {exportError}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => { setShowExportModal(false); setExportError(''); setEncryptionPassword(''); }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleExport}>
                Download File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESTORE BACKUP MODAL */}
      {/* ========================================================================= */}
      {showImportModal && (
        <div className="modal-overlay no-print">
          <div className="modal-content glass-panel">
            <h3 className="modal-title">Restore Legacy Binder</h3>
            <p className="modal-description">
              Upload a previously exported Legacy Binder `.json` file to restore your information. This will replace all current data.
            </p>

            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div className="form-group">
                <label>Select Binder File</label>
                <input
                  type="file"
                  accept=".json"
                  className="form-input"
                  onChange={handleImportFileChange}
                />
              </div>

              {/* Show password field if file is encrypted */}
              {importFileContent && importFileContent.includes('ciphertext') && (
                <div className="form-group">
                  <label>Decryption Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter the password used to encrypt"
                    value={importPassword}
                    onChange={(e) => setImportPassword(e.target.value)}
                  />
                </div>
              )}

              {importError && (
                <div style={{color: 'var(--accent-danger)', fontSize: '0.85rem', fontWeight: 600}}>
                  {importError}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => { setShowImportModal(false); setImportError(''); setImportPassword(''); setImportFileContent(''); }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleImportSubmit}>
                Import Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
