import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, Users, Phone, Mail, MapPin } from 'lucide-react';
import type { Contact } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { InfoBubble } from '../common/InfoBubble';
import { PresetChips, type PresetOption } from '../common/PresetChips';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';
import { SectionStarterBanner } from '../common/SectionStarterBanner';
import { CONTACTS_STARTERS, type SectionStarterArchetype } from '../../data/sectionStarters';

interface ContactsSectionProps {
  contacts: Contact[];
  isNotApplicable?: boolean;
  onAddContact: (contact: Contact) => void;
  onSetContacts?: (contacts: Contact[]) => void;
  onUpdateContact: (id: string, updated: Partial<Contact>) => void;
  onDeleteContact: (id: string) => void;
  onToggleNA: (isNA: boolean) => void;
}

const ROLES = [
  'Primary Executor',
  'Secondary / Alternate Executor',
  'Healthcare Proxy / Medical Agent',
  'Financial Power of Attorney (POA)',
  'Successor Trustee',
  'Guardian for Minor Children',
  'Pet Caretaker / Guardian',
  'Estate Planning Attorney',
  'CPA / Accountant',
  'Financial Advisor / Wealth Manager',
  'Primary Care Physician',
  'Clergy / Spiritual Advisor',
  'Close Family Member / Friend',
  'Other Contact'
];

const ROLE_PRESETS: PresetOption[] = [
  { label: 'Primary Executor', value: 'Primary Executor' },
  { label: 'Healthcare Proxy', value: 'Healthcare Proxy / Medical Agent' },
  { label: 'Estate Attorney', value: 'Estate Planning Attorney' },
  { label: 'CPA / Accountant', value: 'CPA / Accountant' },
  { label: 'Primary Doctor', value: 'Primary Care Physician' },
  { label: 'Pet Guardian', value: 'Pet Caretaker / Guardian' }
];

export const ContactsSection: React.FC<ContactsSectionProps> = ({
  contacts,
  isNotApplicable = false,
  onAddContact,
  onSetContacts,
  onUpdateContact,
  onDeleteContact,
  onToggleNA
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const hasExistingData = contacts.length > 0;

  const handleApplyStarter = (
    starter: SectionStarterArchetype<Contact[]>,
    mode: 'fill_empty' | 'replace'
  ) => {
    const freshContacts = starter.data.map((c, index) => ({
      ...c,
      id: `c_${Date.now()}_${index}`
    }));

    if (mode === 'replace' || !hasExistingData) {
      if (onSetContacts) {
        onSetContacts(freshContacts);
      } else {
        freshContacts.forEach(c => onAddContact(c));
      }
    } else {
      if (onSetContacts) {
        onSetContacts([...contacts, ...freshContacts]);
      } else {
        freshContacts.forEach(c => onAddContact(c));
      }
    }
  };

  const handleAddNew = (preset?: PresetOption) => {
    const newId = `c_${Date.now()}`;
    const newContact: Contact = {
      id: newId,
      name: '',
      relationship: preset?.value || 'Primary Executor',
      phone: '',
      email: '',
      address: '',
      notes: ''
    };
    onAddContact(newContact);
    setEditingId(newId);
  };

  return (
    <div className="section-content-container">
      <SectionHeader
        title="Key Advisors & Trusted Contacts"
        description="Key individuals who will execute your estate, care for your dependents, or provide professional legal and accounting counsel."
        isNotApplicable={isNotApplicable}
        isComplete={contacts.length > 0}
        onToggleNotApplicable={onToggleNA}
        actionButton={
          <button type="button" className="btn btn-primary" onClick={() => handleAddNew()}>
            <Plus size={16} /> Add Contact / Advisor
          </button>
        }
      />

      <GuidanceTip type="info" title="Why Immediate Contact Details Are Crucial">
        Having phone numbers and email addresses readily accessible allows family to notify your estate attorney, CPA, and designated guardians without searching through personal address books.
      </GuidanceTip>

      {/* 1-Click Advisors & Contacts Starters */}
      <SectionStarterBanner
        title="1-Click Advisors & Contacts Starters"
        badge="Family Circle vs. Advisory Team"
        description="Who needs to be in your corner? Select a foundational contact blueprint below to pre-fill key roles (executor, healthcare agent, physician, CPA, attorney) in one click:"
        starters={CONTACTS_STARTERS}
        onApply={handleApplyStarter}
        hasExistingData={hasExistingData}
        defaultExpanded={!hasExistingData}
      />

      <div className="quick-presets-wrapper no-print">
        <PresetChips
          title="Quick-Add key roles:"
          options={ROLE_PRESETS}
          onSelect={(preset) => handleAddNew(preset)}
        />
      </div>

      <div className="list-stack">
        {contacts.length === 0 ? (
          <div className="empty-state-card glass-panel">
            <Users size={32} className="empty-icon" />
            <p>No contacts or advisors added yet.</p>
            <button type="button" className="btn btn-secondary" onClick={() => handleAddNew()}>
              <Plus size={14} /> Add Executor or Estate Attorney
            </button>
          </div>
        ) : (
          contacts.map(c => {
            const isEditing = editingId === c.id;

            return (
              <div key={c.id} className="list-item-card glass-panel">
                {isEditing ? (
                  <div className="edit-form-grid">
                    <div className="form-group form-grid-half">
                      <label className="form-label">Full Legal Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Eleanor Vance"
                        value={c.name}
                        onChange={e => onUpdateContact(c.id, { name: e.target.value })}
                        autoFocus
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <div className="label-with-info">
                        <label className="form-label">Role or Relationship</label>
                        <InfoBubble
                          title={INFO_DEFINITIONS.poa_vs_executor.title}
                          explanation={INFO_DEFINITIONS.poa_vs_executor.explanation}
                          example={INFO_DEFINITIONS.poa_vs_executor.example}
                        />
                      </div>
                      <select
                        className="form-select"
                        value={c.relationship}
                        onChange={e => onUpdateContact(c.id, { relationship: e.target.value })}
                      >
                        {ROLES.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group form-grid-half">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="e.g. (555) 019-2831"
                        value={c.phone}
                        onChange={e => onUpdateContact(c.id, { phone: e.target.value })}
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="e.g. eleanor@vancefamily.org"
                        value={c.email}
                        onChange={e => onUpdateContact(c.id, { email: e.target.value })}
                      />
                    </div>

                    <div className="form-group form-grid-full">
                      <label className="form-label">Physical Mailing Address</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 120 Elm St, Boston, MA 02108"
                        value={c.address}
                        onChange={e => onUpdateContact(c.id, { address: e.target.value })}
                      />
                    </div>

                    <div className="form-group form-grid-full">
                      <label className="form-label">Notes & Instructions</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Holds physical copy of house key and trust documents."
                        value={c.notes}
                        onChange={e => onUpdateContact(c.id, { notes: e.target.value })}
                      />
                    </div>

                    <div className="edit-actions-row form-grid-full">
                      <button
                        type="button"
                        className="btn btn-secondary danger-btn"
                        onClick={() => {
                          onDeleteContact(c.id);
                          setEditingId(null);
                        }}
                      >
                        <Trash2 size={14} /> Remove Contact
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setEditingId(null)}
                      >
                        <Check size={14} /> Save Contact
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-card-content">
                    <div className="display-card-header">
                      <div className="display-title-group">
                        <h4>{c.name || <span className="unnamed-placeholder">Unnamed Contact</span>}</h4>
                        <span className="role-tag">{c.relationship}</span>
                      </div>
                      <div className="card-actions">
                        {confirmDeleteId === c.id ? (
                          <div className="inline-delete-confirm">
                            <span className="delete-prompt-text">Delete?</span>
                            <button
                              type="button"
                              className="btn-action-sm danger"
                              onClick={() => {
                                onDeleteContact(c.id);
                                setConfirmDeleteId(null);
                              }}
                            >
                              Yes, Delete
                            </button>
                            <button
                              type="button"
                              className="btn-action-sm"
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn-action-sm"
                              onClick={() => setEditingId(c.id)}
                            >
                              <Edit3 size={14} /> <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="btn-action-sm danger"
                              onClick={() => setConfirmDeleteId(c.id)}
                            >
                              <Trash2 size={14} /> <span>Remove</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="display-card-body">
                      <div className="contact-details-grid">
                        {c.phone && (
                          <div className="detail-item">
                            <Phone size={14} className="detail-icon" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                        {c.email && (
                          <div className="detail-item">
                            <Mail size={14} className="detail-icon" />
                            <span>{c.email}</span>
                          </div>
                        )}
                        {c.address && (
                          <div className="detail-item full-width">
                            <MapPin size={14} className="detail-icon" />
                            <span>{c.address}</span>
                          </div>
                        )}
                      </div>

                      {c.notes && (
                        <p className="item-notes-text">{c.notes}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
