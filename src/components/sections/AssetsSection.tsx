import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, Home, MapPin, Key } from 'lucide-react';
import type { Asset } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { PrivacyField } from '../common/PrivacyField';
import { InfoBubble } from '../common/InfoBubble';
import { PresetChips, type PresetOption } from '../common/PresetChips';
import { INFO_DEFINITIONS } from '../../data/infoDefinitions';

interface AssetsSectionProps {
  assets: Asset[];
  isPrivacyMasked: boolean;
  isNotApplicable?: boolean;
  onAddAsset: (asset: Asset) => void;
  onUpdateAsset: (id: string, updated: Partial<Asset>) => void;
  onDeleteAsset: (id: string) => void;
  onToggleNA: (isNA: boolean) => void;
}

const CATEGORIES = [
  { value: 'real_estate', label: 'Real Estate (Home, Land, Rental Property)' },
  { value: 'vehicle', label: 'Vehicle (Car, Motorcycle, Boat, RV)' },
  { value: 'safe_storage', label: 'Home Safe / Lockbox / Storage Unit' },
  { value: 'valuable', label: 'Valuable Collection / Jewelry / Art / Firearms' },
  { value: 'business_interest', label: 'Business Ownership / LLC / Partnership' },
  { value: 'other', label: 'Other Physical Property' }
];

const ASSET_PRESETS: PresetOption[] = [
  { label: 'Primary Residence', value: 'Primary Home & Residence', category: 'real_estate' },
  { label: 'Primary Vehicle', value: 'Primary Automobile', category: 'vehicle' },
  { label: 'Bedroom Fire Safe', value: 'Home Fireproof Safe (Master Bedroom)', category: 'safe_storage' },
  { label: 'Storage Unit', value: 'Commercial Storage Locker', category: 'safe_storage' },
  { label: 'Jewelry / Valuables', value: 'Fine Jewelry & Watch Collection', category: 'valuable' }
];

export const AssetsSection: React.FC<AssetsSectionProps> = ({
  assets,
  isPrivacyMasked,
  isNotApplicable = false,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  onToggleNA
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleAddNew = (preset?: PresetOption) => {
    const newId = `a_${Date.now()}`;
    const newAsset: Asset = {
      id: newId,
      description: preset?.value || '',
      category: (preset?.category as Asset['category']) || 'real_estate',
      location: '',
      titleHolder: '',
      estimatedValue: '',
      notes: ''
    };
    onAddAsset(newAsset);
    setEditingId(newId);
  };

  return (
    <div className="section-content-container">
      <SectionHeader
        title="Real Estate, Vehicles & Physical Safes"
        description="Locations and ownership details for homes, vehicles, storage lockers, and home fireproof safes."
        isNotApplicable={isNotApplicable}
        isComplete={assets.length > 0}
        onToggleNotApplicable={onToggleNA}
        actionButton={
          <button type="button" className="btn btn-primary" onClick={() => handleAddNew()}>
            <Plus size={16} /> Add Asset or Safe
          </button>
        }
      />

      <GuidanceTip type="info" title="Title & Deed Guidance">
        How property is titled determines whether it goes through probate. E.g., property held in <strong>Joint Tenancy with Right of Survivorship (JTWROS)</strong> or inside a <strong>Living Trust</strong> transfers automatically to the co-owner/beneficiary without probate.
      </GuidanceTip>

      {/* Quick-Add Presets */}
      <div className="quick-presets-wrapper no-print">
        <PresetChips
          title="Quick-Add common property & safes:"
          options={ASSET_PRESETS}
          onSelect={(preset) => handleAddNew(preset)}
        />
      </div>

      <div className="list-stack">
        {assets.length === 0 ? (
          <div className="empty-state-card glass-panel">
            <Home size={32} className="empty-icon" />
            <p>No real estate, vehicles, or physical safes recorded yet.</p>
            <button type="button" className="btn btn-secondary" onClick={() => handleAddNew()}>
              <Plus size={14} /> Add Primary Residence or Vehicle
            </button>
          </div>
        ) : (
          assets.map(asset => {
            const isEditing = editingId === asset.id;

            return (
              <div key={asset.id} className="list-item-card glass-panel">
                {isEditing ? (
                  <div className="edit-form-grid">
                    <div className="form-group form-grid-half">
                      <label className="form-label">Asset Description</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Primary Residence / 2021 Toyota RAV4 / SentrySafe in Master Bedroom"
                        value={asset.description}
                        onChange={e => onUpdateAsset(asset.id, { description: e.target.value })}
                        autoFocus
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={asset.category}
                        onChange={e => onUpdateAsset(asset.id, { category: e.target.value as Asset['category'] })}
                      >
                        {CATEGORIES.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group form-grid-half">
                      <label className="form-label">Location / Physical Address</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 123 Maple St / Garage / Bedroom closet shelf"
                        value={asset.location}
                        onChange={e => onUpdateAsset(asset.id, { location: e.target.value })}
                      />
                    </div>

                    <div className="form-group form-grid-full">
                      <div className="label-with-info">
                        <label className="form-label">Who is on the deed / title? (Legal Ownership)</label>
                        <InfoBubble
                          title={INFO_DEFINITIONS.property_titling.title}
                          explanation={INFO_DEFINITIONS.property_titling.explanation}
                          example={INFO_DEFINITIONS.property_titling.example}
                        />
                      </div>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Joint Tenancy with Right of Survivorship (JTWROS) / In Revocable Living Trust"
                        value={asset.titleHolder}
                        onChange={e => onUpdateAsset(asset.id, { titleHolder: e.target.value })}
                      />
                      <PresetChips
                        title="Common deed titling presets:"
                        options={[
                          'Joint Tenants w/ Survivorship (JTWROS)',
                          'Tenancy by the Entirety (TBE)',
                          'In Revocable Living Trust',
                          'Transfer on Death Deed (TODD)',
                          'Lady Bird Deed',
                          'Tenancy in Common (TIC)',
                          'Sole Owner'
                        ]}
                        onSelect={(opt: PresetOption) => onUpdateAsset(asset.id, { titleHolder: opt.value })}
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <PrivacyField
                        label="Estimated Value / Equity"
                        placeholder="e.g. $450,000 (Mortgage balance $180k)"
                        value={asset.estimatedValue}
                        isMaskedGlobal={isPrivacyMasked}
                        onChange={val => onUpdateAsset(asset.id, { estimatedValue: val })}
                      />
                    </div>

                    <div className="form-group form-grid-half">
                      <PrivacyField
                        label="Key Locations, Safe Combinations & Codes"
                        placeholder="e.g. Safe code is 18-92-04. Spare car key in kitchen junk drawer."
                        value={asset.notes}
                        isMaskedGlobal={isPrivacyMasked}
                        onChange={val => onUpdateAsset(asset.id, { notes: val })}
                        helperText="Sensitive codes are shielded by Privacy Mask."
                      />
                    </div>

                    <div className="edit-actions-row form-grid-full">
                      <button
                        type="button"
                        className="btn btn-secondary danger-btn"
                        onClick={() => {
                          onDeleteAsset(asset.id);
                          setEditingId(null);
                        }}
                      >
                        <Trash2 size={14} /> Remove Asset
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setEditingId(null)}
                      >
                        <Check size={14} /> Save Asset
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-card-content">
                    <div className="display-card-header">
                      <div className="display-title-group">
                        <h4>{asset.description || <span className="unnamed-placeholder">Unnamed Asset</span>}</h4>
                        <span className="role-tag">
                          {CATEGORIES.find(c => c.value === asset.category)?.label.split(' ')[0] || asset.category}
                        </span>
                        {asset.estimatedValue && (
                          <span className="identifier-tag">
                            {isPrivacyMasked ? '••••••••' : asset.estimatedValue}
                          </span>
                        )}
                      </div>
                      <div className="card-actions">
                        {confirmDeleteId === asset.id ? (
                          <div className="inline-delete-confirm">
                            <span className="delete-prompt-text">Delete?</span>
                            <button
                              type="button"
                              className="btn-action-sm danger"
                              onClick={() => {
                                onDeleteAsset(asset.id);
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
                              onClick={() => setEditingId(asset.id)}
                            >
                              <Edit3 size={14} /> <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="btn-action-sm danger"
                              onClick={() => setConfirmDeleteId(asset.id)}
                            >
                              <Trash2 size={14} /> <span>Remove</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="display-card-body">
                      <div className="contact-details-grid">
                        {asset.location && (
                          <div className="detail-item">
                            <MapPin size={14} className="detail-icon" />
                            <span>{asset.location}</span>
                          </div>
                        )}
                        {asset.titleHolder && (
                          <div className="detail-item">
                            <Home size={14} className="detail-icon" />
                            <span>Titled as: {asset.titleHolder}</span>
                          </div>
                        )}
                      </div>

                      {asset.notes && (
                        <div className="detail-item full-width" style={{ marginTop: '8px' }}>
                          <Key size={14} className="detail-icon" />
                          <span className="item-notes-text">
                            {isPrivacyMasked ? '••••••••••••••••••••' : asset.notes}
                          </span>
                        </div>
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
