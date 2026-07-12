import React from 'react';

interface FilterBarProps {
  selectedPlatforms: number[];
  onPlatformToggle: (id: number) => void;
  selectedGenre: string;
  onGenreSelect: (slug: string) => void;
  orderBy: string;
  onOrderChange: (order: string) => void;
}

const PLATFORMS = [
  { id: 4, name: 'PC', icon: '💻' },
  { id: 18, name: 'PlayStation', icon: '🎮' },
  { id: 1, name: 'Xbox', icon: '🎮' },
  { id: 7, name: 'Nintendo Switch', icon: '🕹️' },
  { id: 3, name: 'Mobile', icon: '📱' },
];

const GENRES = [
  { slug: '', name: 'All Genres' },
  { slug: 'action', name: 'Action' },
  { slug: 'role-playing-games-rpg', name: 'RPG' },
  { slug: 'adventure', name: 'Adventure' },
  { slug: 'shooter', name: 'Shooter' },
  { slug: 'strategy', name: 'Strategy' },
  { slug: 'indie', name: 'Indie' },
];

const SORT_OPTIONS = [
  { value: '-added', label: 'Popularity' },
  { value: '-rating', label: 'Rating' },
  { value: '-released', label: 'Release Date' },
  { value: 'name', label: 'Name (A-Z)' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedPlatforms,
  onPlatformToggle,
  selectedGenre,
  onGenreSelect,
  orderBy,
  onOrderChange,
}) => {
  return (
    <div className="filter-bar glass-panel animate-fade-in">
      <div className="filter-section">
        <span className="section-label">Platforms</span>
        <div className="filter-buttons">
          {PLATFORMS.map((p) => {
            const isActive = selectedPlatforms.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                className={`filter-badge ${isActive ? 'active' : ''}`}
                onClick={() => onPlatformToggle(p.id)}
              >
                <span className="badge-icon">{p.icon}</span>
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-divider"></div>

      <div className="filter-section genre-section">
        <span className="section-label">Genres</span>
        <div className="genre-tabs">
          {GENRES.map((g) => {
            const isActive = selectedGenre === g.slug;
            return (
              <button
                key={g.slug}
                type="button"
                className={`genre-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => onGenreSelect(g.slug)}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-divider"></div>

      <div className="filter-section sort-section">
        <label htmlFor="sort-select" className="section-label">
          Sort By
        </label>
        <div className="select-container">
          <select
            id="sort-select"
            value={orderBy}
            onChange={(e) => onOrderChange(e.target.value)}
            className="sort-dropdown"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg className="select-arrow" viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
