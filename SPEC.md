# TrackPlay: RAWG Game Listing Specification

This document details the functional, non-functional, and technical specifications for the TrackPlay game discovery page.

## 1. Functional Requirements

### 1.1 Live vs. Mock Mode
- **Mock Mode**: Active by default when no API key is stored. Displays at least 8 AAA games with static metadata and high-res cover art.
- **Live Mode**: Activated when a valid RAWG API key is configured. Fetches real-time data from RAWG API.
- **Toggle/Input**: An API key manager is available in the navigation bar to allow users to add, update, or remove their API key.

### 1.2 Browsing & Searching
- **Search Bar**: Debounced text search (e.g., 300ms) that filters games. In Live Mode, this triggers API requests with the `search` parameter; in Mock Mode, it filters the static list in-memory.
- **Sorting**: Dropdown with the following options:
  - Popularity (Live: `-added` / Mock: count)
  - Rating (Live: `-rating` / Mock: rating)
  - Release Date (Live: `-released` / Mock: release date)
  - Name (Live: `name` / Mock: alphabetical)
- **Filtering**:
  - **Platform**: Multi-select or single-select filter. Target platforms: PC, PlayStation, Xbox, Nintendo Switch, Mobile (iOS/Android).
  - **Genre**: Quick-select tabs or tags. Target genres: Action, Indie, Adventure, RPG, Shooter, Strategy.

### 1.3 Game Cards
Each card in the grid must present:
- High-res cover image.
- Game Title.
- Platform icons (using SVGs matching active platforms).
- Metacritic Score Badge (colored green for 75+, yellow for 50-74, red for <50).
- Release Date (formatted as `MMM DD, YYYY`).

### 1.4 Details Modal
Clicking a game card opens a detailed popup containing:
- High-resolution hero header.
- Metacritic score & user rating.
- Full text description of the game.
- Publisher, developer, and genre tags.
- Screenshot gallery (if screenshots are available).
- System requirements (if available) or platform availability listing.

---

## 2. Technical Specifications

### 2.1 API Endpoint Integration
- Base URL: `https://api.rawg.io/api`
- Key Endpoint: `/games`
  - Parameters:
    - `key`: string (required API key)
    - `page`: number
    - `page_size`: number (default: 20)
    - `search`: string (query)
    - `ordering`: string (sort field)
    - `platforms`: string (comma-separated platform IDs)
    - `genres`: string (comma-separated genre slugs)
- Detailed Endpoint: `/games/{id}`
  - Fetches complete details (description, publisher, developer).
- Screenshot Endpoint: `/games/{id}/screenshots`
  - Fetches screenshots.

### 2.2 Component Hierarchy
```
App
├── Navbar
│   └── ApiKeyModal
├── FilterBar
└── GameGrid
    ├── GameCard
    ├── GameCardSkeleton
    └── GameDetailModal
```

### 2.3 State Management
- `apiKey`: string (persisted in `localStorage` as `rawg_api_key`)
- `searchQuery`: string
- `selectedPlatforms`: number[] (platform IDs)
- `selectedGenre`: string (genre slug)
- `orderBy`: string (sorting option)
- `currentPage`: number
- `selectedGameId`: number | null (opens detailed modal)

---

## 3. UI/UX & Design Guidelines

- **Theme**: Sleek, immersive dark theme.
  - Background: Deep Dark Blue/Violet (`#0d0e15`, `#121320`)
  - Card/Modal Backgrounds: Glassmorphic transparency with border overlays (`rgba(255, 255, 255, 0.05)`, backdrop blur).
  - Accents: Vibrant neon violet/cyan (`#8b5cf6`, `#06b6d4`).
- **Typography**: Inter / Outfit fonts or default modern sans-serif. Highly readable line heights and weights.
- **Transitions**: Smooth 0.2s transitions on hover, modal fades, and filtering state updates.

---

## 4. Acceptance Criteria & Checklist
- [x] Application compiles without TypeScript errors.
- [ ] Application runs correctly on Vite development server.
- [ ] In **Mock Mode**, games list and filtering work instantly.
- [ ] In **Live Mode**, entering a valid key initiates successful fetch requests from RAWG API.
- [ ] Platform icons display correctly for each game.
- [ ] Details modal loads full game details (including description) successfully.
- [ ] Responsive design works smoothly on mobile screens (stacked layout, bottom navigation bar) and desktops.
- [ ] Game cards resemble the modern God of War card layout (large bold title, primary genre marker, overlapping achievements, and completion percent).
- [ ] Plus button on cards opens a modal for selecting backlog, playing, complete, want to play, or removing status.

---

## 5. Navigation & Tabs System

### 5.1 Tabs Configuration
- **Home Tab**:
  - Acts as a landing dashboard.
  - Displays a welcoming premium Hero banner.
  - Shows a "Playing Now" widget highlighting games in the user's library with the `Playing` status.
  - Displays a "Trending Games" or "Popular Picks" grid (selected from fetched or mock games).
  - Shows a "Library Stats Tracker" summarizing the counts of games across different library states.
- **Discover Tab**:
  - The main game list directory.
  - Incorporates the full RAWG search bar, platform filter badges, genre tab buttons, and sorting dropdown.
  - Features infinite scroll / "Load More" pagination.
- **Library Tab**:
  - Displays games saved by the user, persisted via `localStorage` as `trackplay_library`.
  - Filterable by library states: `All`, `Playing`, `Backlog`, `Completed`, `Want to Play`.
  - Game cards in this view should indicate their status badge.
  - Users can change a game's library state or remove it directly from the game card context menu/overlay, or within the detail modal.
- **Profile Tab**:
  - Renders a personal tracker card (avatar, customizable username, custom tagline/bio).
  - Visual breakdown of the gaming library (total games, percent completed).
  - Dynamic user settings to edit username, bio, and choose avatar images.
  - Embeds the RAWG API key config for a central settings experience.

### 5.2 Mobile & Desktop Compatibility (Responsive Design)
- **Desktop Layout**:
  - Navigation links appear at the top in the standard glassmorphic navbar.
  - Search bar is embedded in the top navbar (conditionally displayed or automatically redirects search queries to the Discover page).
  - Main contents use maximum limits (`width: 1200px; max-width: 95%`).
- **Mobile Layout** (Viewport width <= 768px):
  - Bottom navigation bar: Fixed to viewport bottom with high-fidelity glassmorphism, featuring tactile icons (Home, Discover, Library, Profile).
  - Top header is streamlined, displaying only the brand logo and the RAWG mode badge.
  - Search bar in Discover is rendered inline at the top of the tab content to preserve spacing.
  - **Filter Dropdowns**: Platforms and genres are rendered as select dropdown lists instead of buttons/tabs to prevent horizontal scroll or overflow.
  - Cards in the grid scale down to 1 or 2 columns, and modals span full-width with scrollable contents.
  - Padding bottom of 80px on main container to prevent bottom nav bar overlays.

---

## 6. Premium Game Card Design & Quick Library Selector

### 6.1 Card Design Redesign (God of War Style)
- **Layout & Structure**:
  - The card is a glassmorphic panel with high rounded corners (`border-radius: 20px`).
  - **Rounded Cover Image**: Rendered at the top with curved corners (`border-radius: 16px`), separated from the card's boundaries by a clean padding margin.
  - **Floating Plus Button**: Located in the top-right overlay of the cover image. Styled as a premium glassmorphic circle with a plus icon `+` (rotates 45deg on hover).
  - **Game Title**: Rendered in uppercase, extra-bold sans-serif font (`font-size: 16px`), with letter spacing matching a modern gaming console dashboard.
  - **Publisher / Genre Tag**: Styled as "♦ Primary Genre" (e.g. `♦ Action / RPG`) or fallback, rendered below the title in a muted accent color.
  - **Achievements Tracker**:
    - Includes 3 overlapping colored circular achievement badges (gold, purple, cyan) representing game milestone stamps.
    - Accompanied by text like `[X]/[Y] Achievements` (e.g., `24/64 Achievements`).
  - **Completion Badge**: Shown on the bottom-right corner as a pill status like `🏳️‍🌈 [Percentage]%` (e.g., `🏁 64%`) representing backlog progress.
  - The ratings badge (Metacritic score) is rendered in the top-left overlay of the cover image.

### 6.2 Quick Library Selector Modal
- Clicking the floating plus button `+` on the card opens a centered dialog overlay (Quick Selector Modal).
- Prevents propagation of the click so the main details popup is not opened.
- Renders 4 tactile gaming status options:
  - 🎮 Currently Playing
  - 📚 Backlog Vault
  - 🏆 Completed
  - 🌟 Want to Play
  - ❌ Remove from Library (shown if the game is already in their library)
- Instantly updates local storage and page state, then closes.
- Includes a smooth micro-animation zoom on fade-in.

