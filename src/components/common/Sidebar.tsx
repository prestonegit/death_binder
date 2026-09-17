import React from 'react';
import { 
  BookOpen, AlertTriangle, User, Users, FileText, 
  Landmark, Layers, Home, Shield, Activity, 
  Key, FileCheck, Heart, Gift, Printer, 
  Download, Upload, Check, Minus, LayoutDashboard,
  ClipboardList
} from 'lucide-react';
import type { LegacyBinderData } from '../../types';
import { evaluateSectionReadiness } from '../../utils/readiness';

interface SidebarProps {
  binderData: LegacyBinderData;
  activeProfileKey: 'primary' | 'secondary' | string;
  activeTab: string;
  onSelectProfile: (key: 'primary' | 'secondary' | string) => void;
  onSelectTab: (tabId: string) => void;
  onOpenPrintModal: () => void;
  onOpenExportModal: () => void;
  onOpenImportModal: () => void;
}

interface NavGroup {
  groupTitle?: string;
  items: {
    id: string;
    number?: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    isEmergency?: boolean;
    isHighlight?: boolean;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { id: 'dashboard', label: 'Binder Index', icon: LayoutDashboard },
      { id: 'executor_playbook', label: 'Executor Action Checklist', icon: ClipboardList, isHighlight: true }
    ]
  },
  {
    groupTitle: 'Immediate Response',
    items: [
      { id: 'emergency', number: '01', label: 'Emergency & First 48h', icon: AlertTriangle, isEmergency: true }
    ]
  },
  {
    groupTitle: 'Identity & Health',
    items: [
      { id: 'personal', number: '02', label: 'Personal & Identity', icon: User },
      { id: 'contacts', number: '03', label: 'Advisors & Contacts', icon: Users },
      { id: 'medical', number: '04', label: 'Medical Directives', icon: Activity }
    ]
  },
  {
    groupTitle: 'Property & Finance',
    items: [
      { id: 'financial', number: '05', label: 'Banking & Investments', icon: Landmark },
      { id: 'assets', number: '06', label: 'Real Estate & Safes', icon: Home },
      { id: 'insurance', number: '07', label: 'Insurance Policies', icon: Shield },
      { id: 'recurring', number: '08', label: 'Recurring Bills & Subs', icon: Layers }
    ]
  },
  {
    groupTitle: 'Legal & Vital Records',
    items: [
      { id: 'legal', number: '09', label: 'Wills, Trusts & POAs', icon: FileText },
      { id: 'tax', number: '10', label: 'Tax & Vital Records', icon: FileCheck }
    ]
  },
  {
    groupTitle: 'Digital & Legacy',
    items: [
      { id: 'digital', number: '11', label: 'Online Accounts & Vaults', icon: Key },
      { id: 'legacy', number: '12', label: 'Letters & Family Wishes', icon: Heart },
      { id: 'history_interview', number: '13', label: 'Life Story & History Book', icon: BookOpen },
      { id: 'sentimental', number: '14', label: 'Heirlooms & Pets', icon: Gift }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  binderData,
  activeProfileKey,
  activeTab,
  onSelectProfile,
  onSelectTab,
  onOpenPrintModal,
  onOpenExportModal,
  onOpenImportModal
}) => {
  const currentProfile = binderData.profiles[activeProfileKey] || binderData.profiles.primary;
  const { sections } = evaluateSectionReadiness(currentProfile);

  const getSectionStatus = (tabId: string) => {
    if (tabId === 'dashboard' || tabId === 'executor_playbook') return null;
    return sections.find(s => s.id === tabId);
  };

  return (
    <aside className="sidebar no-print">
      {/* Brand Header */}
      <div className="logo-container">
        <BookOpen className="logo-icon" size={20} />
        <span className="logo-text">DeathBinder</span>
      </div>

      {/* Profile Switcher Tabs */}
      <div className="profile-card">
        <div className="profile-card-header">
          <span className="profile-card-title">Active Record</span>
        </div>
        <div className="profile-selector">
          <button
            type="button"
            className={`profile-tab ${activeProfileKey === 'primary' ? 'active' : ''}`}
            onClick={() => onSelectProfile('primary')}
          >
            <User size={13} />
            <span>{binderData.profiles.primary.profileName || 'Primary'}</span>
          </button>
          <button
            type="button"
            className={`profile-tab ${activeProfileKey === 'secondary' ? 'active' : ''}`}
            onClick={() => onSelectProfile('secondary')}
          >
            <User size={13} />
            <span>{binderData.profiles.secondary.profileName || 'Spouse'}</span>
          </button>
        </div>
      </div>

      {/* Grouped Navigation List */}
      <nav className="sidebar-nav">
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="nav-group-wrapper">
            {group.groupTitle && (
              <div className="nav-group-header">
                <span>{group.groupTitle}</span>
              </div>
            )}

            {group.items.map(item => {
              const Icon = item.icon;
              const status = getSectionStatus(item.id);
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`nav-item ${isActive ? 'active' : ''} ${item.isEmergency ? 'nav-item-emergency' : ''} ${item.isHighlight ? 'nav-item-highlight' : ''}`}
                  onClick={() => onSelectTab(item.id)}
                >
                  <div className="nav-item-left">
                    {item.number ? (
                      <span className="nav-number">{item.number}</span>
                    ) : (
                      <Icon size={15} className="nav-icon" />
                    )}
                    <span className="nav-label">{item.label}</span>
                  </div>

                  {status && (
                    <div className="nav-item-right">
                      {status.isNotApplicable ? (
                        <span className="sidebar-status-tag na" title="Not Applicable">
                          <Minus size={11} />
                        </span>
                      ) : status.isComplete ? (
                        <span className="sidebar-status-tag done" title="Documented">
                          <Check size={11} />
                        </span>
                      ) : (
                        <span className="sidebar-status-dot empty" title="Empty" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer Actions */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-action-btn primary-action"
          onClick={onOpenPrintModal}
        >
          <Printer size={14} />
          <span>Print / Export PDF</span>
        </button>

        <div className="backup-btn-group">
          <button
            type="button"
            className="sidebar-action-btn secondary-action"
            onClick={onOpenExportModal}
            title="Export JSON backup"
          >
            <Download size={13} />
            <span>Export</span>
          </button>
          <button
            type="button"
            className="sidebar-action-btn secondary-action"
            onClick={onOpenImportModal}
            title="Restore from JSON backup"
          >
            <Upload size={13} />
            <span>Restore</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

