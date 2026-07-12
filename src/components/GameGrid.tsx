import React from 'react';
import type { Game, LibraryItem } from '../types';
import { GameCard } from './GameCard';

interface GameGridProps {
  games: Game[];
  isLoading: boolean;
  isLoadingMore: boolean;
  onGameClick: (id: number) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  library?: LibraryItem[];
  onQuickAdd?: (game: Game) => void;
}

// Skeleton Loader Component
const GameCardSkeleton: React.FC = () => {
  return (
    <div className="game-card skeleton-card">
      <div className="skeleton-image animate-pulse"></div>
      <div className="card-info">
        <div className="card-header-row">
          <div className="skeleton-platforms animate-pulse"></div>
          <div className="skeleton-badge animate-pulse"></div>
        </div>
        <div className="skeleton-title animate-pulse"></div>
        <div className="card-meta">
          <div className="skeleton-text animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export const GameGrid: React.FC<GameGridProps> = ({
  games,
  isLoading,
  isLoadingMore,
  onGameClick,
  onLoadMore,
  hasMore,
  library,
  onQuickAdd,
}) => {
  if (isLoading && games.length === 0) {
    return (
      <div className="grid-container">
        <div className="games-grid">
          {Array.from({ length: 8 }).map((_, idx) => (
            <GameCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="empty-state glass-panel animate-fade-in">
        <svg viewBox="0 0 24 24" width="64" height="64" className="empty-icon">
          <path
            fill="currentColor"
            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
          />
        </svg>
        <h3>No games discovered</h3>
        <p>We couldn't find any games matching your current search parameters. Try altering your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid-container">
      <div className="games-grid">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onClick={() => onGameClick(game.id)}
            library={library}
            onQuickAdd={onQuickAdd}
          />
        ))}
        {isLoadingMore &&
          Array.from({ length: 4 }).map((_, idx) => (
            <GameCardSkeleton key={`more-${idx}`} />
          ))}
      </div>

      {hasMore && !isLoadingMore && (
        <div className="pagination-container">
          <button type="button" className="btn-load-more" onClick={onLoadMore}>
            Load More Games
          </button>
        </div>
      )}
    </div>
  );
};

