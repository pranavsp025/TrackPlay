import { useState, useEffect, useCallback } from 'react';
import './App.css';
import type { Game, LibraryItem, LibraryStatus, UserProfile } from './types';
import { fetchGames } from './services/api';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { GameGrid } from './components/GameGrid';
import { ApiKeyModal } from './components/ApiKeyModal';
import { GameDetailModal } from './components/GameDetailModal';
import { HomeTab } from './components/HomeTab';
import { LibraryTab } from './components/LibraryTab';
import { ProfileTab } from './components/ProfileTab';
import { BottomNavigation } from './components/BottomNavigation';
import { QuickLibraryModal } from './components/QuickLibraryModal';

function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'home' | 'discover' | 'library' | 'profile'>('home');

  // Quick select state
  const [quickSelectGame, setQuickSelectGame] = useState<Game | null>(null);

  // API Key State
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('rawg_api_key') || '';
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [orderBy, setOrderBy] = useState('-added');

  // RAWG Games List State
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Modals & Details State
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  // Library State (persisted in localStorage)
  const [library, setLibrary] = useState<LibraryItem[]>(() => {
    const stored = localStorage.getItem('trackplay_library');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing library', e);
      }
    }
    return [];
  });

  // User Profile State (persisted in localStorage)
  const [profile, setProfile] = useState<UserProfile>(() => {
    const stored = localStorage.getItem('trackplay_profile');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing profile', e);
      }
    }
    return {
      username: 'Gamer Legend',
      bio: 'Backlog conqueror and speedrunner. Exploring worlds one game at a time.',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150', // Premium geometric avatar
    };
  });

  // API loading function
  const loadGames = useCallback(async (page: number, append = false) => {
    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const platformsParam = selectedPlatforms.length > 0 ? selectedPlatforms.join(',') : undefined;
      const genresParam = selectedGenre || undefined;
      const searchParam = searchQuery.trim() || undefined;

      const data = await fetchGames({
        key: apiKey,
        page,
        page_size: 12,
        search: searchParam,
        ordering: orderBy,
        platforms: platformsParam,
        genres: genresParam,
      });

      if (append) {
        setGames((prev) => [...prev, ...data.results]);
      } else {
        setGames(data.results);
      }
      setHasMore(!!data.next);
    } catch (error) {
      console.error('Error fetching games:', error);
      if (!append) {
        setGames([]);
      }
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [apiKey, selectedPlatforms, selectedGenre, searchQuery, orderBy]);

  // Handle Search Query, Filters & Order Changes (Debounced Search)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      loadGames(1, false);
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedPlatforms, selectedGenre, orderBy, apiKey, loadGames]);

  // Load More handler
  const handleLoadMore = () => {
    if (!isLoading && !isLoadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadGames(nextPage, true);
    }
  };

  // Toggle platform filter
  const handlePlatformToggle = (id: number) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  // Save new API Key
  const handleSaveKey = (key: string) => {
    if (key) {
      localStorage.setItem('rawg_api_key', key);
    } else {
      localStorage.removeItem('rawg_api_key');
    }
    setApiKey(key);
  };

  // Library Mutators
  const handleAddToLibrary = (game: Game, status: LibraryStatus) => {
    setLibrary((prev) => {
      const existingIdx = prev.findIndex((item) => item.game.id === game.id);
      let updated: LibraryItem[];
      if (existingIdx > -1) {
        updated = prev.map((item, idx) =>
          idx === existingIdx
            ? { ...item, status, addedAt: new Date().toISOString() }
            : item
        );
      } else {
        updated = [
          ...prev,
          { game, status, addedAt: new Date().toISOString() },
        ];
      }
      localStorage.setItem('trackplay_library', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveFromLibrary = (gameId: number) => {
    setLibrary((prev) => {
      const updated = prev.filter((item) => item.game.id !== gameId);
      localStorage.setItem('trackplay_library', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateLibraryStatus = (gameId: number, status: LibraryStatus) => {
    setLibrary((prev) => {
      const updated = prev.map((item) =>
        item.game.id === gameId ? { ...item, status } : item
      );
      localStorage.setItem('trackplay_library', JSON.stringify(updated));
      return updated;
    });
  };

  // Save user profile details
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('trackplay_profile', JSON.stringify(updatedProfile));
  };

  // Render current tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeTab
            onExplore={() => setCurrentTab('discover')}
            library={library}
            games={games}
            onGameClick={setSelectedGameId}
            onQuickAdd={setQuickSelectGame}
          />
        );
      case 'discover':
        return (
          <main className="main-content">
            <div className="mobile-search-wrapper">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input inline-search"
              />
            </div>
            <FilterBar
              selectedPlatforms={selectedPlatforms}
              onPlatformToggle={handlePlatformToggle}
              selectedGenre={selectedGenre}
              onGenreSelect={setSelectedGenre}
              orderBy={orderBy}
              onOrderChange={setOrderBy}
            />

            <GameGrid
              games={games}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              onGameClick={setSelectedGameId}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              library={library}
              onQuickAdd={setQuickSelectGame}
            />
          </main>
        );
      case 'library':
        return (
          <LibraryTab
            library={library}
            onGameClick={setSelectedGameId}
            onRemove={handleRemoveFromLibrary}
            onUpdateStatus={handleUpdateLibraryStatus}
            onQuickAdd={setQuickSelectGame}
          />
        );
      case 'profile':
        return (
          <ProfileTab
            profile={profile}
            onSaveProfile={handleSaveProfile}
            library={library}
            apiKey={apiKey}
            onSaveKey={handleSaveKey}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        apiKey={apiKey}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

      <div className="app-container">
        {renderTabContent()}
      </div>

      <footer className="footer-panel glass-panel">
        <span className="rawg-attribution">
          Data and artwork provided by <a href="https://rawg.io" target="_blank" rel="noreferrer">RAWG</a>
        </span>
        <span className="footer-info">
          TrackPlay &copy; {new Date().getFullYear()} &bull; Built with React, Vite &amp; TypeScript
        </span>
      </footer>

      {/* Configuration Modals */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveKey}
      />

      {selectedGameId !== null && (
        <GameDetailModal
          gameId={selectedGameId}
          apiKey={apiKey}
          onClose={() => setSelectedGameId(null)}
          library={library}
          onAddToLibrary={handleAddToLibrary}
          onRemoveFromLibrary={handleRemoveFromLibrary}
          onUpdateLibraryStatus={handleUpdateLibraryStatus}
        />
      )}

      {quickSelectGame && (
        <QuickLibraryModal
          game={quickSelectGame}
          onClose={() => setQuickSelectGame(null)}
          library={library}
          onAddToLibrary={handleAddToLibrary}
          onRemoveFromLibrary={handleRemoveFromLibrary}
        />
      )}

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </>
  );
}

export default App;

