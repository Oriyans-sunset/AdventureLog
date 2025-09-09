export type AdventureState = {
  dailyAdventures: DailyAdventure[];
};

export const initialAdventureState: AdventureState = {
  dailyAdventures: [],
};

export type DailyAdventure = {
  id: string;
  title: string;
  emoji: string; // user-chosen emoji
  timestamp: number;
  coords?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null;
  place?: string | null;
};
