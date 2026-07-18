import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from './api';
import type { Page, SiteSettings } from './types';

interface SiteData {
  pages: Page[];
  settings: SiteSettings;
  loaded: boolean;
  refresh: () => void;
}

const SiteContext = createContext<SiteData>({ pages: [], settings: {}, loaded: false, refresh: () => {} });

export function SiteProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<Page[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loaded, setLoaded] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    Promise.all([api.get<Page[]>('/api/pages'), api.get<SiteSettings>('/api/settings/site')])
      .then(([p, s]) => {
        setPages(p);
        setSettings(s);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [tick]);

  return (
    <SiteContext.Provider value={{ pages, settings, loaded, refresh: () => setTick((t) => t + 1) }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
