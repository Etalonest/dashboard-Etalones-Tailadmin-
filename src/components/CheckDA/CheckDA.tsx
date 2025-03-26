'use client';
import { useSession } from '@/src/context/SessionContext';
import { useManager } from '@/src/context/ManagerContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Candidate } from '@/src/types/candidate';
import { CallHistory } from '../forms/Funnel/CallHistory/CallHistory';
import { Eye, Tag, UserCog } from 'lucide-react';
import SidebarRight from '../SidebarRight';
import { useSidebarR } from '@/src/context/SidebarRContext';

const CheckDA = () => {
  const { session } = useSession();  // Для проверки сессии
  const { manager, candidates } = useManager();  // Получаем менеджера и кандидатов из контекста
  const {
    setSidebarROpen,
    setFormType,
    setSelectedCandidate,
  } = useSidebarR();
   
  const toggleSidebar = (type: 'addCandidate' | 'editCandidate' | 'viewCandidate', candidate?: Candidate) => {
    setFormType(type);
    setSelectedCandidate(candidate || null);
    setSidebarROpen(true); // Открытие сайдбара
  };

  if (!session) {
    return <p>Пожалуйста, войдите в систему.</p>;
  }

  if (!manager) {
    return <div>Загрузка данных менеджера...</div>;
  }

  const filteredCandidates = candidates.filter((candidate) =>
    manager.candidateFromInterview.includes(candidate._id)
  );

  if (filteredCandidates.length === 0) {
    return <div>Кандидаты не найдены для этого интервью.</div>;
  }

  return (
    <div>
      <h1 className='text-2xl font-bold'>Кандидаты на собеседовании</h1>
      <SidebarRight />
      <Table>
        <TableHeader className="border-b py-2">
          <TableRow >
          <TableHead className='text-center'><strong>Добавлен</strong></TableHead>
          <TableHead className='text-center'><strong>Имя</strong></TableHead>
          <TableHead className='text-center'><strong>Телефон:</strong></TableHead>
          <TableHead className='text-center'><strong>Профессия:</strong></TableHead>
          <TableHead className='text-center'><strong>Статус:</strong></TableHead>
          <TableHead className='text-center'><strong>Документы:</strong></TableHead>
          <TableHead className='text-center'><strong>Диалоги:</strong></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCandidates.map((candidate, index) => (
            <TableRow key={index}>
              <TableCell>{new Date(candidate.createdAt).toLocaleString().slice(0, 10)} - {candidate?.manager?.name}</TableCell>
              <TableCell>
                <p>{candidate.name}</p>
                <div className="flex gap-2">
                  <Eye size={18} onClick={() => toggleSidebar("viewCandidate", candidate)} />
                  <UserCog size={18} onClick={() => toggleSidebar("editCandidate", candidate)} />
                </div>
              </TableCell>
              <TableCell>{candidate.phone}</TableCell>
              <TableCell className='text-center'>{candidate.professions.map((profession: { name: any; }) => profession.name).join(', ')}</TableCell>
              <TableCell>
                555
              </TableCell>
              <TableCell className='text-center'>
  <div className="flex flex-col items-center">
    {candidate.documents.map((document: { docType: any }, index: number) => (
      <span key={index}>{document.docType}</span>
    ))}
  </div>
</TableCell>
              <TableCell>
                <CallHistory candidate={candidate} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CheckDA;
