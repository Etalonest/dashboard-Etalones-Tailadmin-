'use client'
import React, { createContext, useContext, useState, ReactNode } from "react";

// Типы для поиска
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

interface SearchProviderProps {
  children: ReactNode;  // Указываем тип для children
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};
