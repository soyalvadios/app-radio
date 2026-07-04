// src/context/CatalogContext.tsx
import { createContext, useContext, type ReactNode } from 'react';
import { useCatalog, type UseCatalogReturn } from '../hooks/useCatalog';

const CatalogContext = createContext<UseCatalogReturn | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const catalog = useCatalog();
  return (
    <CatalogContext.Provider value={catalog}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalogContext(): UseCatalogReturn {
  const ctx = useContext(CatalogContext);
  if (ctx == null) {
    throw new Error('useCatalogContext debe usarse dentro de <CatalogProvider>.');
  }
  return ctx;
}
