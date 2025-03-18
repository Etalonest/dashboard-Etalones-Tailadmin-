'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import { DocumentsSelect, ProfessionSelect, StatusSelect, ManagerSelect } from '@/src/components/Select/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CallHistory } from '../forms/Funnel/CallHistory/CallHistory';
import { Eye, UserCog } from 'lucide-react';
import { Partner } from '@/src/types/partner'; // Подключаем тип партнёра
import SidebarRight from '../SidebarRight';
import { useSidebar } from '@/src/context/SidebarContext';

const SearchPartners = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState('');
  const [status, setStatus] = useState('');
  const [document, setDocument] = useState('');
  const [manager, setManager] = useState('');

  const { setSidebarROpen, setFormType, setSelectedPartner } = useSidebar();

  const [partners, setPartners] = useState<Partner[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setIsLoading(true);

      // Строим параметры для запроса
      const params = new URLSearchParams({
        name,
        phone,
        profession,
        status,
        document,
        manager,
      });

      // Отправляем запрос на сервер с фильтрами
      const response = await fetch(`/api/globalSearchPartner?${params.toString()}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Ошибка поиска');
      }

      const data = await response.json();
      setPartners(data.partners);
      setError(null); // Сбрасываем ошибки
    } catch (error: any) {
      console.error('Ошибка поиска:', error);
      setError('Произошла ошибка при поиске партнёров');
      setPartners([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = (type: 'addPartner' | 'editPartner' | 'viewPartner', partner?: Partner) => {
    setFormType(type);
    setSelectedPartner(partner || null);
    setSidebarROpen(true);
  };

  return (
    <div>
      <SidebarRight />
      <h1 className="text-center text-2xl font-semibold mb-2">Поиск партнёров</h1>
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
      </div>

      <div className="flex justify-center my-4">
        <Button
          className="bg-green-900 text-white hover:bg-green-700 transition-colors duration-300"
          onClick={handleSearch}
        >
          Поиск
        </Button>
      </div>

      {isLoading && <div className="text-center my-4">Поиск...</div>}

      {error && <div className="text-red-600 text-center">{error}</div>}

      {partners.length > 0 ? (
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
              {/* <TableHead><strong>Диалоги:</strong></TableHead> */}
            </TableHeader>
            <TableBody>
              {partners.map((partner, index) => (
                <TableRow key={index}>
                  <TableCell className="flex flex-col">
                    <div>{new Date(partner.createdAt).toLocaleString().slice(0, 10)}</div>
                    <div>{partner?.manager?.name}</div>
                  </TableCell>
                  <TableCell>
                    <p>{partner.name}</p>
                    <div className="flex gap-2">
                      <Eye size={18} onClick={() => toggleSidebar("viewPartner", partner)} />
                      <UserCog size={18} onClick={() => toggleSidebar("editPartner", partner)} />
                    </div>
                  </TableCell>
                  <TableCell>{partner.phone}</TableCell>
                  <TableCell>{partner.professions.map((profession: { name: any }) => profession.name).join(', ')}</TableCell>
                  <TableCell>{partner.status}</TableCell>
                  <TableCell>{partner.documents.map((document: { docType: any }) => document.docType).join(', ')}</TableCell>
                  <TableCell>
                    {/* <CallHistory candidate={partner} /> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        !error && <div className="text-center mt-4">Ничего не найдено</div>
      )}
    </div>
  );
};

export default SearchPartners;
