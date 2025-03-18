import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, UserCog } from 'lucide-react';
import { CallHistory } from '../forms/Funnel/CallHistory/CallHistory';
import { useSidebar } from '@/src/context/SidebarContext';
import { Candidate } from '@/src/types/candidate';
import SidebarRight from '../SidebarRight';

const CandidateVacancy = ({ vacancyId }: { vacancyId: string }) => {
      const {
        setSidebarROpen,
        setFormType,
        setSelectedCandidate,
      } = useSidebar();
      
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Для обработки ошибок

  useEffect(() => {
    const fetchCandidates = async () => {
      console.log('Загрузка кандидатов для вакансии:', vacancyId); // Логируем начало загрузки

      try {
        const response = await fetch(`/api/candidates/forVacancy?vacancyId=${vacancyId}`);
        
        if (!response.ok) {
          throw new Error(`Ошибка API: ${response.statusText}`); // Если API вернул ошибку
        }

        const data = await response.json();
        console.log('Полученные данные от API:', data); // Логируем полученные данные

        if (data && data.candidates) {
          setCandidates(data.candidates); // Используем правильное поле с кандидатами
        } else {
          setCandidates([]); // Если нет кандидатов в ответе
        }

      } catch (error: any) {
        console.error('Ошибка при загрузке кандидатов:', error);
        setError(error.message || 'Произошла ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [vacancyId]);

  if (loading) {
    return <p>Кандидаты загружаются...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>; // Если ошибка при загрузке, выводим её
  }
  const toggleSidebar = (type: 'addCandidate' | 'editCandidate' | 'viewCandidate', candidate?: Candidate) => {
    setFormType(type);
    setSelectedCandidate(candidate || null);
    setSidebarROpen(true); // Открытие сайдбара
  };
  return (
    <div>
      <h2>Кандидаты</h2>
      <SidebarRight/>
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
                    <TableCell className='flex flex-col'>
                      <div>{new Date(candidate.createdAt)
        .toLocaleString()
        .slice(0, 10)}</div>
        <div>{candidate?.manager?.name}</div>
        </TableCell>
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

export default CandidateVacancy;
