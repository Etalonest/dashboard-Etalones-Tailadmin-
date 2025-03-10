'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import { DocumentsSelect, ProfessionSelect, StatusSelect } from '@/src/components/Select/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

  // Состояние для хранения результатов поиска
  const [candidates, setCandidates] = useState<any[]>([]); 
  const [error, setError] = useState<string | null>(null); // Для ошибок

  // Функция для отправки запроса
  const handleSearch = async () => {
    try {
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
    }
  };

  return (
    <div>
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
          <Label>По менеджеру</Label>
          <Input value={manager} onChange={(e) => setManager(e.target.value)} />
        </div>
        <div className="col-span-1">
          <Label>По партнёру</Label>
          <Input value={partner} onChange={(e) => setPartner(e.target.value)} />
        </div>
        <div className="col-span-1">
          <Label>По локации</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-center my-4">
        <Button
          className="bg-green-900 text-white hover:bg-green-700 transition-colors duration-300"
          onClick={handleSearch}
        >
          Поиск
        </Button>
      </div>

      {/* Отображение ошибки, если она есть */}
      {error && <div className="text-red-600 text-center">{error}</div>}

      {/* Отображение результатов поиска */}
      {candidates.length > 0 ? (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Результаты поиска</h2>
          <Table>
            {candidates.map((candidate, index) => (
              <><TableHeader key={index} className="border-b py-2">
                    <TableHead><strong>Имя</strong> </TableHead>
                    <TableHead><strong>Телефон:</strong> </TableHead>
                    <TableHead><strong>Профессия:</strong> </TableHead>
                    <TableHead><strong>Статус:</strong> </TableHead>
                    <TableHead><strong>Документы:</strong> </TableHead>
                </TableHeader>
                <TableBody>
                <TableRow>
                    <TableCell>
                {candidate.name}
                </TableCell>
                <TableCell>{candidate.phone}</TableCell>
                <TableCell>{candidate.profession}</TableCell>
                <TableCell>{candidate.status}</TableCell>
                <TableCell>{candidate.documents.join(', ')}</TableCell>
                </TableRow>
                </TableBody></>
            ))}
          </Table>
        </div>
      ) : (
        !error && <div className="text-center mt-4">Ничего не найдено</div> // Если нет результатов и нет ошибки
      )}
    </div>
  );
};

export default SearchCandidates;
