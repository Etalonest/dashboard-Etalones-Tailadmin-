'use client';
import { useSession } from '@/src/context/SessionContext';
import { useManager } from '@/src/context/ManagerContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Candidate } from '@/src/types/candidate';

const Interview = () => {
  const { session } = useSession();  // Для проверки сессии
  const { manager, candidates } = useManager();  // Получаем менеджера и кандидатов из контекста

  // Проверка наличия сессии
  if (!session) {
    return <p>Пожалуйста, войдите в систему.</p>;
  }

  // Проверка наличия менеджера в контексте
  if (!manager) {
    return <div>Загрузка данных менеджера...</div>; // Пока менеджер не загрузится
  }

  // Проверка на наличие поля candidateFromRecruiter и что это массив
  const candidateFromRecruiter = Array.isArray(manager.candidateFromRecruiter)
    ? manager.candidateFromRecruiter
    : [];

  // Получаем список кандидатов из поля candidateFromRecruiter менеджера
  const filteredCandidates = candidates.filter((candidate) =>
    candidateFromRecruiter.includes(candidate._id)
  );

  // Проверка наличия отфильтрованных кандидатов
  if (filteredCandidates.length === 0) {
    return <div>Нет кандидатов от рекрутера.</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Имя</TableHead>
            <TableHead>Вакансия</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Дата</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate: Candidate) => (
              <TableRow key={candidate._id}>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{candidate.professions?.map(p => p.name).join(', ') || 'Не указана'}</TableCell>
                <TableCell>{candidate.status}</TableCell>
                <TableCell>
                  {candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : 'Не назначено'}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} style={{ textAlign: 'center' }}>Кандидаты не найдены</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Interview;
