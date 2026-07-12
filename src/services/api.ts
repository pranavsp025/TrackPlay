import type { Game, GameDetails, Screenshot, RAWGResponse } from '../types';

const BASE_URL = 'https://api.rawg.io/api';

// High-fidelity Mock Data for Offline/Mock Mode
const MOCK_GAMES: Game[] = [
  {
    id: 1,
    slug: 'elden-ring',
    name: 'Elden Ring',
    released: '2022-02-25',
    background_image: 'https://media.rawg.io/media/games/511/511a4aff107f302e1a285d83058b6b08.jpg',
    rating: 4.7,
    rating_top: 5,
    metacritic: 96,
    platforms: [
      { platform: { id: 4, name: 'PC', slug: 'pc' } },
      { platform: { id: 187, name: 'PlayStation 5', slug: 'playstation5' } },
      { platform: { id: 186, name: 'Xbox Series S/X', slug: 'xbox-series-x' } },
      { platform: { id: 18, name: 'PlayStation 4', slug: 'playstation4' } },
      { platform: { id: 1, name: 'Xbox One', slug: 'xbox-one' } }
    ],
    genres: [
      { id: 4, name: 'Action', slug: 'action' },
      { id: 5, name: 'RPG', slug: 'role-playing-games-rpg' }
    ],
    short_screenshots: [
      { id: 1, image: 'https://media.rawg.io/media/screenshots/000/00021c3272e2cf17c72f1cfbb52163b4.jpg' },
      { id: 2, image: 'https://media.rawg.io/media/screenshots/111/111f111f111f111f111f111f111f111f.jpg' }
    ]
  },
  {
    id: 2,
    slug: 'cyberpunk-2077',
    name: 'Cyberpunk 2077',
    released: '2020-12-10',
    background_image: 'https://media.rawg.io/media/games/26d/26d4437715072cb43d28bb1a49028476.jpg',
    rating: 4.3,
    rating_top: 5,
    metacritic: 86,
    platforms: [
      { platform: { id: 4, name: 'PC', slug: 'pc' } },
      { platform: { id: 187, name: 'PlayStation 5', slug: 'playstation5' } },
      { platform: { id: 186, name: 'Xbox Series S/X', slug: 'xbox-series-x' } },
      { platform: { id: 18, name: 'PlayStation 4', slug: 'playstation4' } },
      { platform: { id: 1, name: 'Xbox One', slug: 'xbox-one' } }
    ],
    genres: [
      { id: 4, name: 'Action', slug: 'action' },
      { id: 5, name: 'RPG', slug: 'role-playing-games-rpg' },
      { id: 3, name: 'Adventure', slug: 'adventure' }
    ]
  },
  {
    id: 3,
    slug: 'baldurs-gate-3',
    name: "Baldur's Gate 3",
    released: '2023-08-03',
    background_image: 'https://media.rawg.io/media/games/07b/07b5eba835ee61ce4bc01c0cfcc8d150.jpg',
    rating: 4.8,
    rating_top: 5,
    metacritic: 96,
    platforms: [
      { platform: { id: 4, name: 'PC', slug: 'pc' } },
      { platform: { id: 187, name: 'PlayStation 5', slug: 'playstation5' } },
      { platform: { id: 186, name: 'Xbox Series S/X', slug: 'xbox-series-x' } },
      { platform: { id: 5, name: 'macOS', slug: 'macos' } }
    ],
    genres: [
      { id: 5, name: 'RPG', slug: 'role-playing-games-rpg' },
      { id: 2, name: 'Strategy', slug: 'strategy' }
    ]
  },
  {
    id: 4,
    slug: 'the-witcher-3-wild-hunt',
    name: 'The Witcher 3: Wild Hunt',
    released: '2015-05-18',
    background_image: 'https://media.rawg.io/media/games/618/618c2031a07bbff99450def8824b540a.jpg',
    rating: 4.67,
    rating_top: 5,
    metacritic: 92,
    platforms: [
      { platform: { id: 4, name: 'PC', slug: 'pc' } },
      { platform: { id: 18, name: 'PlayStation 4', slug: 'playstation4' } },
      { platform: { id: 1, name: 'Xbox One', slug: 'xbox-one' } },
      { platform: { id: 7, name: 'Nintendo Switch', slug: 'nintendo-switch' } },
      { platform: { id: 187, name: 'PlayStation 5', slug: 'playstation5' } },
      { platform: { id: 186, name: 'Xbox Series S/X', slug: 'xbox-series-x' } }
    ],
    genres: [
      { id: 4, name: 'Action', slug: 'action' },
      { id: 5, name: 'RPG', slug: 'role-playing-games-rpg' },
      { id: 3, name: 'Adventure', slug: 'adventure' }
    ]
  },
  {
    id: 5,
    slug: 'the-legend-of-zelda-tears-of-the-kingdom',
    name: 'The Legend of Zelda: Tears of the Kingdom',
    released: '2023-05-12',
    background_image: 'https://media.rawg.io/media/games/8e8/8e8f8ab692f4400e9bc667a4e69d95f8.jpg',
    rating: 4.85,
    rating_top: 5,
    metacritic: 96,
    platforms: [
      { platform: { id: 7, name: 'Nintendo Switch', slug: 'nintendo-switch' } }
    ],
    genres: [
      { id: 3, name: 'Adventure', slug: 'adventure' },
      { id: 4, name: 'Action', slug: 'action' }
    ]
  },
  {
    id: 6,
    slug: 'grand-theft-auto-v',
    name: 'Grand Theft Auto V',
    released: '2013-09-17',
    background_image: 'https://media.rawg.io/media/games/456/456fc5a117b656cef25df547dd77a2db.jpg',
    rating: 4.47,
    rating_top: 5,
    metacritic: 97,
    platforms: [
      { platform: { id: 4, name: 'PC', slug: 'pc' } },
      { platform: { id: 187, name: 'PlayStation 5', slug: 'playstation5' } },
      { platform: { id: 186, name: 'Xbox Series S/X', slug: 'xbox-series-x' } },
      { platform: { id: 18, name: 'PlayStation 4', slug: 'playstation4' } },
      { platform: { id: 1, name: 'Xbox One', slug: 'xbox-one' } },
      { platform: { id: 16, name: 'PlayStation 3', slug: 'playstation3' } },
      { platform: { id: 14, name: 'Xbox 360', slug: 'xbox360' } }
    ],
    genres: [
      { id: 4, name: 'Action', slug: 'action' },
      { id: 3, name: 'Adventure', slug: 'adventure' }
    ]
  },
  {
    id: 7,
    slug: 'red-dead-redemption-2',
    name: 'Red Dead Redemption 2',
    released: '2018-10-26',
    background_image: 'https://media.rawg.io/media/games/e6d/e6de6f61150eb4b96df7c1b142171a2e.jpg',
    rating: 4.59,
    rating_top: 5,
    metacritic: 97,
    platforms: [
      { platform: { id: 4, name: 'PC', slug: 'pc' } },
      { platform: { id: 18, name: 'PlayStation 4', slug: 'playstation4' } },
      { platform: { id: 1, name: 'Xbox One', slug: 'xbox-one' } }
    ],
    genres: [
      { id: 4, name: 'Action', slug: 'action' },
      { id: 3, name: 'Adventure', slug: 'adventure' }
    ]
  },
  {
    id: 8,
    slug: 'hades',
    name: 'Hades',
    released: '2020-09-17',
    background_image: 'https://media.rawg.io/media/games/1f4/1f47a213e0123fe3f5879a61358ca59c.jpg',
    rating: 4.51,
    rating_top: 5,
    metacritic: 93,
    platforms: [
      { platform: { id: 4, name: 'PC', slug: 'pc' } },
      { platform: { id: 7, name: 'Nintendo Switch', slug: 'nintendo-switch' } },
      { platform: { id: 187, name: 'PlayStation 5', slug: 'playstation5' } },
      { platform: { id: 186, name: 'Xbox Series S/X', slug: 'xbox-series-x' } },
      { platform: { id: 18, name: 'PlayStation 4', slug: 'playstation4' } },
      { platform: { id: 1, name: 'Xbox One', slug: 'xbox-one' } }
    ],
    genres: [
      { id: 4, name: 'Action', slug: 'action' },
      { id: 5, name: 'RPG', slug: 'role-playing-games-rpg' },
      { id: 1, name: 'Indie', slug: 'indie' }
    ]
  }
];

const MOCK_GAME_DETAILS: Record<number, GameDetails> = {
  1: {
    ...MOCK_GAMES[0],
    description: '<p><b>Elden Ring</b> is a massive action RPG developed by FromSoftware and published by Bandai Namco. Set in the Lands Between, players assume the role of a Tarnished, guided by grace to brandish the power of the Elden Ring and become an Elden Lord. The game features an extensive open world created in collaboration with fantasy novelist George R.R. Martin.</p>',
    developers: [{ id: 1, name: 'FromSoftware', slug: 'fromsoftware' }],
    publishers: [{ id: 1, name: 'Bandai Namco Entertainment', slug: 'bandai-namco' }],
    website: 'https://www.bandainamcoent.com/games/elden-ring'
  },
  2: {
    ...MOCK_GAMES[1],
    description: '<p><b>Cyberpunk 2077</b> is an open-world, action-adventure RPG set in Night City, a megalopolis obsessed with power, glamour and body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality. You can customize your character\'s cyberware, skillset and playstyle, and explore a vast city where the choices you make shape the story and the world around you.</p>',
    developers: [{ id: 2, name: 'CD PROJEKT RED', slug: 'cd-projekt-red' }],
    publishers: [{ id: 2, name: 'CD PROJEKT', slug: 'cd-projekt' }],
    website: 'https://www.cyberpunk.net'
  },
  3: {
    ...MOCK_GAMES[2],
    description: '<p><b>Baldur\'s Gate 3</b> is a story-rich, party-based RPG set in the universe of Dungeons & Dragons, where your choices shape a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power. Mysterious abilities are awakening within you, drawn from a mind flayer parasite planted in your brain. Resist, and turn darkness against itself. Or embrace corruption, and become ultimate evil.</p>',
    developers: [{ id: 3, name: 'Larian Studios', slug: 'larian-studios' }],
    publishers: [{ id: 3, name: 'Larian Studios', slug: 'larian-studios' }],
    website: 'https://baldursgate3.game'
  },
  4: {
    ...MOCK_GAMES[3],
    description: '<p><b>The Witcher 3: Wild Hunt</b> is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full of meaningful choices and impactful consequences. In The Witcher, you play as the professional monster hunter, Geralt of Rivia, tasked with finding a child of prophecy in a vast world rich with merchant cities, viking pirate islands, dangerous mountain passes, and forgotten caverns to explore.</p>',
    developers: [{ id: 4, name: 'CD PROJEKT RED', slug: 'cd-projekt-red' }],
    publishers: [{ id: 2, name: 'CD PROJEKT', slug: 'cd-projekt' }],
    website: 'https://thewitcher.com/en/witcher3'
  },
  5: {
    ...MOCK_GAMES[4],
    description: '<p><b>The Legend of Zelda: Tears of the Kingdom</b> is an epic adventure across the land and skies of Hyrule. In this sequel to The Legend of Zelda: Breath of the Wild, you\'ll decide your own path through the sprawling landscapes of Hyrule and the mysterious islands floating in the vast skies above. Can you harness the power of Link\'s new abilities to fight back against the malevolent forces that threaten the kingdom?</p>',
    developers: [{ id: 5, name: 'Nintendo EPD', slug: 'nintendo' }],
    publishers: [{ id: 5, name: 'Nintendo', slug: 'nintendo-publisher' }],
    website: 'https://www.zelda.com/tears-of-the-kingdom'
  },
  6: {
    ...MOCK_GAMES[5],
    description: '<p><b>Grand Theft Auto V</b> for PC offers players the option to explore the award-winning world of Los Santos and Blaine County in resolutions of up to 4k and beyond, as well as the chance to experience the game running at 60 frames per second. When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the underworld, they must pull off a series of dangerous heists to survive.</p>',
    developers: [{ id: 6, name: 'Rockstar North', slug: 'rockstar-north' }],
    publishers: [{ id: 6, name: 'Rockstar Games', slug: 'rockstar-games' }],
    website: 'https://www.rockstargames.com/gta-v'
  },
  7: {
    ...MOCK_GAMES[6],
    description: '<p><b>Red Dead Redemption 2</b> is an epic tale of life in America\'s unforgiving heartland. The game\'s vast and atmospheric world will also provide the foundation for a brand new online multiplayer experience. America, 1899. The end of the wild west era has begun as lawmen hunt down the last remaining outlaw gangs. Those who will not surrender or succumb are killed. Arthur Morgan and the Van der Linde gang are forced to flee.</p>',
    developers: [{ id: 7, name: 'Rockstar Studios', slug: 'rockstar-studios' }],
    publishers: [{ id: 6, name: 'Rockstar Games', slug: 'rockstar-games' }],
    website: 'https://www.rockstargames.com/reddeadredemption2'
  },
  8: {
    ...MOCK_GAMES[7],
    description: '<p><b>Hades</b> is a god-like rogue-like dungeon crawler that combines the best aspects of Supergiant\'s critically acclaimed titles, including the fast-paced action of Bastion, the rich atmosphere and depth of Transistor, and the character-driven storytelling of Pyre. As the immortal Prince of the Underworld, you\'ll wield the powers and mythic weapons of Olympus to break free from the clutches of the god of the dead himself.</p>',
    developers: [{ id: 8, name: 'Supergiant Games', slug: 'supergiant-games' }],
    publishers: [{ id: 8, name: 'Supergiant Games', slug: 'supergiant-games' }],
    website: 'https://www.supergiantgames.com/games/hades'
  }
};

const MOCK_SCREENSHOTS: Record<number, Screenshot[]> = {
  1: [
    { id: 1, image: 'https://media.rawg.io/media/screenshots/000/00021c3272e2cf17c72f1cfbb52163b4.jpg' },
    { id: 2, image: 'https://media.rawg.io/media/screenshots/771/7710a30282b0122e2bb9a90408544d67.jpg' },
    { id: 3, image: 'https://media.rawg.io/media/screenshots/0ef/0ef81e9cb14c44957e84457e4e112d7c.jpg' }
  ],
  2: [
    { id: 1, image: 'https://media.rawg.io/media/screenshots/a0c/a0c7eb142b6a22fdfc140409a826bcbc.jpg' },
    { id: 2, image: 'https://media.rawg.io/media/screenshots/5a0/5a069df8b19e99abccde2434e7bb0e20.jpg' },
    { id: 3, image: 'https://media.rawg.io/media/screenshots/625/625f61765c92c3a51f9640989f66df2e.jpg' }
  ],
  3: [
    { id: 1, image: 'https://media.rawg.io/media/screenshots/d43/d433bf9c6efcde5df389a3f272a2cfbf.jpg' },
    { id: 2, image: 'https://media.rawg.io/media/screenshots/b95/b95d033e54b6932e6a17bfa4cdabcecf.jpg' },
    { id: 3, image: 'https://media.rawg.io/media/screenshots/6f8/6f8099684346eef83151dfccfce1b2bb.jpg' }
  ],
  4: [
    { id: 1, image: 'https://media.rawg.io/media/screenshots/3e4/3e4881ad3e0c03790176840d58855e4e.jpg' },
    { id: 2, image: 'https://media.rawg.io/media/screenshots/b5a/b5a5b51a0212fb9c4a52ff60b616a2ef.jpg' },
    { id: 3, image: 'https://media.rawg.io/media/screenshots/e51/e5187e171fb24bc10ad9508bc5b47afc.jpg' }
  ],
  5: [
    { id: 1, image: 'https://media.rawg.io/media/screenshots/000/00021c3272e2cf17c72f1cfbb52163b4.jpg' } // Link placeholder
  ],
  6: [
    { id: 1, image: 'https://media.rawg.io/media/screenshots/5c3/5c327b7f14cd3ee28cc8a7bbdf1c045b.jpg' },
    { id: 2, image: 'https://media.rawg.io/media/screenshots/078/078ab26efcfccde5c1bdf7fcc4c5ef30.jpg' }
  ],
  7: [
    { id: 1, image: 'https://media.rawg.io/media/screenshots/e4e/e4e0825cbf062c3e5a5ea6c4d7ecfef0.jpg' },
    { id: 2, image: 'https://media.rawg.io/media/screenshots/771/7710a30282b0122e2bb9a90408544d67.jpg' }
  ],
  8: [
    { id: 1, image: 'https://media.rawg.io/media/screenshots/f17/f17a94ef92bb21e7d028fe00b217ffeb.jpg' },
    { id: 2, image: 'https://media.rawg.io/media/screenshots/5f7/5f7faef22ffc32ef8a18df7877e8acfb.jpg' }
  ]
};

// Helper sleep function to simulate latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchGames(params: {
  key?: string;
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  platforms?: string; // Comma separated IDs
  genres?: string; // Comma separated slugs
}): Promise<RAWGResponse<Game>> {
  const { key, page = 1, page_size = 12, search, ordering, platforms, genres } = params;

  // Mock Mode
  if (!key) {
    await delay(600); // Simulate network speed
    let filtered = [...MOCK_GAMES];

    // Filter by search query
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((g) => g.name.toLowerCase().includes(q));
    }

    // Filter by platform (RAWG uses platform IDs: PC=4, PlayStation=18/187, Xbox=1/186, Switch=7)
    if (platforms) {
      const platformIds = platforms.split(',').map(Number);
      filtered = filtered.filter((game) =>
        game.platforms.some((pInfo) => {
          // Match main groups: PC=4, PlayStation=18, Xbox=1, Switch=7
          const pid = pInfo.platform.id;
          if (platformIds.includes(pid)) return true;
          // Subgroup mapping
          if (platformIds.includes(18) && [18, 187, 16].includes(pid)) return true; // PlayStation group
          if (platformIds.includes(1) && [1, 186, 14].includes(pid)) return true;  // Xbox group
          return false;
        })
      );
    }

    // Filter by genre slugs
    if (genres) {
      const genreSlugs = genres.split(',');
      filtered = filtered.filter((game) =>
        game.genres.some((genre) => genreSlugs.includes(genre.slug))
      );
    }

    // Sorting
    if (ordering) {
      const isDesc = ordering.startsWith('-');
      const field = isDesc ? ordering.substring(1) : ordering;

      filtered.sort((a, b) => {
        let valA: any = a.name;
        let valB: any = b.name;

        if (field === 'rating') {
          valA = a.rating;
          valB = b.rating;
        } else if (field === 'released') {
          valA = new Date(a.released).getTime();
          valB = new Date(b.released).getTime();
        } else if (field === 'added' || field === 'metacritic') {
          valA = a.metacritic || 0;
          valB = b.metacritic || 0;
        }

        if (valA < valB) return isDesc ? 1 : -1;
        if (valA > valB) return isDesc ? -1 : 1;
        return 0;
      });
    }

    // Pagination
    const startIndex = (page - 1) * page_size;
    const paginatedItems = filtered.slice(startIndex, startIndex + page_size);

    return {
      count: filtered.length,
      next: filtered.length > startIndex + page_size ? `mock-page-${page + 1}` : null,
      previous: page > 1 ? `mock-page-${page - 1}` : null,
      results: paginatedItems
    };
  }

  // Live Mode (RAWG API)
  const urlParams = new URLSearchParams({
    key,
    page: String(page),
    page_size: String(page_size)
  });

  if (search) urlParams.append('search', search);
  if (ordering) urlParams.append('ordering', ordering);
  if (platforms) urlParams.append('platforms', platforms);
  if (genres) urlParams.append('genres', genres);

  const res = await fetch(`${BASE_URL}/games?${urlParams.toString()}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchGameDetails(id: number, key?: string): Promise<GameDetails> {
  // Mock Mode
  if (!key) {
    await delay(300);
    const mock = MOCK_GAME_DETAILS[id];
    if (mock) return mock;
    
    // In case user clicks on a search result that somehow bypasses mock definitions
    return {
      id,
      slug: 'unknown-game',
      name: 'Unknown Adventure',
      released: 'TBA',
      background_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600',
      rating: 4.0,
      rating_top: 5,
      metacritic: null,
      platforms: [],
      genres: [],
      description: '<p>No details available for this mock title.</p>',
      developers: [],
      publishers: []
    };
  }

  // Live Mode
  const res = await fetch(`${BASE_URL}/games/${id}?key=${key}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchGameScreenshots(id: number, key?: string): Promise<RAWGResponse<Screenshot>> {
  // Mock Mode
  if (!key) {
    await delay(300);
    return {
      count: MOCK_SCREENSHOTS[id]?.length || 0,
      next: null,
      previous: null,
      results: MOCK_SCREENSHOTS[id] || []
    };
  }

  // Live Mode
  const res = await fetch(`${BASE_URL}/games/${id}/screenshots?key=${key}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  return res.json();
}
