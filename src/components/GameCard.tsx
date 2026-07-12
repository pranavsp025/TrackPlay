import React from 'react';
import type { Game, LibraryItem } from '../types';

interface GameCardProps {
  game: Game;
  onClick: () => void;
  library?: LibraryItem[];
  onQuickAdd?: (game: Game) => void;
}

// Inline SVGs for Platform Icons
const PlatformIcon: React.FC<{ slug: string }> = ({ slug }) => {
  const normSlug = slug.toLowerCase();
  
  if (normSlug.includes('pc') || normSlug.includes('windows')) {
    return (
      <svg className="platform-svg-icon" viewBox="0 0 24 24" aria-label="PC" role="img">
        <title>PC</title>
        <path fill="currentColor" d="M3 5.44L10.5 4.5v7.26H3v-6.32zm0 13.12l7.5.94v-7.26H3v6.32zM11.5 4.38L21 3v8.76h-9.5V4.38zm0 15.24l9.5-1.38v-7.48h-9.5v8.86z" />
      </svg>
    );
  }
  if (normSlug.includes('playstation') || normSlug.includes('ps')) {
    return (
      <svg className="platform-svg-icon" viewBox="0 0 24 24" aria-label="PlayStation" role="img">
        <title>PlayStation</title>
        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 4.5c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5v1.5h1.5c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5H13v1.5c0 .28-.22.5-.5.5h-1c-.28 0-.5-.22-.5-.5V10H9.5c-.28 0-.5-.22-.5-.5v-1c0-.28.22-.5.5-.5H11V6.5zm4 11h-6v-2h6v2zm-3-3l-2-2h4l-2 2z" />
      </svg>
    );
  }
  if (normSlug.includes('xbox')) {
    return (
      <svg className="platform-svg-icon" viewBox="0 0 24 24" aria-label="Xbox" role="img">
        <title>Xbox</title>
        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.56 12.38c-.37.38-.86.58-1.35.58-.45 0-.91-.17-1.26-.5L12 13.52l-.95.94c-.35.33-.81.5-1.26.5-.49 0-.98-.2-1.35-.58a1.905 1.905 0 0 1 0-2.69l.95-.94-.95-.94a1.905 1.905 0 0 1 0-2.69c.74-.75 1.95-.75 2.69 0l.95.94.95-.94c.74-.75 1.95-.75 2.69 0a1.905 1.905 0 0 1 0 2.69l-.95.94.95.94c.74.75.74 1.95 0 2.69z" />
      </svg>
    );
  }
  if (normSlug.includes('nintendo') || normSlug.includes('switch')) {
    return (
      <svg className="platform-svg-icon" viewBox="0 0 24 24" aria-label="Nintendo Switch" role="img">
        <title>Nintendo Switch</title>
        <path fill="currentColor" d="M6.86 3.1c-.81 0-1.6.3-2.21.9A3.16 3.16 0 0 0 3.7 6.2v11.6c0 .8.31 1.6.9 2.2a3.16 3.16 0 0 0 2.26.96h.66V3.1H6.86zm.66 4.38a1.31 1.31 0 0 1-1.31 1.31 1.31 1.31 0 1 1 1.31-1.31M16.48 3.1c-.8 0-1.6.31-2.2.9a3.16 3.16 0 0 0-.96 2.2v11.6c0 .81.3 1.6.9 2.21.6.6 1.4.95 2.26.95h.66V3.1h-.66zM15.42 16.5c0-.72.59-1.31 1.31-1.31s1.31.59 1.31 1.31a1.31 1.31 0 1 1-2.31 0" />
      </svg>
    );
  }
  if (normSlug.includes('ios') || normSlug.includes('android') || normSlug.includes('mobile')) {
    return (
      <svg className="platform-svg-icon" viewBox="0 0 24 24" aria-label="Mobile" role="img">
        <title>Mobile</title>
        <path fill="currentColor" d="M17 19H7V5h10v14zm-5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm4-18H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    );
  }
  return null;
};

export const GameCard: React.FC<GameCardProps> = ({ game, onClick, library, onQuickAdd }) => {
  const getMetacriticColor = (score: number | null) => {
    if (!score) return 'meta-none';
    if (score >= 75) return 'meta-high';
    if (score >= 50) return 'meta-medium';
    return 'meta-low';
  };

  // Find library status
  const libraryItem = library?.find((item) => item.game.id === game.id);
  const libraryStatus = libraryItem?.status;

  // Generate deterministic achievements count based on ID
  const getAchievementsCount = (id: number) => {
    const total = 40 + (id % 5) * 8; // e.g. 40, 48, 56, 64, 72
    const completed = Math.round(total * (0.35 + (id % 7) * 0.08)); // e.g. 35% to 83% completed
    return { completed, total };
  };

  const { completed: achCompleted, total: achTotal } = getAchievementsCount(game.id);
  const completionPercent = Math.round((achCompleted / achTotal) * 100);

  // Group platforms to unique categories: PC, PlayStation, Xbox, Switch, Mobile
  const getUniquePlatforms = () => {
    const slugs = new Set<string>();
    const uniqueList: string[] = [];

    game.platforms?.forEach(({ platform }) => {
      const slug = platform.slug.toLowerCase();
      let category = '';

      if (slug.includes('pc') || slug.includes('windows')) category = 'pc';
      else if (slug.includes('playstation') || slug.includes('ps')) category = 'playstation';
      else if (slug.includes('xbox')) category = 'xbox';
      else if (slug.includes('switch') || slug.includes('nintendo')) category = 'nintendo';
      else if (slug.includes('android') || slug.includes('ios') || slug.includes('iphone')) category = 'mobile';

      if (category && !slugs.has(category)) {
        slugs.add(category);
        uniqueList.push(category);
      }
    });

    return uniqueList;
  };

  // Primary genre name formatter
  const primaryGenre = game.genres && game.genres.length > 0 ? game.genres[0].name : 'Action';

  return (
    <div className="game-card glass-panel" onClick={onClick}>
      <div className="card-image-wrapper">
        {game.background_image ? (
          <img
            src={game.background_image}
            alt={game.name}
            className="card-image"
            loading="lazy"
          />
        ) : (
          <div className="card-image-fallback">
            <span>No Image Available</span>
          </div>
        )}
        
        {/* Metascore Overlay */}
        {game.metacritic !== null && (
          <div className={`card-metascore-overlay ${getMetacriticColor(game.metacritic)}`}>
            {game.metacritic}
          </div>
        )}

        {/* Floating Quick Tracker Plus Button */}
        {onQuickAdd && (
          <button
            type="button"
            className={`btn-quick-add ${libraryStatus ? `active-${libraryStatus}` : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(game);
            }}
            title={libraryStatus ? `Status: ${libraryStatus.toUpperCase()}` : 'Quick Add to Library'}
          >
            {libraryStatus ? '✓' : '+'}
          </button>
        )}

        <div className="card-overlay">
          <span className="btn-details">View Details</span>
        </div>
      </div>

      <div className="card-info">
        {/* Game Title - God of War Ragnarok Style */}
        <h3 className="card-title uppercase-title" title={game.name}>
          {game.name}
        </h3>

        {/* Publisher / Genre Label */}
        <div className="card-publisher">
          <span className="accent-bullet">♦</span> {primaryGenre}
        </div>

        {/* Achievements Visual Tracker */}
        <div className="card-achievements-row">
          <div className="achievement-badges">
            <span className="badge-circle gold" title="Completed Milestones">🏆</span>
            <span className="badge-circle purple" title="Epic Trophies">👑</span>
            <span className="badge-circle cyan" title="Side Quests">⭐</span>
          </div>
          <div className="achievement-text">
            <span className="ach-count">{achCompleted}/{achTotal}</span>
            <span className="ach-label">Achievements</span>
          </div>
        </div>

        {/* Footer Row: Platforms & Backlog Progress Percent */}
        <div className="card-footer-row">
          <div className="card-platforms">
            {getUniquePlatforms().map((slug) => (
              <PlatformIcon key={slug} slug={slug} />
            ))}
          </div>
          <div className="card-completion-pill" title="Backlog Progress Percentage">
            <span>🏁</span>
            <span>{completionPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

