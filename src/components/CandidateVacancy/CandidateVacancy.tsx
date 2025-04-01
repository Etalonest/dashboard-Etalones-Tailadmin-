import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, UserCog } from 'lucide-react';
import { CallHistory } from '../forms/Funnel/CallHistory/CallHistory';
import { useSidebarR } from '@/src/context/SidebarRContext';
import SidebarRight from '../SidebarRight';

const CandidateVacancy = ({ candidates }: { candidates: any[] }) => {
    const { setSidebarROpen, setFormType, setSelectedCandidate } = useSidebarR();

    useEffect(() => {
        console.log("Кандидаты в CandidateVacancy:", candidates);
    }, [candidates]);
    

    const toggleSidebar = (type: 'addCandidate' | 'editCandidate' | 'viewCandidate', candidate?: any) => {
        setFormType(type);
        setSelectedCandidate(candidate || null);
        setSidebarROpen(true);
    };

    return (
        <div>
            <h2>Кандидаты</h2>
            <SidebarRight />
            {/* Проверка на наличие кандидатов */}
            {candidates && candidates.length > 0 ? (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Результаты поиска</h2>
                    <Table>
                        <TableHeader className="border-b py-2">
                            <TableHead><strong>Добавлен</strong></TableHead>
                            <TableHead><strong>Имя</strong></TableHead>
                            <TableHead><strong>Телефон:</strong></TableHead>
                            <TableHead><strong>Профессия:</strong></TableHead>
                            <TableHead><strong>Статус:</strong></TableHead>
                            <TableHead><strong>Документы:</strong></TableHead>
                            <TableHead><strong>Диалоги:</strong></TableHead>
                        </TableHeader>
                        <TableBody>
                            {candidates.map((candidate, index) => (
                                <TableRow key={candidate._id || index}>
                                    <TableCell className="flex flex-col">
                                        <div>{new Date(candidate.createdAt).toLocaleString().slice(0, 10)}</div>
                                        <div>{candidate?.manager?.name}</div>
                                    </TableCell>
                                    <TableCell>
                                        <p>{candidate.name}</p>
                                        <div className="flex gap-2">
                                            <Eye size={18} onClick={() => toggleSidebar('viewCandidate', candidate)} />
                                            <UserCog size={18} onClick={() => toggleSidebar('editCandidate', candidate)} />
                                        </div>
                                    </TableCell>
                                    <TableCell>{candidate.phone}</TableCell>
                                    <TableCell>
                                        {candidate.professions?.map((profession: { name: any }) => profession.name).join(', ') || 'Не указано'}
                                    </TableCell>
                                    <TableCell>
                                        {candidate.status}
                                        {candidate?.statusWork?.map((status: { name: any }) => status.name).join(', ') || 'Не указан'}
                                    </TableCell>
                                    <TableCell>
                                        {candidate.documents?.map((document: { docType: any }) => document.docType).join(', ') || 'Нет документов'}
                                    </TableCell>
                                    <TableCell>
                                        <CallHistory candidate={candidate} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="text-center mt-4">Ничего не найдено</div>
            )}
        </div>
    );
};

export default CandidateVacancy;
