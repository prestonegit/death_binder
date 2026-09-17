import React from 'react';
import { ArrowLeft, ArrowRight, List } from 'lucide-react';

interface SectionNavFooterProps {
  currentTab: string;
  onNavigateTab: (tabId: string) => void;
}

const TAB_METADATA: Record<string, { title: string; number?: string }> = {
  dashboard: { title: 'Binder Index' },
  executor_playbook: { title: 'Executor Action Checklist' },
  emergency: { title: 'Emergency & First 48h', number: '01' },
  personal: { title: 'Personal & Identity', number: '02' },
  contacts: { title: 'Advisors & Contacts', number: '03' },
  medical: { title: 'Medical Directives', number: '04' },
  financial: { title: 'Banking & Accounts', number: '05' },
  assets: { title: 'Real Estate & Assets', number: '06' },
  insurance: { title: 'Insurance Policies', number: '07' },
  recurring: { title: 'Recurring Bills', number: '08' },
  legal: { title: 'Wills & Trusts', number: '09' },
  tax: { title: 'Tax & Vital Records', number: '10' },
  digital: { title: 'Digital Accounts', number: '11' },
  legacy: { title: 'Letters & Wishes', number: '12' },
  history_interview: { title: 'Life Story & History Book', number: '13' },
  sentimental: { title: 'Heirlooms & Pets', number: '14' }
};

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

export const SectionNavFooter: React.FC<SectionNavFooterProps> = ({
  currentTab,
  onNavigateTab
}) => {
  const currentIndex = TABS_ORDER.indexOf(currentTab);
  if (currentIndex === -1 || currentTab === 'dashboard') {
    return null;
  }

  const prevTabId = currentIndex > 0 ? TABS_ORDER[currentIndex - 1] : null;
  const nextTabId = currentIndex < TABS_ORDER.length - 1 ? TABS_ORDER[currentIndex + 1] : null;

  const prevMeta = prevTabId ? TAB_METADATA[prevTabId] : null;
  const nextMeta = nextTabId ? TAB_METADATA[nextTabId] : null;

  return (
    <nav className="section-nav-footer no-print" aria-label="Section navigation">
      <div className="nav-footer-col nav-footer-prev">
        {prevTabId && prevMeta && (
          <button
            type="button"
            className="nav-footer-btn"
            onClick={() => onNavigateTab(prevTabId)}
          >
            <ArrowLeft size={14} />
            <div className="nav-footer-text">
              <span className="nav-footer-sub">Previous</span>
              <span className="nav-footer-label">
                {prevMeta.number ? `${prevMeta.number}. ` : ''}{prevMeta.title}
              </span>
            </div>
          </button>
        )}
      </div>

      <div className="nav-footer-col nav-footer-center">
        <button
          type="button"
          className="nav-footer-index-btn"
          onClick={() => onNavigateTab('dashboard')}
          title="Return to Table of Contents"
        >
          <List size={14} />
          <span>Table of Contents</span>
        </button>
      </div>

      <div className="nav-footer-col nav-footer-next">
        {nextTabId && nextMeta && (
          <button
            type="button"
            className="nav-footer-btn nav-footer-btn-primary"
            onClick={() => onNavigateTab(nextTabId)}
          >
            <div className="nav-footer-text text-right">
              <span className="nav-footer-sub">Next</span>
              <span className="nav-footer-label">
                {nextMeta.number ? `${nextMeta.number}. ` : ''}{nextMeta.title}
              </span>
            </div>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </nav>
  );
};
