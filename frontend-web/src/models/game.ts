export interface Game {
    id: number;
    name: string;
    release_dates: { date: number }[];
    platforms: { id: number; name: string }[];
    genres?: { id: number; name: string }[];
    cover?: { url: string };
    summary?: string;
  }