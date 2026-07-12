import React from 'react';
import type { Game, LibraryItem } from '../types';
import { GameCard } from './GameCard';

interface HomeTabProps {
  onExplore: () => void;
  library: LibraryItem[];
  games: Game[];
  onGameClick: (id: number) => void;
  onQuickAdd?: (game: Game) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onExplore,
  library,
  games,
  onGameClick,
  onQuickAdd,
}) => {
  // Filter library items by playing status
  const playingGames = library.filter((item) => item.status === 'playing');

  // Compute counts
  const playingCount = playingGames.length;
  const backlogCount = library.filter((item) => item.status === 'backlog').length;
  const completedCount = library.filter((item) => item.status === 'completed').length;
  const wantToPlayCount = library.filter((item) => item.status === 'want_to_play').length;
  const totalCount = library.length;

  // Use loaded games or fallback to top library additions
  const trendingGames = games.length > 0 ? games.slice(0, 4) : library.slice(0, 4).map((item) => item.game);

  return (
    <div className="home-tab animate-fade-in">
      {/* Premium Hero Welcome Banner */}
      <section className="home-hero glass-panel">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <span className="hero-badge">Welcome to TrackPlay</span>
          <h1 className="hero-title">Track Your Playtime. Conquer Your Backlog.</h1>
          <p className="hero-subtitle">
            The ultimate companion to catalogue your collections, log your progress, and explore millions of game archives.
          </p>
          <button type="button" className="btn-primary hero-cta" onClick={onExplore}>
            <span>Discover Games</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </button>
        </div>
      </section>

      {/* Stats Summary Panel */}
      <section className="dashboard-stats-grid">
        <div className="stat-card glass-panel playing">
          <div className="stat-card-header">
            <span className="stat-icon">🎮</span>
            <span className="stat-label">Currently Playing</span>
          </div>
          <span className="stat-number">{playingCount}</span>
          <div className="stat-progress-bg">
            <div className="stat-progress-fill" style={{ width: `${totalCount ? (playingCount / totalCount) * 100 : 0}%` }}></div>
          </div>
        </div>

        <div className="stat-card glass-panel backlog">
          <div className="stat-card-header">
            <span className="stat-icon">📚</span>
            <span className="stat-label">Backlog Vault</span>
          </div>
          <span className="stat-number">{backlogCount}</span>
          <div className="stat-progress-bg">
            <div className="stat-progress-fill" style={{ width: `${totalCount ? (backlogCount / totalCount) * 100 : 0}%` }}></div>
          </div>
        </div>

        <div className="stat-card glass-panel completed">
          <div className="stat-card-header">
            <span className="stat-icon">🏆</span>
            <span className="stat-label">Completed Games</span>
          </div>
          <span className="stat-number">{completedCount}</span>
          <div className="stat-progress-bg">
            <div className="stat-progress-fill" style={{ width: `${totalCount ? (completedCount / totalCount) * 100 : 0}%` }}></div>
          </div>
        </div>

        <div className="stat-card glass-panel wish">
          <div className="stat-card-header">
            <span className="stat-icon">🌟</span>
            <span className="stat-label">Want to Play</span>
          </div>
          <span className="stat-number">{wantToPlayCount}</span>
          <div className="stat-progress-bg">
            <div className="stat-progress-fill" style={{ width: `${totalCount ? (wantToPlayCount / totalCount) * 100 : 0}%` }}></div>
          </div>
        </div>
      </section>

      {/* Now Playing Shelf */}
      <section className="home-section">
        <div className="section-header-row">
          <h2 className="section-heading">Now Playing</h2>
          {playingCount > 0 && <span className="section-sublink" onClick={onExplore}>View All</span>}
        </div>

        {playingCount > 0 ? (
          <div className="horizontal-games-shelf">
            {playingGames.map(({ game }) => (
              <div key={game.id} className="shelf-card glass-panel" onClick={() => onGameClick(game.id)}>
                <img src={game.background_image} alt={game.name} className="shelf-card-img" />
                <div className="shelf-card-overlay">
                  <h3 className="shelf-card-title">{game.name}</h3>
                  <span className="shelf-card-playicon">▶</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-dashboard-state glass-panel">
            <div className="empty-icon">🎮</div>
            <h3>Your backlog is waiting!</h3>
            <p>No games marked as "Playing" right now. Explore the archives to pick your next play.</p>
            <button type="button" className="btn-secondary btn-sm" onClick={onExplore}>
              Find Games
            </button>
          </div>
        )}
      </section>

      {/* Popular/Trending Picks */}
      {trendingGames.length > 0 && (
        <section className="home-section">
          <h2 className="section-heading">Popular Right Now</h2>
          <div className="games-grid">
            {trendingGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onClick={() => onGameClick(game.id)}
                library={library}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
