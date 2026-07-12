import React, { useState } from 'react';
import type { Game, LibraryItem, LibraryStatus } from '../types';
import { GameCard } from './GameCard';

interface LibraryTabProps {
  library: LibraryItem[];
  onGameClick: (id: number) => void;
  onRemove: (id: number) => void;
  onUpdateStatus: (id: number, status: LibraryStatus) => void;
  onQuickAdd?: (game: Game) => void;
}

const STATUS_FILTER_OPTIONS: { value: 'all' | LibraryStatus; label: string; icon: string }[] = [
  { value: 'all', label: 'All Games', icon: '📦' },
  { value: 'playing', label: 'Playing', icon: '🎮' },
  { value: 'backlog', label: 'Backlog', icon: '📚' },
  { value: 'completed', label: 'Completed', icon: '🏆' },
  { value: 'want_to_play', label: 'Want to Play', icon: '🌟' },
];

export const LibraryTab: React.FC<LibraryTabProps> = ({
  library,
  onGameClick,
  onRemove,
  onUpdateStatus,
  onQuickAdd,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | LibraryStatus>('all');

  // Filter items based on active tab
  const filteredLibrary = activeFilter === 'all'
    ? library
    : library.filter((item) => item.status === activeFilter);

  // Compute sub-counts
  const getCount = (status: 'all' | LibraryStatus) => {
    if (status === 'all') return library.length;
    return library.filter((item) => item.status === status).length;
  };

  const getStatusLabel = (status: LibraryStatus) => {
    switch (status) {
      case 'playing': return 'Playing';
      case 'backlog': return 'Backlog';
      case 'completed': return 'Completed';
      case 'want_to_play': return 'Want to Play';
      default: return '';
    }
  };

  return (
    <div className="library-tab animate-fade-in">
      <div className="library-header-row">
        <h1 className="tab-title">My Library</h1>
        <span className="library-subtitle">{library.length} Games Total</span>
      </div>

      {/* Library Sub-status filter bar */}
      <div className="library-filter-bar glass-panel">
        <div className="library-filters">
          {STATUS_FILTER_OPTIONS.map((opt) => {
            const isActive = activeFilter === opt.value;
            const count = getCount(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                className={`lib-filter-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveFilter(opt.value)}
              >
                <span className="lib-filter-icon">{opt.icon}</span>
                <span className="lib-filter-label">{opt.label}</span>
                <span className="lib-filter-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Library Items Grid */}
      {filteredLibrary.length > 0 ? (
        <div className="games-grid">
          {filteredLibrary.map((item) => (
            <div key={item.game.id} className="library-card-wrapper">
              <GameCard
                game={item.game}
                onClick={() => onGameClick(item.game.id)}
                library={library} // pass library to render status badges
                onQuickAdd={onQuickAdd}
              />
              {/* Quick Actions overlay bar */}
              <div className="library-card-actions glass-panel">
                <div className="lib-status-dropdown-container">
                  <select
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item.game.id, e.target.value as LibraryStatus)}
                    className="lib-status-dropdown"
                  >
                    <option value="playing">Playing</option>
                    <option value="backlog">Backlog</option>
                    <option value="completed">Completed</option>
                    <option value="want_to_play">Want to Play</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="btn-lib-remove"
                  onClick={() => onRemove(item.game.id)}
                  title="Remove from Library"
                >
                  &times; Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-library-state glass-panel">
          <div className="empty-icon">📂</div>
          <h3>Nothing found here!</h3>
          <p>
            {activeFilter === 'all'
              ? "You haven't added any games to your library yet. Search for games in the Discover tab to start your collection!"
              : `You don't have any games marked as "${getStatusLabel(activeFilter)}" right now.`}
          </p>
        </div>
      )}
    </div>
  );
};
