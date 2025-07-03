import { createContext, useContext, useState, type ReactNode } from 'react';

interface NavigationContextType {
  currentPage: string;
  navigate: (page: string) => void;
  goBack: () => void;
  history: string[];
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

interface NavigationProviderProps {
  children: ReactNode;
  initialPage?: string;
}

export function NavigationProvider({ children, initialPage = 'dashboard' }: NavigationProviderProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [history, setHistory] = useState<string[]>([initialPage]);

  const navigate = (page: string) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      setHistory(prev => [...prev, page]);
    }
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousPage = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentPage(previousPage);
    }
  };

  return (
    <NavigationContext.Provider value={{ currentPage, navigate, goBack, history }}>
      {children}
    </NavigationContext.Provider>
  );
}
