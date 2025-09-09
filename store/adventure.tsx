import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { loadState, saveState } from '@/lib/storage';
import { AdventureState, initialAdventureState, DailyAdventure } from '@/types/adventure';

type AdventureContextValue = AdventureState & {
  addAdventure: (
    title: string,
    emoji: string,
    coords?: { latitude: number; longitude: number; accuracy?: number } | null,
    place?: string | null
  ) => DailyAdventure;
  removeAdventure: (id: string) => void;
};

const AdventureContext = createContext<AdventureContextValue | null>(null);

function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function AdventureProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdventureState>(initialAdventureState);
  const loadedRef = useRef(false);

  // Load on mount
  useEffect(() => {
    let active = true;
    (async () => {
      const fromDisk = await loadState<AdventureState>(initialAdventureState);
      if (active) {
        setState(fromDisk);
        loadedRef.current = true;
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Persist when state changes (after initial load)
  useEffect(() => {
    if (!loadedRef.current) return;
    void saveState(state);
  }, [state]);

  // Removed legacy Trip/Entry APIs

  const addAdventure = useCallback(
    (
      title: string,
      emoji: string,
      coords?: { latitude: number; longitude: number; accuracy?: number } | null,
      place?: string | null
    ): DailyAdventure => {
      const adv: DailyAdventure = {
        id: uid('d_'),
        title: title.trim() || 'Untitled',
        emoji,
        timestamp: Date.now(),
        coords: coords ?? null,
        place: place ?? null,
      };
      setState((s) => ({ ...s, dailyAdventures: [adv, ...s.dailyAdventures] }));
      return adv;
    },
    []
  );

  const removeAdventure = useCallback((id: string) => {
    setState((s) => ({ ...s, dailyAdventures: s.dailyAdventures.filter((a) => a.id !== id) }));
  }, []);

  const value = useMemo<AdventureContextValue>(() => ({
    ...state,
    addAdventure,
    removeAdventure,
  }), [state, addAdventure, removeAdventure]);

  return <AdventureContext.Provider value={value}>{children}</AdventureContext.Provider>;
}

export function useAdventure() {
  const ctx = useContext(AdventureContext);
  if (!ctx) throw new Error('useAdventure must be used within AdventureProvider');
  return ctx;
}
