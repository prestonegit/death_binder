import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import type { LegacyMemories } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import { GuidanceTip } from '../common/GuidanceTip';
import { SectionStarterBanner } from '../common/SectionStarterBanner';
import { LEGACY_STARTERS, type SectionStarterArchetype } from '../../data/sectionStarters';

interface LegacySectionProps {
  memories: LegacyMemories;
  isNotApplicable?: boolean;
  onUpdate: (updated: Partial<LegacyMemories>) => void;
  onToggleNA: (isNA: boolean) => void;
}

export const LegacySection: React.FC<LegacySectionProps> = ({
  memories,
  isNotApplicable = false,
  onUpdate,
  onToggleNA
}) => {
  const hasExistingData = Boolean(
    memories.familyOrigins ||
    memories.traditionsRecipes ||
    memories.lifeLessonsWisdom ||
    memories.bucketListCompleted ||
    memories.bucketListFuture ||
    memories.notes
  );

  const handleApplyStarter = (
    starter: SectionStarterArchetype<LegacyMemories>,
    mode: 'fill_empty' | 'replace'
  ) => {
    if (mode === 'replace') {
      onUpdate({ ...starter.data });
    } else {
      const merged: Partial<LegacyMemories> = {};
      const starterData = starter.data;
      (Object.keys(starterData) as Array<keyof LegacyMemories>).forEach(key => {
        if (!memories[key] && starterData[key]) {
          merged[key] = starterData[key];
        }
      });
      onUpdate(merged);
    }
  };

  return (
    <div className="section-content-container">
      <SectionHeader
        title="Legacy, Memories & Life Wisdom"
        description="Preserve family history, cherished recipes, life philosophy, core principles, and personal memories for future generations."
        isNotApplicable={isNotApplicable}
        isComplete={!!memories.familyOrigins || !!memories.lifeLessonsWisdom || !!memories.traditionsRecipes}
        onToggleNotApplicable={onToggleNA}
      />

      <GuidanceTip type="calm" title="The Non-Financial Legacy">
        While financial and legal details are necessary, the stories, principles, and traditions you record here are often what your children and grandchildren cherish the most.
      </GuidanceTip>

      {/* 1-Click Legacy & Life Wisdom Starters */}
      <SectionStarterBanner
        title="1-Click Legacy & Life Wisdom Starters"
        badge="From Family Storyteller to Adventurer"
        description="Staring at a blank page when writing life advice or family memories is difficult. Choose a thoughtful reflection archetype below to pre-fill articulate memories, then edit or add your own stories:"
        starters={LEGACY_STARTERS}
        onApply={handleApplyStarter}
        hasExistingData={hasExistingData}
        defaultExpanded={!hasExistingData}
      />

      <div className="form-card glass-panel">
        <div className="form-section-title">
          <BookOpen size={18} />
          <h3>Family Heritage & Traditions</h3>
        </div>

        <div className="form-grid">
          <div className="form-group form-grid-full">
            <label className="form-label">Family Origins, Genealogy & Heritage</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="e.g. Immigrated from County Cork, Ireland in 1920. Grandfather Robert was a carpenter in Boston..."
              value={memories.familyOrigins}
              onChange={e => onUpdate({ familyOrigins: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Cherished Traditions, Holiday Customs & Secret Recipes</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="e.g. Grandma's Sunday pasta sauce recipe, Christmas Eve reading tradition, annual summer lake cabin trips..."
              value={memories.traditionsRecipes}
              onChange={e => onUpdate({ traditionsRecipes: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="form-card glass-panel" style={{ marginTop: '24px' }}>
        <div className="form-section-title">
          <Sparkles size={18} />
          <h3>Life Lessons & Guiding Wisdom</h3>
        </div>

        <div className="form-grid">
          <div className="form-group form-grid-full">
            <label className="form-label">Hard-Earned Life Lessons, Values & Principles</label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="e.g. Always be generous with your time; value relationships above material things; never stop learning..."
              value={memories.lifeLessonsWisdom}
              onChange={e => onUpdate({ lifeLessonsWisdom: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Completed Bucket List & Proudest Accomplishments</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="e.g. Built our own home in 1995, hiked the Appalachian Trail, saw the Northern Lights in Norway..."
              value={memories.bucketListCompleted}
              onChange={e => onUpdate({ bucketListCompleted: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-half">
            <label className="form-label">Wishes & Hopes for the Family's Future</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="e.g. I hope the grandchildren continue to prioritize education and take care of one another..."
              value={memories.bucketListFuture}
              onChange={e => onUpdate({ bucketListFuture: e.target.value })}
            />
          </div>

          <div className="form-group form-grid-full">
            <label className="form-label">Additional Reflections / Favorite Quotes</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Any additional thoughts, quotes, or blessings..."
              value={memories.notes}
              onChange={e => onUpdate({ notes: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
