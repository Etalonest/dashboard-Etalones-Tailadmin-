// 'use client'
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useSession } from '@/src/context/SessionContext';
// import { Manager, PartnerStage } from '../types/manager';
// import { Partner } from '../types/partner';

// interface ManagerContextType {
//   manager: Manager | null;
//   setManager: (manager: Manager | null) => void;
//   candidates: any[];  
//   candidateFromInterview?: any[];
//   setCandidates: (candidates: any[]) => void;
//   partners: Partner[];
//   setPartners: (partners: any[]) => void;
//   partnersStage: PartnerStage[];  
//   setPartnersStage: (partnersStage: PartnerStage[]) => void
//   isLoading: boolean;  
//   error: string | null;  
// }

// const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

// export const ManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [manager, setManager] = useState<Manager | null>(null);
//   const [candidates, setCandidates] = useState<any[]>([]); 
//   const [candidateFromInterview, setCandidateFromInterview] = useState<any[]>([]);
//   const [partners, setPartners] = useState<Partner[]>([]); 
//   const [partnersStage, setPartnersStage] = useState<PartnerStage[]>([]); 
//   const [isLoading, setIsLoading] = useState<boolean>(false);  
//   const [error, setError] = useState<string | null>(null);  
//   const { session } = useSession();
// console.log("PartnerStage", partnersStage);
//   const managerId = session?.managerId;

//   useEffect(() => {
//     if (!managerId) return;

//     const fetchManager = async () => {
//       setIsLoading(true);
//       setError(null); // Сброс ошибки при новой попытке загрузки

//       try {
//         const response = await fetch(`/api/manager/${managerId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch manager');
//         }

//         const data = await response.json();
//         // console.log('MANAGER CONTEXT', data);
//         if (data.manager) {
//           setManager(data.manager); 
//           setCandidates(data.manager.candidates || []); 
//           setCandidateFromInterview(data.manager.candidateFromInterview || []);
//           setPartners(data.manager.partners);
//           if (Array.isArray(data.manager.partnersStage)) {
//             const validatedPartnersStage = data.manager.partnersStage.map((stage: { peopleOnObj: any[]; inWork: any[]; }) => {
//               if (stage.peopleOnObj && Array.isArray(stage.peopleOnObj)) {
//                 stage.peopleOnObj = stage.peopleOnObj.map(id => id.toString());
//               }
//               if (stage.inWork && Array.isArray(stage.inWork)) {
//                 stage.inWork = stage.inWork.map(id => id.toString());
//               }
//               return stage;
//             });
//             setPartnersStage(validatedPartnersStage);
//           } else {
//             setPartnersStage([]);  // Если данные неверны, ставим пустой массив
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching manager:', error);
//         setError(error instanceof Error ? error.message : 'Unknown error');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchManager();
//   }, [managerId]);

//   return (
//     <ManagerContext.Provider value={{ manager, setManager, candidates, candidateFromInterview, setCandidates, partners, setPartners, partnersStage, setPartnersStage, isLoading, error }}> 
//       {children}
//     </ManagerContext.Provider>
//   );
// };

// // Хук для получения контекста
// export const useManager = (): ManagerContextType => {
//   const context = useContext(ManagerContext);
//   if (!context) {
//     throw new Error('useManager must be used within a ManagerProvider');
//   }
//   return context;
// };
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from '@/src/context/SessionContext';
import { Manager, PartnersStage } from '../types/manager';
import { Partner } from '../types/partner';

interface ManagerContextType {
  manager: Manager | null;
  setManager: (manager: Manager | null) => void;
  candidates: any[];
  candidateFromInterview?: any[];
  setCandidates: (candidates: any[]) => void;
  partners: Partner[];
  setPartners: (partners: Partner[]) => void;
  partnersStage: PartnersStage[];
  setPartnersStage: (partnersStage: PartnersStage[]) => void;
  isLoading: boolean;
  error: string | null;
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

export const ManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manager, setManager] = useState<Manager | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [candidateFromInterview, setCandidateFromInterview] = useState<any[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnersStage, setPartnersStage] = useState<PartnersStage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSession();
  const managerId = session?.managerId;

  const STORAGE_KEY = `manager_data_${managerId}`;



  // 📦 Загрузка из localStorage
  useEffect(() => {
    if (!managerId) return;

    const cachedData = localStorage.getItem(STORAGE_KEY);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setManager(parsed.manager || null);
        setCandidates(parsed.candidates || []);
        setCandidateFromInterview(parsed.candidateFromInterview || []);
        setPartners(parsed.partners || []);
        setPartnersStage(parsed.partnersStage || []);
        
        console.log("📦 [SOURCE: localStorage] Данные загружены из localStorage:", parsed);
      } catch (e) {
        console.warn('⚠️ Ошибка при чтении кэша:', e);
      }
    }
    
  }, [managerId]);

  // 🔄 Загрузка с сервера
  useEffect(() => {
    if (!managerId) return;

    const fetchManager = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/manager/${managerId}`);
        if (!response.ok) throw new Error('Failed to fetch manager');

        const data = await response.json();

        if (data.manager) {
          const {
            manager,
            manager: {
              candidates = [],
              candidateFromInterview = [],
              partners = [],
              partnersStage = [],
            },
          } = data;
        
          if (!Array.isArray(partnersStage)) {
            throw new Error('partnersStage должен быть массивом');
          }
        
          setManager(manager);
          setCandidates(candidates);
          setCandidateFromInterview(candidateFromInterview);
          setPartners(partners);
          setPartnersStage(partnersStage);
        
          const cacheToStore = {
            manager,
            candidates,
            candidateFromInterview,
            partners,
            partnersStage,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheToStore));
        
          console.log("🌐 [SOURCE: server] Данные загружены с сервера и сохранены в localStorage:", cacheToStore);
        }
        
        
      } catch (error) {
        console.error('❌ Ошибка при загрузке manager:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchManager();
  }, [managerId]);



  useEffect(() => {
    if (!isLoading && partnersStage.length) {
      console.log("🧪 [Контекст] Значение partnersStage после загрузки:", partnersStage);
    }
  }, [partnersStage, isLoading]);

  return (
    <ManagerContext.Provider
      value={{
        manager,
        setManager,
        candidates,
        candidateFromInterview,
        setCandidates,
        partners,
        setPartners,
        partnersStage,
        setPartnersStage,
        isLoading,
        error,
      }}
    >
      {children}
    </ManagerContext.Provider>
  );
};

export const useManager = (): ManagerContextType => {
  const context = useContext(ManagerContext);
  if (!context) {
    throw new Error('useManager must be used within a ManagerProvider');
  }
  return context;
};
