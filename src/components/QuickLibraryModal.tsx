import React from 'react';
import type { Game, LibraryItem, LibraryStatus } from '../types';

interface QuickLibraryModalProps {
  game: Game;
  onClose: () => void;
  library: LibraryItem[];
  onAddToLibrary: (game: Game, status: LibraryStatus) => void;
  onRemoveFromLibrary: (gameId: number) => void;
}

export const QuickLibraryModal: React.FC<QuickLibraryModalProps> = ({
  game,
  onClose,
  library,
  onAddToLibrary,
  onRemoveFromLibrary,
}) => {
  const libraryItem = library.find((item) => item.game.id === game.id);
  const isInLibrary = !!libraryItem;
  const currentStatus = libraryItem?.status;

  const handleStatusSelect = (status: LibraryStatus) => {
    onAddToLibrary(game, status);
    onClose();
  };

  const handleRemove = () => {
    onRemoveFromLibrary(game.id);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel quick-modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '400px', border: '1px solid rgba(255, 255, 255, 0.15)' }}
      >
        <div className="modal-header" style={{ padding: '16px 20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Track Game
          </h2>
          <button type="button" className="close-btn" onClick={onClose} style={{ fontSize: '24px' }}>
            &times;
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px', textAlign: 'center' }}>
          <div className="quick-modal-game-info" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', textAlign: 'left' }}>
            <img
              src={game.background_image}
              alt={game.name}
              style={{ width: '50px', height: '65px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-light)' }}
            />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 4px', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                {game.name}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                {game.released ? new Date(game.released).getFullYear() : 'TBA'} &bull; ★ {game.rating?.toFixed(1) || 'N/A'}
              </p>
            </div>
          </div>

          <div className="quick-status-options" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              className={`btn-secondary status-option-btn ${currentStatus === 'playing' ? 'active-playing' : ''}`}
              onClick={() => handleStatusSelect('playing')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', borderRadius: '10px', textAlign: 'left', fontWeight: '600' }}
            >
              <span style={{ fontSize: '18px' }}>🎮</span>
              <span>Currently Playing</span>
            </button>

            <button
              type="button"
              className={`btn-secondary status-option-btn ${currentStatus === 'backlog' ? 'active-backlog' : ''}`}
              onClick={() => handleStatusSelect('backlog')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', borderRadius: '10px', textAlign: 'left', fontWeight: '600' }}
            >
              <span style={{ fontSize: '18px' }}>📚</span>
              <span>Backlog Vault</span>
            </button>

            <button
              type="button"
              className={`btn-secondary status-option-btn ${currentStatus === 'completed' ? 'active-completed' : ''}`}
              onClick={() => handleStatusSelect('completed')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', borderRadius: '10px', textAlign: 'left', fontWeight: '600' }}
            >
              <span style={{ fontSize: '18px' }}>🏆</span>
              <span>Completed</span>
            </button>

            <button
              type="button"
              className={`btn-secondary status-option-btn ${currentStatus === 'want_to_play' ? 'active-wish' : ''}`}
              onClick={() => handleStatusSelect('want_to_play')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', borderRadius: '10px', textAlign: 'left', fontWeight: '600' }}
            >
              <span style={{ fontSize: '18px' }}>🌟</span>
              <span>Want to Play</span>
            </button>
          </div>
        </div>

        {isInLibrary && (
          <div className="modal-footer" style={{ padding: '12px 20px', background: 'rgba(239, 68, 68, 0.05)', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn-lib-remove"
              onClick={handleRemove}
              style={{ width: '100%', padding: '8px', color: '#f87171', fontWeight: '700', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}
            >
              Remove from Library
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
