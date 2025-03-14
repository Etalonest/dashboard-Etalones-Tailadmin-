import React, { createContext, useContext, useState, useEffect } from 'react';
import { Partner } from '@/src/types/partner';
import { useSession } from '@/src/context/SessionContext';

interface PartnerContextType {
  partners: Partner[];
  loadPartners: (managerId: string) => void;
  isLoading: boolean;
  error: string | null;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export const PartnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSession();
  const managerId = session?.managerId;

  const loadPartners = async (managerId: string) => {
    setIsLoading(true);
    setError(null);

    try {
    

      {
        const response = await fetch(`/api/partner-by-manager/${managerId}`);
        const data = await response.json();

        if (response.ok) {
          setPartners(data.partners);
        } else {
          setError(data.message || 'Не удалось загрузить партнёров');
        }
      }
    } catch (err) {
      setError('Ошибка при загрузке партнёров');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (managerId && partners.length === 0) {
      loadPartners(managerId);
    }
  }, [partners, managerId]);

  return (
    <PartnerContext.Provider value={{ partners, loadPartners, isLoading, error }}>
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartners = (): PartnerContextType => {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error('usePartners must be used within a PartnerProvider');
  }
  return context;
};
