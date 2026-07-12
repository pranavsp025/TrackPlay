import React from 'react';

interface BottomNavigationProps {
  currentTab: 'home' | 'discover' | 'library' | 'profile';
  onTabChange: (tab: 'home' | 'discover' | 'library' | 'profile') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
}) => {
  return (
    <div className="bottom-nav glass-panel">
      <button
        type="button"
        className={`bottom-nav-btn ${currentTab === 'home' ? 'active' : ''}`}
        onClick={() => onTabChange('home')}
      >
        <svg viewBox="0 0 24 24" className="bottom-nav-icon">
          <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        <span className="bottom-nav-label">Home</span>
      </button>

      <button
        type="button"
        className={`bottom-nav-btn ${currentTab === 'discover' ? 'active' : ''}`}
        onClick={() => onTabChange('discover')}
      >
        <svg viewBox="0 0 24 24" className="bottom-nav-icon">
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
          />
        </svg>
        <span className="bottom-nav-label">Discover</span>
      </button>

      <button
        type="button"
        className={`bottom-nav-btn ${currentTab === 'library' ? 'active' : ''}`}
        onClick={() => onTabChange('library')}
      >
        <svg viewBox="0 0 24 24" className="bottom-nav-icon">
          <path
            fill="currentColor"
            d="M21.58 7.19A3.001 3.001 0 0 0 19 5H5a3 3 0 0 0-2.58 2.19C2.16 8.13 2 9.07 2 10v4c0 .93.16 1.87.42 2.81A3.001 3.001 0 0 0 5 19h14a3 3 0 0 0 2.58-2.19c.26-.94.42-1.88.42-2.81v-4c0-.93-.16-1.87-.42-2.81zM6 13H5v-2h1v2zm2-1v1H7v-1h1zm-1-2h1v1H7v-1zm1 4v1H7v-1h1zm9.5-3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2.5 2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
          />
        </svg>
        <span className="bottom-nav-label">Library</span>
      </button>

      <button
        type="button"
        className={`bottom-nav-btn ${currentTab === 'profile' ? 'active' : ''}`}
        onClick={() => onTabChange('profile')}
      >
        <svg viewBox="0 0 24 24" className="bottom-nav-icon">
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
          />
        </svg>
        <span className="bottom-nav-label">Profile</span>
      </button>
    </div>
  );
};
