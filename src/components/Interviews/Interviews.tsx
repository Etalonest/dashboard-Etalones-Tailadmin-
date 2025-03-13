'use client';
import { useSession } from '@/src/context/SessionContext';
import { useManager } from '@/src/context/ManagerContext';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Candidate } from '@/src/types/candidate';
import { Manager } from '@/src/types/manager';

const Interview = () => {
    const { session } = useSession();
    if (!session) {
        return <p>Пожалуйста, войдите в систему.</p>;
      }
  const { manager } = useManager() as { manager: Manager };

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  if (loading) {
    return <div>Загрузка кандидатов...</div>;
  }

  return (
    <div>
      {error ? (
        <div>{error}</div>
      ) : (
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
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
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
      )}
    </div>
  );
};

export default Interview;
