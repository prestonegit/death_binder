import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, Gift, Heart, User } from 'lucide-react';
import type { SentimentalItem, PetCare } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { InfoBubble } from '../common/InfoBubble';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';

interface SentimentalPetsSectionProps {
  items: SentimentalItem[];
  pets: PetCare[];
  isNotApplicable?: boolean;
  onAddItem: (item: SentimentalItem) => void;
  onUpdateItem: (id: string, updated: Partial<SentimentalItem>) => void;
  onDeleteItem: (id: string) => void;
  onAddPet: (pet: PetCare) => void;
  onUpdatePet: (id: string, updated: Partial<PetCare>) => void;
  onDeletePet: (id: string) => void;
  onToggleNA: (isNA: boolean) => void;
}

export const SentimentalPetsSection: React.FC<SentimentalPetsSectionProps> = ({
  items,
  pets,
  isNotApplicable = false,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onAddPet,
  onUpdatePet,
  onDeletePet,
  onToggleNA
}) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [confirmDeleteItemId, setConfirmDeleteItemId] = useState<string | null>(null);
  const [confirmDeletePetId, setConfirmDeletePetId] = useState<string | null>(null);

  const handleAddNewItem = () => {
    const newId = `s_${Date.now()}`;
    const newItem: SentimentalItem = {
      id: newId,
      description: '',
      significance: '',
      recipient: '',
      location: '',
      notes: ''
    };
    onAddItem(newItem);
    setEditingItemId(newId);
  };

  const handleAddNewPet = () => {
    const newId = `p_${Date.now()}`;
    const newPet: PetCare = {
      id: newId,
      petName: '',
      typeBreed: '',
      vetContact: '',
      careInstructions: '',
      microchipInfo: '',
      designatedGuardian: '',
      foodMedicationSchedule: '',
      notes: ''
    };
    onAddPet(newPet);
    setEditingPetId(newId);
  };

  return (
    <div className="section-content-container">
      <SectionHeader
        title="Heirlooms, Keepsakes & Pet Care"
        description="Designate cherished personal heirlooms to specific family members and record daily routines and guardianship for beloved pets."
        isNotApplicable={isNotApplicable}
        isComplete={items.length > 0 || pets.length > 0}
        onToggleNotApplicable={onToggleNA}
      />

      <GuidanceTip type="info" title="Personal Property Memorandum (Heirlooms List)">
        In most jurisdictions, a written list of sentimental items referenced by your Will is legally honored to distribute personal keepsakes without paying an attorney to re-draft your Will.
      </GuidanceTip>

      {/* Part 1: Sentimental Heirlooms */}
      <div className="sub-section-block">
        <div className="sub-section-header">
          <div className="sub-section-title-wrap">
            <Gift size={20} className="accent-color" />
            <h3>Cherished Sentimental Belongings & Heirlooms</h3>
            <InfoBubble
              title={INFO_DEFINITIONS.heirloom_memo.title}
              explanation={INFO_DEFINITIONS.heirloom_memo.explanation}
              example={INFO_DEFINITIONS.heirloom_memo.example}
            />
          </div>
          <button type="button" className="btn btn-secondary" onClick={handleAddNewItem}>
            <Plus size={14} /> Add Heirloom
          </button>
        </div>

        <div className="list-stack">
          {items.length === 0 ? (
            <div className="empty-state-card glass-panel">
              <Gift size={28} className="empty-icon" />
              <p>No sentimental items or heirlooms listed yet.</p>
              <button type="button" className="btn btn-secondary" onClick={handleAddNewItem}>
                <Plus size={14} /> Record First Heirloom
              </button>
            </div>
          ) : (
            items.map(item => {
              const isEditing = editingItemId === item.id;

              return (
                <div key={item.id} className="list-item-card glass-panel">
                  {isEditing ? (
                    <div className="edit-form-grid">
                      <div className="form-group form-grid-half">
                        <label className="form-label">Item Description</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Grandfather's 1952 Gold Pocket Watch"
                          value={item.description}
                          onChange={e => onUpdateItem(item.id, { description: e.target.value })}
                          autoFocus
                        />
                      </div>

                      <div className="form-group form-grid-half">
                        <label className="form-label">Intended Recipient</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Grandson Thomas Vance"
                          value={item.recipient}
                          onChange={e => onUpdateItem(item.id, { recipient: e.target.value })}
                        />
                      </div>

                      <div className="form-group form-grid-half">
                        <label className="form-label">Current Physical Location</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Top drawer in oak jewelry box"
                          value={item.location}
                          onChange={e => onUpdateItem(item.id, { location: e.target.value })}
                        />
                      </div>

                      <div className="form-group form-grid-half">
                        <label className="form-label">Story / Sentimental Significance</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Given to grandfather upon retirement in 1970."
                          value={item.significance}
                          onChange={e => onUpdateItem(item.id, { significance: e.target.value })}
                        />
                      </div>

                      <div className="edit-actions-row form-grid-full">
                        <button
                          type="button"
                          className="btn btn-secondary danger-btn"
                          onClick={() => {
                            onDeleteItem(item.id);
                            setEditingItemId(null);
                          }}
                        >
                          <Trash2 size={14} /> Remove Item
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setEditingItemId(null)}
                        >
                          <Check size={14} /> Save Heirloom
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="display-card-content">
                      <div className="display-card-header">
                        <div className="display-title-group">
                          <h4>{item.description || <span className="unnamed-placeholder">Unnamed Item</span>}</h4>
                          {item.recipient && (
                            <span className="role-tag">For: {item.recipient}</span>
                          )}
                        </div>
                        <div className="card-actions">
                        {confirmDeleteItemId === item.id ? (
                          <div className="inline-delete-confirm">
                            <span className="delete-prompt-text">Delete?</span>
                            <button
                              type="button"
                              className="btn-action-sm danger"
                              onClick={() => {
                                onDeleteItem(item.id);
                                setConfirmDeleteItemId(null);
                              }}
                            >
                              Yes, Delete
                            </button>
                            <button
                              type="button"
                              className="btn-action-sm"
                              onClick={() => setConfirmDeleteItemId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn-action-sm"
                              onClick={() => setEditingItemId(item.id)}
                            >
                              <Edit3 size={14} /> <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="btn-action-sm danger"
                              onClick={() => setConfirmDeleteItemId(item.id)}
                            >
                              <Trash2 size={14} /> <span>Remove</span>
                            </button>
                          </>
                        )}
                      </div>
                      </div>

                      <div className="display-card-body">
                        {item.location && (
                          <p className="detail-line"><strong>Location:</strong> {item.location}</p>
                        )}
                        {item.significance && (
                          <p className="item-notes-text">"{item.significance}"</p>
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

      {/* Part 2: Pet Care & Guardianship */}
      <div className="sub-section-block" style={{ marginTop: '36px' }}>
        <div className="sub-section-header">
          <div className="sub-section-title-wrap">
            <Heart size={20} className="accent-color" />
            <h3>Pet Care, Health & Designated Guardianship</h3>
          </div>
          <button type="button" className="btn btn-secondary" onClick={handleAddNewPet}>
            <Plus size={14} /> Add Pet
          </button>
        </div>

        <div className="list-stack">
          {pets.length === 0 ? (
            <div className="empty-state-card glass-panel">
              <Heart size={28} className="empty-icon" />
              <p>No pets listed.</p>
              <button type="button" className="btn btn-secondary" onClick={handleAddNewPet}>
                <Plus size={14} /> Add Dog, Cat or Other Pet
              </button>
            </div>
          ) : (
            pets.map(pet => {
              const isEditing = editingPetId === pet.id;

              return (
                <div key={pet.id} className="list-item-card glass-panel">
                  {isEditing ? (
                    <div className="edit-form-grid">
                      <div className="form-group form-grid-half">
                        <label className="form-label">Pet Name</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Bailey"
                          value={pet.petName}
                          onChange={e => onUpdatePet(pet.id, { petName: e.target.value })}
                          autoFocus
                        />
                      </div>

                      <div className="form-group form-grid-half">
                        <label className="form-label">Type & Breed</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Golden Retriever (Age 6)"
                          value={pet.typeBreed}
                          onChange={e => onUpdatePet(pet.id, { typeBreed: e.target.value })}
                        />
                      </div>

                      <div className="form-group form-grid-half">
                        <label className="form-label">Designated Guardian</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Sister Jane Vance (555) 019-2831 (Agreed)"
                          value={pet.designatedGuardian}
                          onChange={e => onUpdatePet(pet.id, { designatedGuardian: e.target.value })}
                        />
                      </div>

                      <div className="form-group form-grid-half">
                        <label className="form-label">Veterinarian Contact</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Valley Vet Clinic Dr. Miller — (555) 948-2231"
                          value={pet.vetContact}
                          onChange={e => onUpdatePet(pet.id, { vetContact: e.target.value })}
                        />
                      </div>

                      <div className="form-group form-grid-half">
                        <label className="form-label">Microchip ID & Registry</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. HomeAgain Microchip #985140291"
                          value={pet.microchipInfo}
                          onChange={e => onUpdatePet(pet.id, { microchipInfo: e.target.value })}
                        />
                      </div>

                      <div className="form-group form-grid-half">
                        <label className="form-label">Feeding & Medication Schedule</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 1 cup kibble 8am & 6pm. Apoquel 1 tablet daily."
                          value={pet.foodMedicationSchedule}
                          onChange={e => onUpdatePet(pet.id, { foodMedicationSchedule: e.target.value })}
                        />
                      </div>

                      <div className="form-group form-grid-full">
                        <label className="form-label">Care Instructions & Temperament</label>
                        <textarea
                          className="form-input"
                          rows={2}
                          placeholder="e.g. Loves belly rubs; frightened of thunderstorms (thunder shirt in hall closet)."
                          value={pet.careInstructions}
                          onChange={e => onUpdatePet(pet.id, { careInstructions: e.target.value })}
                        />
                      </div>

                      <div className="edit-actions-row form-grid-full">
                        <button
                          type="button"
                          className="btn btn-secondary danger-btn"
                          onClick={() => {
                            onDeletePet(pet.id);
                            setEditingPetId(null);
                          }}
                        >
                          <Trash2 size={14} /> Remove Pet
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setEditingPetId(null)}
                        >
                          <Check size={14} /> Save Pet
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="display-card-content">
                      <div className="display-card-header">
                        <div className="display-title-group">
                          <h4>{pet.petName || <span className="unnamed-placeholder">Unnamed Pet</span>}</h4>
                          {pet.typeBreed && <span className="role-tag">{pet.typeBreed}</span>}
                        </div>
                        <div className="card-actions">
                          {confirmDeletePetId === pet.id ? (
                            <div className="inline-delete-confirm">
                              <span className="delete-prompt-text">Delete?</span>
                              <button
                                type="button"
                                className="btn-action-sm danger"
                                onClick={() => {
                                  onDeletePet(pet.id);
                                  setConfirmDeletePetId(null);
                                }}
                              >
                                Yes, Delete
                              </button>
                              <button
                                type="button"
                                className="btn-action-sm"
                                onClick={() => setConfirmDeletePetId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="btn-action-sm"
                                onClick={() => setEditingPetId(pet.id)}
                              >
                                <Edit3 size={14} /> <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                className="btn-action-sm danger"
                                onClick={() => setConfirmDeletePetId(pet.id)}
                              >
                                <Trash2 size={14} /> <span>Remove</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="display-card-body">
                        <div className="contact-details-grid">
                          {pet.designatedGuardian && (
                            <div className="detail-item">
                              <User size={14} className="detail-icon" />
                              <span><strong>Guardian:</strong> {pet.designatedGuardian}</span>
                            </div>
                          )}
                          {pet.vetContact && (
                            <div className="detail-item">
                              <span><strong>Vet:</strong> {pet.vetContact}</span>
                            </div>
                          )}
                          {pet.foodMedicationSchedule && (
                            <div className="detail-item full-width">
                              <span><strong>Routine:</strong> {pet.foodMedicationSchedule}</span>
                            </div>
                          )}
                        </div>

                        {pet.careInstructions && (
                          <p className="item-notes-text">{pet.careInstructions}</p>
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
    </div>
  );
};
