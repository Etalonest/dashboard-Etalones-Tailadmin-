'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import { DocumentsSelect, ProfessionSelect, StatusSelect, ManagerSelect } from '@/src/components/Select/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CallHistory } from '../forms/Funnel/CallHistory/CallHistory';
import { Eye, UserCog } from 'lucide-react';
import { Candidate } from '@/src/types/candidate';
import SidebarRight from '../SidebarRight';

const SearchCandidates = () => {
  // Состояния для всех полей
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState('');
  const [status, setStatus] = useState('');
  const [document, setDocument] = useState('');
  const [manager, setManager] = useState('');
  const [partner, setPartner] = useState('');
  const [location, setLocation] = useState('');

  
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formType, setFormType] = useState<"addCandidate" | "editCandidate" | "viewCandidate" | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  // Состояние для хранения результатов поиска
  const [candidates, setCandidates] = useState<any[]>([]); 
  const [error, setError] = useState<string | null>(null); // Для ошибок
  const [isLoading, setIsLoading] = useState(false); // Для отслеживания загрузки

  // Функция для отправки запроса
  const handleSearch = async () => {
    try {
      setIsLoading(true); // Включаем загрузку

      // Строим параметры для запроса
      const params = new URLSearchParams({
        name,
        phone,
        profession,
        status,
        document,
        manager,
        partner,
        location,
      });

      // Отправляем запрос на сервер с фильтрами
      const response = await fetch(`/api/globalSearch?${params.toString()}`, {
        method: 'GET', 
      });

      if (!response.ok) {
        throw new Error('Ошибка поиска');
      }

      const data = await response.json();

      // Сохраняем результаты в состоянии
      setCandidates(data.candidates);
      setError(null); // Сбрасываем ошибки
    } catch (error: any) {
      console.error('Ошибка поиска:', error);
      setError('Произошла ошибка при поиске кандидатов');
      setCandidates([]); // Очищаем результаты в случае ошибки
    } finally {
      setIsLoading(false); // Отключаем загрузку
    }
  };
const toggleSidebar = (type: "addCandidate" | "editCandidate" | "viewCandidate", candidate?: Candidate) => {
    setFormType(type);             
    setSelectedCandidate(candidate || null); 
    setSidebarOpen(prevState => !prevState);  
  };
  return (
    <div>
        <SidebarRight 
          sidebarROpen={sidebarOpen} 
          setSidebarROpen={setSidebarOpen} 
          formType={formType} 
          selectedCandidate={selectedCandidate} 
        />
      <h1 className="text-center text-2xl font-semibold mb-2">Поиск кандидатов</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <Label>По имени</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="col-span-1">
          <Label>По телефону</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="col-span-1">
          <ProfessionSelect onProfessionChange={setProfession} />
        </div>
        <div className="col-span-1">
          <StatusSelect onStatusChange={setStatus} />
        </div>

        <div className="col-span-1">
          <DocumentsSelect onDocumentChange={setDocument} />
        </div>
        <div className="col-span-1">
          <ManagerSelect onManagerChange={setManager} />
        </div>
        {/* <div className="col-span-1">
          <Label>По партнёру</Label>
          <Input value={partner} onChange={(e) => setPartner(e.target.value)} />
        </div>
        <div className="col-span-1">
          <Label>По локации</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} />
        </div> */}
      </div>

      <div className="flex justify-center my-4">
        <Button
          className="bg-green-900 text-white hover:bg-green-700 transition-colors duration-300"
          onClick={handleSearch}
        >
          Поиск
        </Button>
      </div>

      {/* Отображение текста "Поиск..." или индикатора загрузки */}
      {isLoading && <div className="text-center my-4">Поиск...</div>}

      {/* Отображение ошибки, если она есть */}
      {error && <div className="text-red-600 text-center">{error}</div>}

      {/* Отображение результатов поиска */}
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
                    <TableCell>{new Date(candidate.createdAt)
        .toLocaleString()
        .slice(0, 10)}</TableCell>
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

export default SearchCandidates;
