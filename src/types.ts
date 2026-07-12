export interface Platform {
  id: number;
  name: string;
  slug: string;
  image_background?: string;
}

export interface PlatformInfo {
  platform: Platform;
  released_at?: string;
  requirements_en?: {
    minimum: string;
    recommended: string;
  } | null;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  image_background?: string;
}

export interface Screenshot {
  id: number;
  image: string;
}

export interface Game {
  id: number;
  slug: string;
  name: string;
  released: string;
  background_image: string;
  rating: number;
  rating_top: number;
  metacritic: number | null;
  platforms: PlatformInfo[];
  genres: Genre[];
  short_screenshots?: Screenshot[];
}

export interface GameDetails extends Game {
  description_raw?: string;
  description: string;
  developers: { id: number; name: string; slug: string }[];
  publishers: { id: number; name: string; slug: string }[];
  website?: string;
}

export interface RAWGResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type LibraryStatus = 'playing' | 'backlog' | 'completed' | 'want_to_play';

export interface LibraryItem {
  game: Game;
  status: LibraryStatus;
  addedAt: string;
}

export interface UserProfile {
  username: string;
  bio: string;
  avatarUrl: string;
}

