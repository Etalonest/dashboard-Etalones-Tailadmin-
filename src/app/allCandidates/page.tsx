// // 'use client'
// // import { ScrollArea } from "@/components/ui/scroll-area";
// // import DefaultLayout from "@/src/components/Layouts/DefaultLayout"
// // import { useCandidates } from '@/src/context/CandidatesContext';

// // export default function Page() {
// //       const { candidates, isLoading, error } = useCandidates();
    
// //   return (
// //     <DefaultLayout>
// //         <ScrollArea className="h-screen">
// //         {candidates.length > 0 && <h1>Все кандидаты{candidates.length}</h1>}
// //       {isLoading && <p>Загрузка...</p>}
// //       {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
// //       {!isLoading && !error && candidates.length === 0 && <p>Нет кандидатов</p>}
// //       <ul>
// //         {candidates.map((candidate, index) => (
// //             <li key={candidate.id}>{index +1}{candidate.name}</li>
// //         ))}
// //       </ul>
// //         </ScrollArea >
// //     </DefaultLayout>
// //   );
// // }

// 'use client'
// import { ScrollArea } from "@/components/ui/scroll-area";
// import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
// import { useCandidates } from '@/src/context/CandidatesContext';
// import { useState, useEffect } from 'react';
// import { saveToIndexedDB } from "@/src/local/db";
// import { getFromIndexedDB } from "@/src/local/getFromIndexedDB";

// export default function Page() {
//   const { candidates, isLoading, error } = useCandidates();
  
//   // Состояние для прогресса загрузки
//   const [progress, setProgress] = useState(0);
//   const [localCandidates, setLocalCandidates] = useState<any[]>([]);

//   useEffect(() => {
//     const managerId = 'someManagerId'; // Замените на свой идентификатор менеджера или используйте динамически
//     const fetchCandidates = async () => {
//       const savedCandidates = await getFromIndexedDB(managerId); // Получаем кандидатов из IndexedDB

//       if (savedCandidates.length > 0) {
//         setLocalCandidates(savedCandidates); // Если кандидаты есть, загружаем их из IndexedDB
//       } else {
//         // Если кандидатов нет в IndexedDB, загружаем их через API
//         if (isLoading) return;

//         // Предположим, что у вас есть API для загрузки кандидатов, их нужно сохранить в IndexedDB
//         const fetchedCandidates = await fetchCandidatesFromAPI(); // Здесь должен быть ваш запрос
//         setLocalCandidates(fetchedCandidates); // Устанавливаем кандидатов в состояние

//         // Сохраняем полученных кандидатов в IndexedDB
//         saveToIndexedDB(managerId, fetchedCandidates);
//       }
//     };

//     fetchCandidates(); // Вызываем функцию загрузки
//   }, [isLoading, candidates]);

//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     if (isLoading) {
//       interval = setInterval(() => {
//         setProgress((prev) => {
//           if (prev >= 100) {
//             clearInterval(interval);
//             return 100;
//           }
//           return prev + 10;
//         });
//       }, 500);
//     }

//     return () => clearInterval(interval);
//   }, [isLoading]);

//   return (
//     <DefaultLayout>
//       <ScrollArea className="h-screen">
//         {candidates.length > 0 && <h1>Все кандидаты {candidates.length}</h1>}
        
//         {/* Показываем индикатор загрузки или текст */}
//         {isLoading && (
//           <div>
//             <p>Загрузка... {progress}%</p>
//             <div style={{ width: '100%', backgroundColor: '#ddd', height: '10px', borderRadius: '5px' }}>
//               <div
//                 style={{
//                   width: `${progress}%`,
//                   backgroundColor: '#4caf50',
//                   height: '100%',
//                   borderRadius: '5px',
//                 }}
//               />
//             </div>
//           </div>
//         )}

//         {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
//         {!isLoading && !error && candidates.length === 0 && <p>Нет кандидатов</p>}

//         <ul>
//           {candidates.map((candidate, index) => (
//             <li key={index}>{index + 1}. {candidate.name}</li>
//           ))}
//         </ul>
//       </ScrollArea>
//     </DefaultLayout>
//   );
// }
// 'use client'
// import { ScrollArea } from "@/components/ui/scroll-area";
// import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
// import { useCandidates } from '@/src/context/CandidatesContext';
// import { useState, useEffect } from 'react';
// import { saveToIndexedDB } from "@/src/local/db"; 
// import { getFromIndexedDB } from "@/src/local/getFromIndexedDB"; 

// export default function Page() {
//   const { candidates, isLoading, error, loadMoreCandidates } = useCandidates(); // Получаем кандидатов из контекста
  
//   const [progress, setProgress] = useState(0);
//   const [localCandidates, setLocalCandidates] = useState<any[]>([]);
//   const [page, setPage] = useState(1); // Текущая страница для пагинации
//   const [hasMore, setHasMore] = useState(true); // Флаг для проверки, есть ли еще кандидаты для загрузки

//   // Используем эффект для загрузки кандидатов
//   useEffect(() => {
//     const managerId = 'someManagerId'; // Замените на свой идентификатор менеджера или используйте динамически

//     const fetchCandidates = async () => {
//       // Проверяем, есть ли кандидаты в IndexedDB
//       const savedCandidates = await getFromIndexedDB(managerId); 

//       if (savedCandidates.length > 0) {
//         setLocalCandidates(savedCandidates); // Если кандидаты есть, загружаем их из IndexedDB
//       } else {
//         // Если кандидатов нет в IndexedDB, используем кандидатов из контекста
//         if (candidates.length > 0) {
//           setLocalCandidates(candidates); // Устанавливаем кандидатов из контекста
          
//           // Сохраняем полученных кандидатов в IndexedDB
//           saveToIndexedDB('candidates', managerId, candidates); // Здесь передаем три аргумента
//         }
//       }
//     };

//     fetchCandidates(); // Загружаем кандидатов из IndexedDB или контекста
//   }, [candidates]); // Зависимость от контекста кандидатов

//   // Эмуляция прогресса загрузки
//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     if (isLoading && localCandidates.length === 0) { // Запускаем прогресс только если кандидаты не загружены
//       interval = setInterval(() => {
//         setProgress((prev) => {
//           if (prev >= 100) {
//             clearInterval(interval);
//             return 100;
//           }
//           return prev + 10;
//         });
//       }, 500);
//     } else if (localCandidates.length > 0) {
//       // Если кандидаты уже загружены, прекратить прогресс
//       setProgress(100);
//     }

//     return () => clearInterval(interval);
//   }, [isLoading, localCandidates]);

//   // Функция для загрузки следующих порций кандидатов
//   const loadMore = async () => {
//     if (isLoading || !hasMore) return;  // Если уже идет загрузка или нет кандидатов для загрузки

//     setPage((prevPage) => prevPage + 1);  // Переходим на следующую страницу
//     await loadMoreCandidates();  // Загружаем больше кандидатов из API или IndexedDB

//     // Проверяем, есть ли еще кандидаты для загрузки
//     if (localCandidates.length >= 140) {  // Пример: если уже загружено больше 140 кандидатов
//       setHasMore(false); // Нет больше кандидатов
//     }
//   };

//   return (
//     <DefaultLayout>
//       <ScrollArea className="h-screen">
//         {localCandidates.length > 0 && <h1>Все кандидаты: {localCandidates.length}</h1>}
        
//         {/* Показываем индикатор загрузки или текст */}
//         {isLoading && localCandidates.length === 0 && (
//           <div>
//             <p>Загрузка... {progress}%</p>
//             <div style={{ width: '100%', backgroundColor: '#ddd', height: '10px', borderRadius: '5px' }}>
//               <div
//                 style={{
//                   width: `${progress}%`,
//                   backgroundColor: '#4caf50',
//                   height: '100%',
//                   borderRadius: '5px',
//                 }}
//               />
//             </div>
//           </div>
//         )}

//         {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
//         {!isLoading && !error && localCandidates.length === 0 && <p>Нет кандидатов</p>}
        
//         <ul>
//           {localCandidates.map((candidate, index) => (
//             <><h1>{candidate.createdAt}</h1>
//             <li key={index}>{index + 1}. {candidate.name}</li><li>{candidate.phone}</li></>
//           ))}
//         </ul>

//         {/* Кнопка для загрузки следующей порции данных */}
//         {hasMore && !isLoading && (
//           <button onClick={loadMore} className="btn btn-primary">
//             Загрузить больше
//           </button>
//         )}
        
//         {/* Если кандидатов больше нет */}
//         {!hasMore && !isLoading && (
//           <p>Больше кандидатов нет</p>
//         )}
//       </ScrollArea>
//     </DefaultLayout>
//   );
// }
'use client';
import { ScrollArea } from "@/components/ui/scroll-area";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
import { useCandidates } from '@/src/context/CandidatesContext';
import { useState, useEffect } from 'react';
import { saveToIndexedDB } from "@/src/local/db"; 
import { getFromIndexedDB } from "@/src/local/getFromIndexedDB"; 
import { Eye, UserCog } from "lucide-react";
import { Candidate } from "@/src/types/candidate";
import SidebarRight from "@/src/components/SidebarRight";
import { ProfessionProvider } from "@/src/context/ProfessionContext";

export default function Page() {
  const { candidates, isLoading, error, loadMoreCandidates } = useCandidates(); // Получаем кандидатов из контекста
  
  const [progress, setProgress] = useState(0);
  const [localCandidates, setLocalCandidates] = useState<any[]>([]);
  const [page, setPage] = useState(1); // Текущая страница для пагинации
  const [hasMore, setHasMore] = useState(true); // Флаг для проверки, есть ли еще кандидаты для загрузки

  
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formType, setFormType] = useState<"addCandidate" | "editCandidate" | "viewCandidate" | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  // Используем эффект для загрузки кандидатов
  useEffect(() => {
    const managerId = 'someManagerId'; // Замените на свой идентификатор менеджера или используйте динамически

    const fetchCandidates = async () => {
      // Проверяем, есть ли кандидаты в IndexedDB
      const savedCandidates = await getFromIndexedDB(managerId); 

      if (savedCandidates.length > 0) {
        setLocalCandidates(savedCandidates); // Если кандидаты есть, загружаем их из IndexedDB
      } else {
        // Если кандидатов нет в IndexedDB, используем кандидатов из контекста
        if (candidates.length > 0) {
          setLocalCandidates(candidates); // Устанавливаем кандидатов из контекста
          
          // Сохраняем полученных кандидатов в IndexedDB
          saveToIndexedDB('candidates', managerId, candidates); // Здесь передаем три аргумента
        }
      }
    };

    fetchCandidates(); // Загружаем кандидатов из IndexedDB или контекста
  }, [candidates]); // Зависимость от контекста кандидатов

  // Эмуляция прогресса загрузки
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLoading && localCandidates.length === 0) { // Запускаем прогресс только если кандидаты не загружены
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    } else if (localCandidates.length > 0) {
      // Если кандидаты уже загружены, прекратить прогресс
      setProgress(100);
    }

    return () => clearInterval(interval);
  }, [isLoading, localCandidates]);

  // Функция для загрузки следующих порций кандидатов
  const loadMore = async () => {
    if (isLoading || !hasMore) return;  // Если уже идет загрузка или нет кандидатов для загрузки

    setPage((prevPage) => prevPage + 1);  // Переходим на следующую страницу
    await loadMoreCandidates();  // Загружаем больше кандидатов из API или IndexedDB

    // Проверяем, есть ли еще кандидаты для загрузки
    if (localCandidates.length >= 140) {  // Пример: если уже загружено больше 140 кандидатов
      setHasMore(false); // Нет больше кандидатов
    }
  };
  const toggleSidebar = (type: "addCandidate" | "editCandidate" | "viewCandidate", candidate?: Candidate) => {
    setFormType(type);             
    setSelectedCandidate(candidate || null); 
    setSidebarOpen(prevState => !prevState);  
  };
  return (
    <DefaultLayout>
        <ProfessionProvider>
        <SidebarRight 
          sidebarROpen={sidebarOpen} 
          setSidebarROpen={setSidebarOpen} 
          formType={formType} 
          selectedCandidate={selectedCandidate} 
        />
      <ScrollArea className="h-screen">
        {localCandidates.length > 0 && <h1>Все кандидаты: {localCandidates.length}</h1>}
        
        {/* Показываем индикатор загрузки или текст */}
        {isLoading && localCandidates.length === 0 && (
          <div>
            <p>Загрузка... {progress}%</p>
            <div style={{ width: '100%', backgroundColor: '#ddd', height: '10px', borderRadius: '5px' }}>
              <div
                style={{
                  width: `${progress}%`,
                  backgroundColor: '#4caf50',
                  height: '100%',
                  borderRadius: '5px',
                }}
              />
            </div>
          </div>
        )}

        {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
        {!isLoading && !error && localCandidates.length === 0 && <p>Нет кандидатов</p>}
        <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Имя</h5>
          </div>
          <div className="p-2.5 text-start xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Профессии</h5>
          </div>
          <div className="p-2.5 text-start xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Документы</h5>
          </div>
          <div className="hidden p-2.5 text-start sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Добавлен/Обновлён</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Телефон</h5>
          </div>
        </div>
        </div>
        <ul>
          {localCandidates.map((candidate, index) => (
            <div key={index}
            className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
            >
                 <div
              className={`grid grid-cols-3 sm:grid-cols-5 ${'border-b border-stroke dark:border-strokedark'}`}
              key={candidate.id || index}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <div className="flex-shrink-0">
                  <Eye onClick={() => toggleSidebar("viewCandidate", candidate)} />
                  <UserCog onClick={() => toggleSidebar("editCandidate", candidate)} />
                </div>
                <div className="hidden text-black dark:text-white sm:block">{candidate.name}</div>
              </div>
              <div className="flex items-center justify-start p-2.5 xl:p-5">
                <div className="text-black dark:text-white">
                  {candidate.professions.map((profession: any, index: any) => (
                    <div key={index}>{profession.name}</div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-start p-2.5 xl:p-5">
                <div className="text-meta-3">
                  {candidate.documents.map((document: any, index: any) => (
                    <div key={index}>{document.docType}</div>
                  ))}
                </div>
              </div>
              <div className="hidden text-sm items-center justify-center p-2.5 sm:flex xl:p-5">
                <div className="text-black dark:text-white">
                  {`${new Date(candidate.createdAt).toLocaleDateString('ru-RU', {
                    day: '2-digit', month: 'long', year: '2-digit'
                  })} / ${new Date(candidate.updatedAt).toLocaleDateString('ru-RU', {
                    day: '2-digit', month: 'long', year: '2-digit'
                  })}`}
                </div>
              </div>
              <div className="hidden items-center justify-end p-2.5 sm:flex xl:p-5">
                <div className="text-meta-5">{candidate.phone}</div>
              </div>
            </div>
              {/* <h1>{candidate.createdAt}</h1>
              <li>{index + 1}. {candidate.name}</li>
              <li>{candidate.phone}</li> */}
            </div>
          ))}
        </ul>

        {/* Кнопка для загрузки следующей порции данных */}
        {hasMore && !isLoading && (
          <button onClick={loadMore} className="btn btn-primary">
            Загрузить больше
          </button>
        )}
        
        {/* Если кандидатов больше нет */}
        {!hasMore && !isLoading && (
          <p>Больше кандидатов нет</p>
        )}
      </ScrollArea>
      </ProfessionProvider>
    </DefaultLayout>
  );
}
