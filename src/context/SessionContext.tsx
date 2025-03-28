'use client'
// context/SessionContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

// Типизация сессии
interface SessionContextType {
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

// Создаем контекст с дефолтным значением
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Провайдер для сессии
export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };

    fetchSession();
  }, []);  // Эффект срабатывает один раз при монтировании компонента

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

// Хук для использования сессии
export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
