import { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, RefreshCw } from 'lucide-react';
import type { SectionStarterArchetype } from '../../data/sectionStarters';

export interface SectionStarterBannerProps<T> {
  title: string;
  badge?: string;
  description?: string;
  starters: SectionStarterArchetype<T>[];
  onApply: (starter: SectionStarterArchetype<T>, mode: 'fill_empty' | 'replace') => void;
  hasExistingData?: boolean;
  defaultExpanded?: boolean;
}

export function SectionStarterBanner<T>({
  title,
  badge = '1-Click Starters',
  description = 'Choosing options from a blank slate can be intimidating. Select a cohesive starting template below to pre-fill realistic, thoughtful baselines in one click, then adjust as needed:',
  starters,
  onApply,
  hasExistingData = false,
  defaultExpanded = true
}: SectionStarterBannerProps<T>) {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [selectedId, setSelectedId] = useState<string>(starters[0]?.id || '');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [appliedNotice, setAppliedNotice] = useState<string>('');

  const selectedStarter = starters.find(s => s.id === selectedId) || starters[0];

  const handleApplyClick = () => {
    if (!selectedStarter) return;
    if (hasExistingData) {
      setShowConfirmModal(true);
    } else {
      executeApply('replace');
    }
  };

  const executeApply = (mode: 'fill_empty' | 'replace') => {
    if (!selectedStarter) return;
    onApply(selectedStarter, mode);
    setShowConfirmModal(false);
    setAppliedNotice(`Applied "${selectedStarter.name}" starter! You can customize any field below.`);
    setTimeout(() => {
      setAppliedNotice('');
    }, 4500);
  };

  return (
    <div className="section-starter-banner glass-panel no-print">
      <div className="section-starter-header">
        <button
          type="button"
          className="section-starter-toggle-btn"
          onClick={() => setIsExpanded(prev => !prev)}
          aria-expanded={isExpanded}
          aria-label={`Toggle ${title}`}
        >
          <div className="section-starter-title-wrap">
            <Sparkles size={18} className="starter-icon" />
            <span className="starter-title-text">{title}</span>
            <span className="badge badge-subtle">{badge}</span>
          </div>
          <div className="starter-toggle-indicator">
            <span className="starter-toggle-label">{isExpanded ? 'Collapse' : 'Show Starters'}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>
      </div>

      {isExpanded && (
        <div className="section-starter-body">
          <p className="form-helper-text" style={{ margin: '4px 0 12px 0' }}>
            {description}
          </p>

          <div className="archetype-grid">
            {starters.map(arch => {
              const isSelected = selectedId === arch.id;
              return (
                <button
                  key={arch.id}
                  type="button"
                  className={`archetype-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedId(arch.id);
                    setShowConfirmModal(false);
                  }}
                  aria-pressed={isSelected}
                >
                  <span className="archetype-badge">{arch.badge}</span>
                  <span className="archetype-name">{arch.name}</span>
                  <span className="archetype-desc">{arch.subtitle}</span>
                </button>
              );
            })}
          </div>

          {selectedStarter && (
            <div className="archetype-apply-bar">
              <div className="archetype-apply-summary">
                <div style={{ marginBottom: 6 }}>
                  <strong>Overview:</strong> {selectedStarter.description}
                </div>
                {selectedStarter.previewItems && selectedStarter.previewItems.length > 0 && (
                  <div className="starter-preview-pills">
                    {selectedStarter.previewItems.map((item, idx) => (
                      <span key={idx} className="starter-preview-pill">
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="archetype-actions">
                <button
                  type="button"
                  className="btn btn-primary starter-apply-btn"
                  onClick={handleApplyClick}
                >
                  <CheckCircle2 size={16} />
                  <span>Apply {selectedStarter.name}</span>
                </button>
              </div>
            </div>
          )}

          {/* Non-destructive confirmation if existing data is present */}
          {showConfirmModal && selectedStarter && (
            <div className="starter-confirm-box modal-alert info" style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <AlertCircle size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: 4 }}>
                    You already have entries recorded in this section
                  </div>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    How would you like to apply the <strong>{selectedStarter.name}</strong> starter?
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                      onClick={() => executeApply('fill_empty')}
                    >
                      <CheckCircle2 size={14} />
                      Populate Empty Fields Only (Preserve My Data)
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                      onClick={() => executeApply('replace')}
                    >
                      <RefreshCw size={14} />
                      Replace with Starter Template
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                      onClick={() => setShowConfirmModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applied Success Toast Notification */}
          {appliedNotice && (
            <div className="modal-alert success" style={{ marginTop: 12 }}>
              <CheckCircle2 size={16} />
              <span>{appliedNotice}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
