import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSession } from '@/src/context/SessionContext';
import { Candidate } from '@/src/types/candidate';
import { Eye, UserCog } from 'lucide-react';
import SidebarRight from '../SidebarRight';
import { useSidebar } from '@/src/context/SidebarContext';
import { CallHistory } from '../forms/Funnel/CallHistory/CallHistory';

const CandidatesList = () => {
  const { session } = useSession(); // Для проверки сессии
  const [candidates, setCandidates] = useState<Candidate[]>([]); // Хранение кандидатов
  const [loading, setLoading] = useState<boolean>(false); // Индикатор загрузки
  const [error, setError] = useState<string | null>(null); // Ошибка при запросе

  const {
      setSidebarROpen,
      setFormType,
      setSelectedCandidate,
    } = useSidebar();
  // Функция для запроса данных
  const fetchCandidates = async () => {
    setLoading(true);
    setError(null); // Сбрасываем ошибку перед новым запросом

    try {
      const params = new URLSearchParams();
      params.append('status', 'не обработан');
      // Пустые параметры запроса, как указано в вашем вопросе
      const response = await fetch(`/api/globalSearch?${params.toString()}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке данных кандидатов');
      }

      const data = await response.json();
      setCandidates(data.candidates || []); // Сохраняем полученные кандидатов
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Эффект для загрузки данных, если сессия активна
  useEffect(() => {
    if (session) {
      fetchCandidates();
    }
  }, [session]); // Загружаем кандидатов при наличии сессии

  // Если нет сессии, показываем сообщение
  if (!session) {
    return <p>Пожалуйста, войдите в систему.</p>;
  }

  // Если идет загрузка, показываем индикатор
  if (loading) {
    return <p>Загрузка...</p>;
  }

  // Если есть ошибка при запросе, показываем сообщение
  if (error) {
    return <p>Ошибка: {error}</p>;
  }
  const toggleSidebar = (type: 'addCandidate' | 'editCandidate' | 'viewCandidate', candidate?: Candidate) => {
    setFormType(type);
    setSelectedCandidate(candidate || null);
    setSidebarROpen(true); // Открытие сайдбара
  };
  return (
    <div>
              <SidebarRight />

      {candidates.length > 0 ? (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Результаты поиска</h2>
          <Table>
              <><TableHeader  className="border-b py-2">
              <TableHead><strong>Добавлен</strong> </TableHead>
                    <TableHead><strong>Имя</strong> </TableHead>
                    <TableHead><strong>Телефон:</strong> </TableHead>
                    <TableHead><strong>Профессия:</strong> </TableHead>
                    <TableHead><strong>Статус:</strong> </TableHead>
                    <TableHead><strong>Документы:</strong> </TableHead>
                    <TableHead><strong>Диалоги:</strong> </TableHead>
                </TableHeader>
                <TableBody>
            {candidates.map((candidate, index) => (
                <TableRow key={index}>
                    <TableCell className='flex flex-col'>{new Date(candidate.createdAt)
        .toLocaleString()
        .slice(0, 10)} {candidate?.manager?.name}</TableCell>
                    <TableCell>
                        <p>{candidate.name}</p>
                        <div className="flex gap-2">
                <Eye size={18} onClick={() => toggleSidebar("viewCandidate", candidate)} />
                <UserCog size={18} onClick={() => toggleSidebar("editCandidate", candidate)} />
              </div>
                </TableCell>
                <TableCell>{candidate.phone}</TableCell>
                <TableCell>{candidate.professions.map((profession: { name: any; }) => profession.name).join(', ')}</TableCell>
                <TableCell>{candidate.status}{candidate?.statusWork?.map((status: { name: any; }) => status.name).join(', ')}</TableCell>
                <TableCell>{candidate.documents.map((document: { docType: any; }) => document.docType).join(', ')}</TableCell>
                <TableCell>
                    <CallHistory candidate={candidate} />
                </TableCell>
                </TableRow>
            ))}
                </TableBody></>
          </Table>
        </div>
      ) : (
        !error && <div className="text-center mt-4">Ничего не найдено</div> // Если нет результатов и нет ошибки
      )}
    </div>
  );
};

export default CandidatesList;
