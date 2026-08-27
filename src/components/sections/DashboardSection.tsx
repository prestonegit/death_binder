import React from 'react';
import { 
  Printer, Download, ClipboardList, 
  ArrowRight, Check, Minus, AlertCircle, Shield
} from 'lucide-react';
import type { ProfileData } from '../../types';
import { evaluateSectionReadiness } from '../../utils/readiness';

interface DashboardSectionProps {
  profile: ProfileData;
  onNavigateTab: (tabId: string) => void;
  onOpenPrintModal: () => void;
  onOpenExportModal: () => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  profile,
  onNavigateTab,
  onOpenPrintModal,
  onOpenExportModal
}) => {
  const { 
    sections, 
    totalSections, 
    completedSections, 
    skippedSections,
    hasEmergencyContact,
    hasWillLocation
  } = evaluateSectionReadiness(profile);

  return (
    <div className="binder-index-container">
      {/* Editorial Header Banner */}
      <header className="binder-index-header">
        <div className="binder-index-meta">
          <span className="binder-kicker">Confidential Continuity Record</span>
          <h1 className="binder-main-title">{profile.personalInfo.fullName || profile.profileName || 'Estate Binder'}</h1>
          <p className="binder-subtitle">
            A structured record of emergency directions, vital accounts, legal documents, and personal wishes for your executor and family.
          </p>
        </div>

        <div className="binder-index-actions">
          <button type="button" className="btn btn-primary" onClick={onOpenPrintModal}>
            <Printer size={15} /> Print Complete Binder
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onNavigateTab('executor_playbook')}>
            <ClipboardList size={15} /> Executor Checklist
          </button>
          <button type="button" className="btn btn-secondary" onClick={onOpenExportModal}>
            <Download size={15} /> Backup Data (JSON)
          </button>
        </div>
      </header>

      {/* Overview Status Bar */}
      <section className="binder-status-summary-bar">
        <div className="status-metric-group">
          <span className="status-metric-label">Document Status</span>
          <span className="status-metric-value">
            {completedSections} of {totalSections} sections documented
            {skippedSections > 0 && <span className="status-metric-sub"> ({skippedSections} marked not applicable)</span>}
          </span>
        </div>

        <div className="privacy-badge-inline">
          <Shield size={14} />
          <span>Stored locally on this device · No cloud sync</span>
        </div>
      </section>

      {/* Priority Notices if Critical Info Missing */}
      {(!hasEmergencyContact || !hasWillLocation) && (
        <div className="binder-notice-box">
          <AlertCircle size={18} className="notice-icon" />
          <div className="notice-content">
            <strong>Recommended Starting Items:</strong>
            <ul className="notice-list">
              {!hasEmergencyContact && (
                <li>
                  <button type="button" className="inline-link-btn" onClick={() => onNavigateTab('emergency')}>
                    Record a primary emergency contact →
                  </button>
                </li>
              )}
              {!hasWillLocation && (
                <li>
                  <button type="button" className="inline-link-btn" onClick={() => onNavigateTab('legal')}>
                    Specify the physical location of your original signed Will →
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Master Table of Contents */}
      <section className="binder-toc-section">
        <div className="section-title-row">
          <h2>Table of Contents</h2>
          <span className="toc-subtext">Click any section to review or update records</span>
        </div>

        <div className="binder-toc-table-wrap">
          <table className="binder-toc-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Tab</th>
                <th>Section Title</th>
                <th>Category</th>
                <th>Current Status</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((sec) => (
                <tr 
                  key={sec.id}
                  className="toc-row"
                  onClick={() => onNavigateTab(sec.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onNavigateTab(sec.id);
                    }
                  }}
                >
                  <td className="toc-number">{sec.number}</td>
                  <td className="toc-title-cell">
                    <span className="toc-title">{sec.title}</span>
                    <span className="toc-summary">{sec.summary}</span>
                  </td>
                  <td className="toc-category-cell">
                    <span className="category-tag">{sec.category}</span>
                  </td>
                  <td className="toc-status-cell">
                    {sec.isNotApplicable ? (
                      <span className="status-tag tag-na">
                        <Minus size={12} /> Not Applicable
                      </span>
                    ) : sec.isComplete ? (
                      <span className="status-tag tag-complete">
                        <Check size={12} /> Documented
                      </span>
                    ) : (
                      <span className="status-tag tag-empty">
                        Empty
                      </span>
                    )}
                  </td>
                  <td className="toc-action-cell">
                    <span className="toc-open-link">
                      Open <ArrowRight size={13} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

