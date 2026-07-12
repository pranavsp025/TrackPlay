import React from 'react';

interface FilterBarProps {
  selectedPlatforms: number[];
  onPlatformToggle: (id: number) => void;
  onPlatformSelect: (id: number | null) => void;
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
  onPlatformSelect,
  selectedGenre,
  onGenreSelect,
  orderBy,
  onOrderChange,
}) => {
  return (
    <div className="filter-bar glass-panel animate-fade-in">
      {/* DESKTOP VIEWPORTS: Platforms Badges */}
      <div className="filter-section desktop-only">
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

      {/* MOBILE VIEWPORTS: Platforms Dropdown */}
      <div className="filter-section mobile-only" style={{ width: '100%' }}>
        <label htmlFor="platform-select-mobile" className="section-label">
          Platform
        </label>
        <div className="select-container" style={{ width: '100%' }}>
          <select
            id="platform-select-mobile"
            value={selectedPlatforms.length === 1 ? selectedPlatforms[0] : ''}
            onChange={(e) => {
              const val = e.target.value;
              onPlatformSelect(val === '' ? null : Number(val));
            }}
            className="sort-dropdown"
            style={{ width: '100%' }}
          >
            <option value="">All Platforms</option>
            {PLATFORMS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.icon} {p.name}
              </option>
            ))}
          </select>
          <svg className="select-arrow" viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </div>

      <div className="filter-divider desktop-only"></div>

      {/* DESKTOP VIEWPORTS: Genre Tabs */}
      <div className="filter-section genre-section desktop-only">
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

      {/* MOBILE VIEWPORTS: Genre Dropdown */}
      <div className="filter-section genre-section mobile-only" style={{ width: '100%' }}>
        <label htmlFor="genre-select-mobile" className="section-label">
          Genre
        </label>
        <div className="select-container" style={{ width: '100%' }}>
          <select
            id="genre-select-mobile"
            value={selectedGenre}
            onChange={(e) => onGenreSelect(e.target.value)}
            className="sort-dropdown"
            style={{ width: '100%' }}
          >
            {GENRES.map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
          <svg className="select-arrow" viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </div>

      <div className="filter-divider"></div>

      {/* Sort Section (Shared for Desktop & Mobile) */}
      <div className="filter-section sort-section" style={{ width: '100%' }}>
        <label htmlFor="sort-select" className="section-label">
          Sort By
        </label>
        <div className="select-container" style={{ width: '100%' }}>
          <select
            id="sort-select"
            value={orderBy}
            onChange={(e) => onOrderChange(e.target.value)}
            className="sort-dropdown"
            style={{ width: '100%' }}
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
