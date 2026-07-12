import React, { useState } from 'react';
import { fetchGames } from '../services/api';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setValidationSuccess(false);

    const trimmedKey = inputKey.trim();

    if (!trimmedKey) {
      onSaveKey('');
      setValidationSuccess(true);
      setTimeout(() => {
        onClose();
        setValidationSuccess(false);
      }, 1000);
      return;
    }

    setIsValidating(true);
    try {
      // Validate by querying 1 game from the API
      await fetchGames({ key: trimmedKey, page: 1, page_size: 1 });
      onSaveKey(trimmedKey);
      setValidationSuccess(true);
      setTimeout(() => {
        onClose();
        setValidationSuccess(false);
      }, 1000);
    } catch (err: any) {
      setValidationError('Invalid API key. Please check your key and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = () => {
    setInputKey('');
    onSaveKey('');
    setValidationError(null);
    setValidationSuccess(true);
    setTimeout(() => {
      onClose();
      setValidationSuccess(false);
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Configure RAWG API Key</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            <p className="description-text">
              TrackPlay can browse live games by connecting to the <strong>RAWG Video Games Database</strong> API.
            </p>
            
            <div className="form-group">
              <label htmlFor="rawg-key">RAWG API Key</label>
              <input
                id="rawg-key"
                type="password"
                placeholder="Enter your RAWG API Key..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="text-input"
              />
              <span className="input-help">
                Your key will be saved locally in your browser's <code>localStorage</code>.
              </span>
            </div>

            {validationError && <div className="error-message">{validationError}</div>}
            {validationSuccess && (
              <div className="success-message">
                ✓ API key successfully updated! Switching mode...
              </div>
            )}

            <div className="key-guide">
              <h3>Don't have an API key?</h3>
              <p>
                Get one for free in just a few minutes:
              </p>
              <ol>
                <li>Visit the <a href="https://rawg.io/apidocs" target="_blank" rel="noreferrer">RAWG API Portal</a>.</li>
                <li>Sign up or log in to your account.</li>
                <li>Request an API key from your profile page.</li>
              </ol>
            </div>
          </div>

          <div className="modal-footer">
            {apiKey && (
              <button
                type="button"
                className="btn-secondary btn-danger"
                onClick={handleClear}
                disabled={isValidating}
              >
                Clear Key
              </button>
            )}
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isValidating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isValidating || validationSuccess}
            >
              {isValidating ? 'Validating...' : 'Save & Connect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
