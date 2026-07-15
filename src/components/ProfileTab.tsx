import React, { useState } from 'react';
import type { LibraryItem, UserProfile } from '../types';

interface ProfileTabProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  library: LibraryItem[];
  apiKey: string;
  onSaveKey: (key: string) => void;
  onGameClick?: (gameId: number) => void;
}

const PRESET_AVATARS = [
  { name: 'Geometric Neon', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150' },
  { name: 'Cyberpunk Grid', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=150' },
  { name: 'Retro Console', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=150' },
  { name: 'Astral Nebula', url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=150' },
  { name: 'Elden Knight', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=150' },
];

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  onSaveProfile,
  library,
  apiKey,
  onSaveKey,
  onGameClick,
}) => {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [keyInput, setKeyInput] = useState(apiKey);
  const [isEditing, setIsEditing] = useState(false);
  const [keyStatusMessage, setKeyStatusMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });

  // Calculate statistics
  const totalGames = library.length;
  const playing = library.filter((i) => i.status === 'playing').length;
  const backlog = library.filter((i) => i.status === 'backlog').length;
  const completed = library.filter((i) => i.status === 'completed').length;

  // Sort library items by addedAt descending to find recent activities
  const recentActivities = [...library]
    .sort((a, b) => new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime())
    .slice(0, 3);

  // Relative time helper
  const getRelativeTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      if (isNaN(diffMs) || diffMs < 0) return 'Just now';

      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;

      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 30) return `${diffDays} days ago`;

      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths === 1) return '1 month ago';
      return `${diffMonths} months ago`;
    } catch {
      return 'Just now';
    }
  };

  // Status label helper
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'playing':
        return 'Started Playing';
      case 'backlog':
        return 'Added to Backlog';
      case 'completed':
        return 'Completed Game';
      case 'want_to_play':
        return 'Wants to Play';
      default:
        return 'Added Game';
    }
  };

  const handleSaveProfileClick = () => {
    onSaveProfile({ username, bio, avatarUrl });
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setUsername(profile.username);
    setBio(profile.bio);
    setAvatarUrl(profile.avatarUrl);
    setIsEditing(false);
  };

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setKeyStatusMessage({ type: '', text: '' });

    if (!keyInput.trim()) {
      onSaveKey('');
      setKeyStatusMessage({ type: 'success', text: 'API Key removed. Switched to offline Mock Mode.' });
      return;
    }

    // Verify key
    try {
      const res = await fetch(`https://api.rawg.io/api/games?key=${keyInput.trim()}&page_size=1`);
      if (res.ok) {
        onSaveKey(keyInput.trim());
        setKeyStatusMessage({ type: 'success', text: 'RAWG API Key verified and saved successfully!' });
      } else {
        setKeyStatusMessage({ type: 'error', text: 'Invalid API Key. Please check and try again.' });
      }
    } catch {
      setKeyStatusMessage({ type: 'error', text: 'Network validation failed. Saved locally anyway.' });
      onSaveKey(keyInput.trim());
    }
  };

  return (
    <div className="profile-tab animate-fade-in">
      <h1 className="tab-title">Player Profile</h1>

      <div className="profile-layout-grid">
        {/* Left Column: Profile Card & Edit Forms */}
        <div className="profile-left-col">
          <div className="profile-card glass-panel">
            <div className="profile-card-header">
              <img src={profile.avatarUrl} alt="Avatar" className="profile-large-avatar" />
              <div className="profile-main-meta">
                <h2>{profile.username}</h2>
                <p className="profile-tagline">{profile.bio}</p>
                <div className="profile-level-badge">LEVEL {Math.max(1, Math.floor(totalGames / 3) + 1)} COLLECTOR</div>
              </div>
            </div>

            {!isEditing ? (
              <button type="button" className="btn-secondary btn-full" onClick={() => setIsEditing(true)}>
                Edit Profile Details
              </button>
            ) : (
              <div className="profile-edit-form animate-fade-in">
                <div className="form-group">
                  <label htmlFor="edit-username">Player Name</label>
                  <input
                    id="edit-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-bio">Gaming Bio</label>
                  <textarea
                    id="edit-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="text-input textarea-input"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>Choose Avatar Image</label>
                  <div className="avatar-presets-grid">
                    {PRESET_AVATARS.map((avatar) => (
                      <div
                        key={avatar.name}
                        className={`avatar-preset-item ${avatarUrl === avatar.url ? 'active' : ''}`}
                        onClick={() => setAvatarUrl(avatar.url)}
                      >
                        <img src={avatar.url} alt={avatar.name} className="preset-img" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-actions-row">
                  <button type="button" className="btn-secondary" onClick={handleCancelClick}>
                    Cancel
                  </button>
                  <button type="button" className="btn-primary" onClick={handleSaveProfileClick} disabled={!username.trim()}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* API Key Management Hub */}
          <div className="api-manager-card glass-panel">
            <h3>RAWG API Integration</h3>
            <p className="description-text">
              Configure your RAWG API credentials here to fetch live data directly from the gaming databases.
            </p>
            <form onSubmit={handleSaveApiKey} className="api-config-form">
              <div className="form-group">
                <label htmlFor="api-key-profile">RAWG API Key</label>
                <input
                  id="api-key-profile"
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Enter RAWG developer key..."
                  className="text-input"
                />
              </div>

              {keyStatusMessage.text && (
                <div className={keyStatusMessage.type === 'success' ? 'success-message' : 'error-message'}>
                  {keyStatusMessage.text}
                </div>
              )}

              <div className="form-actions-row">
                <button type="submit" className="btn-primary">
                  Verify &amp; Save Key
                </button>
              </div>
            </form>
            <div className="key-guide">
              <h3>Need a key?</h3>
              <p>Get a free personal key instantly by signing up on RAWG:</p>
              <a href="https://rawg.io/apidocs" target="_blank" rel="noreferrer">
                rawg.io/apidocs &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Logbook Dashboard */}
        <div className="profile-right-col">
          <div className="logbook-panel glass-panel">
            <div className="logbook-header">
              <h3>Logbook</h3>
              <div className="logbook-actions">
                {/* Search Action Icon */}
                <svg className="logbook-action-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                {/* Options Action Icon */}
                <svg className="logbook-action-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </div>
            </div>

            <div className="logbook-grid">
              {/* Collected Card */}
              <div className="logbook-card">
                <div className="logbook-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                </div>
                <span className="logbook-card-value">{totalGames}</span>
                <span className="logbook-card-label">Collected</span>
              </div>

              {/* Beaten Card */}
              <div className="logbook-card">
                <div className="logbook-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span className="logbook-card-value">{completed}</span>
                <span className="logbook-card-label">Beaten</span>
              </div>

              {/* Backlog Card */}
              <div className="logbook-card">
                <div className="logbook-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <span className="logbook-card-value">{backlog}</span>
                <span className="logbook-card-label">Backlog</span>
              </div>

              {/* Playing Card */}
              <div className="logbook-card">
                <div className="logbook-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="6" y1="12" x2="10" y2="12"></line>
                    <line x1="8" y1="10" x2="8" y2="14"></line>
                    <line x1="15" y1="13" x2="15.01" y2="13"></line>
                    <line x1="18" y1="11" x2="18.01" y2="11"></line>
                    <rect x="2" y="6" width="20" height="12" rx="3"></rect>
                  </svg>
                </div>
                <span className="logbook-card-value">{playing}</span>
                <span className="logbook-card-label">Playing</span>
              </div>
            </div>

            <div className="activity-section">
              <h4 className="activity-section-header">Recent Activity</h4>
              <div className="activity-list">
                {recentActivities.length > 0 ? (
                  recentActivities.map((item) => {
                    const relativeTime = getRelativeTime(item.addedAt);
                    const statusLabel = getStatusLabel(item.status);
                    const statusClass = item.status;
                    return (
                      <div
                        key={item.game.id}
                        className="activity-card"
                        onClick={() => onGameClick && onGameClick(item.game.id)}
                      >
                        <div
                          className="activity-bg"
                          style={{ backgroundImage: `url(${item.game.background_image})` }}
                        ></div>
                        <div className="activity-overlay">
                          <div className="activity-header">
                            <span className="activity-time">{relativeTime}</span>
                            <svg className="activity-pulse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                            </svg>
                          </div>
                          <div className="activity-body">
                            <span className={`activity-status-label ${statusClass}`}>
                              {statusLabel}
                            </span>
                            <h5 className="activity-game-title">{item.game.name}</h5>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="activity-empty-state">
                    <span>No recent activity. Start tracking games to build your timeline!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
