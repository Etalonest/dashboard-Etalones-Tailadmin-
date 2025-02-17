// 'use client'
// import { ScrollArea } from "@/components/ui/scroll-area";
// import DefaultLayout from "@/src/components/Layouts/DefaultLayout"
// import { useCandidates } from '@/src/context/CandidatesContext';

// export default function Page() {
//       const { candidates, isLoading, error } = useCandidates();
    
//   return (
//     <DefaultLayout>
//         <ScrollArea className="h-screen">
//         {candidates.length > 0 && <h1>Все кандидаты{candidates.length}</h1>}
//       {isLoading && <p>Загрузка...</p>}
//       {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
//       {!isLoading && !error && candidates.length === 0 && <p>Нет кандидатов</p>}
//       <ul>
//         {candidates.map((candidate, index) => (
//             <li key={candidate.id}>{index +1}{candidate.name}</li>
//         ))}
//       </ul>
//         </ScrollArea >
//     </DefaultLayout>
//   );
// }

'use client'
import { ScrollArea } from "@/components/ui/scroll-area";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
import { useCandidates } from '@/src/context/CandidatesContext';
import { useState, useEffect } from 'react';

export default function Page() {
  const { candidates, isLoading, error } = useCandidates();
  
  // Состояние для прогресса загрузки
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout; // Объявляем интервал внутри useEffect

    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval); // Очищаем интервал, когда прогресс достигает 100
            return 100;
          }
          return prev + 10; // увеличиваем прогресс на 10% каждый раз
        });
      }, 500); // обновляем прогресс каждые 500 мс
    }

    return () => clearInterval(interval); 
  }, [isLoading]);

  return (
    <DefaultLayout>
      <ScrollArea className="h-screen">
        {candidates.length > 0 && <h1>Все кандидаты {candidates.length}</h1>}
        
        {/* Показываем индикатор загрузки или текст */}
        {isLoading && (
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
        {!isLoading && !error && candidates.length === 0 && <p>Нет кандидатов</p>}

        <ul>
          {candidates.map((candidate, index) => (
            <li key={candidate.id}>{index + 1}. {candidate.name}</li>
          ))}
        </ul>
      </ScrollArea>
    </DefaultLayout>
  );
}
