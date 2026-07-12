import React, { useEffect, useState } from 'react';
import type { GameDetails, Screenshot, Game, LibraryItem, LibraryStatus } from '../types';
import { fetchGameDetails, fetchGameScreenshots } from '../services/api';

interface GameDetailModalProps {
  gameId: number;
  apiKey: string;
  onClose: () => void;
  library: LibraryItem[];
  onAddToLibrary: (game: Game, status: LibraryStatus) => void;
  onRemoveFromLibrary: (gameId: number) => void;
  onUpdateLibraryStatus: (gameId: number, status: LibraryStatus) => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  gameId,
  apiKey,
  onClose,
  library,
  onAddToLibrary,
  onRemoveFromLibrary,
  onUpdateLibraryStatus,
}) => {
  const [details, setDetails] = useState<GameDetails | null>(null);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        const [detailsRes, screenshotsRes] = await Promise.all([
          fetchGameDetails(gameId, apiKey),
          fetchGameScreenshots(gameId, apiKey),
        ]);

        if (isMounted) {
          setDetails(detailsRes);
          setScreenshots(screenshotsRes.results);
          if (screenshotsRes.results.length > 0) {
            setActiveScreenshot(screenshotsRes.results[0].image);
          } else if (detailsRes.background_image) {
            setActiveScreenshot(detailsRes.background_image);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError('Failed to load game details. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [gameId, apiKey]);

  if (isLoading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content glass-panel modal-loading-container" onClick={(e) => e.stopPropagation()}>
          <div className="spinner"></div>
          <p>Fetching game archives...</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Error</h2>
            <button type="button" className="close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p className="error-text">{error || 'Something went wrong.'}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getMetacriticColor = (score: number | null) => {
    if (!score) return 'meta-none';
    if (score >= 75) return 'meta-high';
    if (score >= 50) return 'meta-medium';
    return 'meta-low';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Hero Background Banner */}
        <div
          className="detail-hero"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(13, 14, 21, 0.4), rgba(13, 14, 21, 0.95)), url(${details.background_image})`,
          }}
        >
          <button type="button" className="close-btn detail-close-btn" onClick={onClose}>
            &times;
          </button>
          <div className="detail-hero-content">
            <div className="detail-genre-tags">
              {details.genres.map((g) => (
                <span key={g.id} className="genre-tag">
                  {g.name}
                </span>
              ))}
            </div>
            <h1 className="detail-title">{details.name}</h1>
            <div className="detail-quick-stats">
              {details.released && (
                <span className="stat-item">
                  Released: <strong>{new Date(details.released).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                </span>
              )}
              {details.metacritic && (
                <span className="stat-item">
                  Metascore:{' '}
                  <span className={`meta-badge ${getMetacriticColor(details.metacritic)}`}>
                    {details.metacritic}
                  </span>
                </span>
              )}
              {details.rating && (
                <span className="stat-item">
                  Rating: <strong>★ {details.rating.toFixed(1)}</strong> / {details.rating_top}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="modal-body detail-body">
          <div className="detail-layout">
            {/* Left side: Description & Screenshots */}
            <div className="detail-main">
              <section className="detail-section">
                <h2>About</h2>
                <div
                  className="game-description"
                  dangerouslySetInnerHTML={{
                    __html: details.description || '<p>No description provided.</p>',
                  }}
                />
              </section>

              {screenshots.length > 0 && (
                <section className="detail-section screenshot-section">
                  <h2>Screenshots</h2>
                  <div className="screenshot-gallery">
                    <div className="active-screenshot-container">
                      <img src={activeScreenshot || ''} alt="Game Screenshot" className="active-screenshot" />
                    </div>
                    <div className="screenshot-thumbnails">
                      {screenshots.map((s) => (
                        <div
                          key={s.id}
                          className={`screenshot-thumb-wrapper ${activeScreenshot === s.image ? 'active' : ''
                            }`}
                          onClick={() => setActiveScreenshot(s.image)}
                        >
                          <img src={s.image} alt="Game Thumbnail" className="screenshot-thumb" />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Right side: Detailed Metadata Meta-Card */}
            <div className="detail-sidebar">
              {/* Library Tracker Card */}
              <div className="meta-card glass-panel library-control-card animate-fade-in" style={{ marginBottom: '16px' }}>
                <h3>Library Tracker</h3>
                {library.some((i) => i.game.id === gameId) ? (
                  <div className="library-active-controls">
                    <div className="form-group" style={{ margin: '0 0 16px 0', width: '100%' }}>
                      <label htmlFor="modal-status-select" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>STATUS</label>
                      <select
                        id="modal-status-select"
                        value={library.find((i) => i.game.id === gameId)?.status || 'backlog'}
                        onChange={(e) => onUpdateLibraryStatus(gameId, e.target.value as LibraryStatus)}
                        className="sort-dropdown"
                        style={{ width: '100%', padding: '10px 14px', marginTop: '4px', background: 'rgba(10, 11, 16, 0.7)' }}
                      >
                        <option value="playing">Playing</option>
                        <option value="backlog">Backlog</option>
                        <option value="completed">Completed</option>
                        <option value="want_to_play">Want to Play</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      className="btn-secondary btn-danger"
                      onClick={() => onRemoveFromLibrary(gameId)}
                      style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                    >
                      Remove from Library
                    </button>
                  </div>
                ) : (
                  <div className="library-inactive-controls">
                    <p className="description-text" style={{ fontSize: '12px', margin: '0 0 12px 0' }}>Not in your collection.</p>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => details && onAddToLibrary(details, 'backlog')}
                      style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                    >
                      + Add to Library
                    </button>
                  </div>
                )}
              </div>

              <div className="meta-card glass-panel">
                <h3>Details</h3>

                <div className="meta-row">
                  <span className="meta-label">Platforms</span>
                  <span className="meta-value">
                    {details.platforms?.map((p) => p.platform.name).join(', ') || 'N/A'}
                  </span>
                </div>

                <div className="meta-row">
                  <span className="meta-label">Developers</span>
                  <span className="meta-value">
                    {details.developers?.map((d) => d.name).join(', ') || 'N/A'}
                  </span>
                </div>

                <div className="meta-row">
                  <span className="meta-label">Publishers</span>
                  <span className="meta-value">
                    {details.publishers?.map((p) => p.name).join(', ') || 'N/A'}
                  </span>
                </div>

                {details.website && (
                  <div className="meta-row website-row">
                    <span className="meta-label">Website</span>
                    <span className="meta-value">
                      <a href={details.website} target="_blank" rel="noreferrer" className="website-link">
                        {details.website.replace(/https?:\/\/(www\.)?/, '')}
                      </a>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer detail-footer">
          <span className="rawg-attribution">
            Data provided by <a href="https://rawg.io" target="_blank" rel="noreferrer">RAWG</a>
          </span>
          <button type="button" className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
