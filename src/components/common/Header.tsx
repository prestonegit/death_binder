import React from 'react';
import { 
  Sun, Moon, Eye, EyeOff, Edit3, 
  Check, Loader2, Shield
} from 'lucide-react';
import type { ProfileData } from '../../types';

interface HeaderProps {
  profile: ProfileData;
  theme: 'light' | 'dark';
  isPrivacyMasked: boolean;
  saveStatus: 'saved' | 'saving';
  lastSavedTime: string;
  onToggleTheme: () => void;
  onTogglePrivacyMask: () => void;
  onOpenRenameProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  theme,
  isPrivacyMasked,
  saveStatus,
  lastSavedTime,
  onToggleTheme,
  onTogglePrivacyMask,
  onOpenRenameProfile
}) => {
  return (
    <header className="app-top-header no-print">
      <div className="header-left">
        <div 
          className="active-profile-badge" 
          onClick={onOpenRenameProfile} 
          title="Click to rename profile"
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenRenameProfile();
            }
          }}
        >
          <Shield size={14} className="profile-badge-icon" />
          <span className="profile-badge-name">{profile.profileName}</span>
          <Edit3 size={11} className="profile-edit-pencil" />
        </div>

        {/* Auto-save status indicator */}
        <div className="save-status-indicator" title={`Last auto-saved at ${lastSavedTime}`}>
          {saveStatus === 'saving' ? (
            <>
              <Loader2 size={12} className="animate-spin saving-icon" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check size={12} className="saved-icon" />
              <span>Saved locally ({lastSavedTime})</span>
            </>
          )}
        </div>
      </div>

      <div className="header-right">
        {/* Privacy Mask Toggle Button */}
        <button
          type="button"
          className={`header-tool-btn privacy-shield-btn ${isPrivacyMasked ? 'active-shield' : ''}`}
          onClick={onTogglePrivacyMask}
          title={isPrivacyMasked ? 'Privacy Shield is ON (Alt+P to unmask)' : 'Turn ON Privacy Shield to obscure sensitive data (Alt+P)'}
        >
          {isPrivacyMasked ? <EyeOff size={15} /> : <Eye size={15} />}
          <span>{isPrivacyMasked ? 'Privacy Shield ON' : 'Privacy Shield'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          className="header-icon-btn theme-toggle-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Warm Paper Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
};

