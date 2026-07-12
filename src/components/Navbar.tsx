import React from 'react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  apiKey: string;
  onOpenKeyModal: () => void;
  currentTab: 'home' | 'discover' | 'library' | 'profile';
  onTabChange: (tab: 'home' | 'discover' | 'library' | 'profile') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  apiKey,
  onOpenKeyModal,
  currentTab,
  onTabChange,
}) => {
  const isLive = !!apiKey;

  return (
    <nav className="navbar glass-panel">
      <div className="nav-brand">
        <div className="logo-container" onClick={() => onTabChange('home')} style={{ cursor: 'pointer' }}>
          <svg className="logo-icon animate-pulse" viewBox="0 0 24 24" width="28" height="28">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
            />
          </svg>
          <span className="brand-text">TrackPlay</span>
        </div>
        <div className={`mode-badge ${isLive ? 'mode-live' : 'mode-mock'}`}>
          <span className="badge-dot"></span>
          {isLive ? 'Live API Mode' : 'Mock Mode (Demo)'}
        </div>
      </div>

      {/* Desktop Top Tabs */}
      <div className="nav-tabs-desktop">
        <button
          type="button"
          className={`nav-tab-btn ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => onTabChange('home')}
        >
          Home
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${currentTab === 'discover' ? 'active' : ''}`}
          onClick={() => onTabChange('discover')}
        >
          Discover
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${currentTab === 'library' ? 'active' : ''}`}
          onClick={() => onTabChange('library')}
        >
          Library
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${currentTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
        >
          Profile
        </button>
      </div>

      <div className="nav-search-wrapper-desktop">
        {currentTab === 'discover' && (
          <div className="nav-search-container animate-fade-in">
            <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button type="button" className="clear-search-btn" onClick={() => onSearchChange('')}>
                &times;
              </button>
            )}
          </div>
        )}
      </div>

      <div className="nav-actions">
        <button type="button" className="btn-key-config" onClick={onOpenKeyModal}>
          <svg viewBox="0 0 24 24" width="18" height="18" className="key-icon">
            <path
              fill="currentColor"
              d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
            />
          </svg>
          <span className="btn-key-text">{isLive ? 'API Settings' : 'Connect RAWG'}</span>
        </button>
      </div>
    </nav>
  );
};
