import React, { useState } from 'react';
import type { LibraryItem, UserProfile } from '../types';

interface ProfileTabProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  library: LibraryItem[];
  apiKey: string;
  onSaveKey: (key: string) => void;
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
  const wantToPlay = library.filter((i) => i.status === 'want_to_play').length;

  const completionRate = totalGames > 0 ? Math.round((completed / totalGames) * 100) : 0;

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

        {/* Right Column: Library Statistics Tracker */}
        <div className="profile-right-col">
          <div className="stats-analysis-card glass-panel">
            <h3>Library Statistics</h3>

            <div className="completion-gauge-container">
              <div className="completion-ring-visual">
                <svg viewBox="0 0 100 100" width="120" height="120" className="completion-svg">
                  <circle cx="50" cy="50" r="40" className="circle-bg" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="circle-fill"
                    style={{ strokeDasharray: `${2 * Math.PI * 40}`, strokeDashoffset: `${2 * Math.PI * 40 * (1 - completionRate / 100)}` }}
                  />
                </svg>
                <div className="ring-percentage-label">
                  <span className="percent-num">{completionRate}%</span>
                  <span className="percent-text">Done</span>
                </div>
              </div>
              <div className="gauge-description">
                <h4>Backlog Completion</h4>
                <p>You have conquered {completed} out of {totalGames} games in your collection.</p>
              </div>
            </div>

            <div className="status-bars-breakdown">
              <div className="bar-row">
                <div className="bar-labels">
                  <span>🎮 Playing</span>
                  <span>{playing}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill playing" style={{ width: `${totalGames ? (playing / totalGames) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div className="bar-row">
                <div className="bar-labels">
                  <span>📚 Backlog</span>
                  <span>{backlog}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill backlog" style={{ width: `${totalGames ? (backlog / totalGames) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div className="bar-row">
                <div className="bar-labels">
                  <span>🏆 Completed</span>
                  <span>{completed}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill completed" style={{ width: `${totalGames ? (completed / totalGames) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div className="bar-row">
                <div className="bar-labels">
                  <span>🌟 Want to Play</span>
                  <span>{wantToPlay}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill want-to-play" style={{ width: `${totalGames ? (wantToPlay / totalGames) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            <div className="other-mock-achievements">
              <h4>Gamer Milestones</h4>
              <div className="milestones-list">
                <div className="milestone-item glass-panel">
                  <span className="milestone-icon">🌟</span>
                  <div>
                    <h5>Perfect Sync</h5>
                    <p>Connect RAWG API key to import real data.</p>
                  </div>
                </div>
                <div className="milestone-item glass-panel">
                  <span className="milestone-icon">⚔️</span>
                  <div>
                    <h5>First Steps</h5>
                    <p>Track your first game in the library collection.</p>
                  </div>
                </div>
                <div className="milestone-item glass-panel">
                  <span className="milestone-icon">👑</span>
                  <div>
                    <h5>Completionist</h5>
                    <p>Mark 5 games as fully completed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
