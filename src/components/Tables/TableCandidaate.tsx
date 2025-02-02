'use client'
import { useCandidates } from '@/src/context/CandidatesContext';
import { Eye, UserCog, UserRoundPlus } from "lucide-react";
import { Candidate } from '@/src/types/candidate';
import { useState, useEffect } from 'react';
import SidebarRight from '../SidebarRight';
import Loader from "@/src/components/common/Loader";
import { useSession } from 'next-auth/react';

const TableCandidate = () => {
  const { data: session } = useSession();
  const managerId = session?.managerId ?? 'defaultManagerId';
  const { candidates, loadCandidates } = useCandidates(); // Получаем кандидаты из контекста
  const [loading, setLoading] = useState<boolean>(false); 
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);

  const candidatesPerPage = 10;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formType, setFormType] = useState<"addCandidate" | "editCandidate" | "viewCandidate" | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const currentCandidates = filteredCandidates.slice(
    (currentPage - 1) * candidatesPerPage,
    currentPage * candidatesPerPage
  );

  useEffect(() => {
    if (managerId && candidates.length === 0) {
      loadCandidates(managerId);  
    }
  }, [managerId, loadCandidates, candidates.length]);
  useEffect(() => {
    if (candidates && Array.isArray(candidates)) {
      const filtered = candidates.filter((candidate) => {
        const lowerCaseSearch = searchQuery.toLowerCase();
  
        // Фильтрация по имени и телефону
        const nameMatch = candidate.name && candidate.name.toLowerCase().includes(lowerCaseSearch);
        const phoneMatch = candidate.phone && candidate.phone.toLowerCase().includes(lowerCaseSearch);
  
        // Фильтрация по профессии
        const professionMatch = candidate.professions?.some((profession) =>
          profession.name.toLowerCase().includes(lowerCaseSearch)
        );
  
        // Фильтрация по документам
        const documentMatch = candidate.documents?.some((document) =>
          document.docType.toLowerCase().includes(lowerCaseSearch)
        );
  
        // Возвращаем кандидатов, у которых совпадает хотя бы одно из полей
        return nameMatch || phoneMatch || professionMatch || documentMatch;
      });
  
      setFilteredCandidates(filtered);
    }
  }, [searchQuery, candidates]);
  


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const toggleSidebar = (type: "addCandidate" | "editCandidate" | "viewCandidate", candidate?: Candidate) => {
    setFormType(type);             
    setSelectedCandidate(candidate || null); 
    setSidebarOpen(prevState => !prevState);  
  };

  if (loading) {
    return <Loader />; // Если загрузка, показываем лоадер
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3 mb-6'>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Мои кандидаты
          </h4>
          <UserRoundPlus color='green' onClick={() => toggleSidebar("addCandidate")} className='cursor-pointer' />
        </div>
        <SidebarRight 
          sidebarROpen={sidebarOpen} 
          setSidebarROpen={setSidebarOpen} 
          formType={formType} 
          selectedCandidate={selectedCandidate} 
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Поиск по имени, телефону или профессии"
          className="mb-4 px-4 py-2  border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Имя</h5>
          </div>
          <div className="p-2.5 text-start xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Профессии</h5>
          </div>
          <div className="p-2.5 text-start xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Документы</h5>
          </div>
          <div className="hidden p-2.5 text-start sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Добавлен/Обновлён</h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Телефон</h5>
          </div>
        </div>

        
          {managerId && currentCandidates.map((candidate: any, index: number) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-5 ${'border-b border-stroke dark:border-strokedark'}`}
              key={candidate.id || index}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <div className="flex-shrink-0">
                  <Eye onClick={() => toggleSidebar("viewCandidate", candidate)} />
                  <UserCog onClick={() => toggleSidebar("editCandidate", candidate)} />
                </div>
                <div className="hidden text-black dark:text-white sm:block">{candidate.name}</div>
              </div>
              <div className="flex items-center justify-start p-2.5 xl:p-5">
                <div className="text-black dark:text-white">
                  {candidate.professions.map((profession: any, index: any) => (
                    <div key={index}>{profession.name}</div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-start p-2.5 xl:p-5">
                <div className="text-meta-3">
                  {candidate.documents.map((document: any, index: any) => (
                    <div key={index}>{document.docType}</div>
                  ))}
                </div>
              </div>
              <div className="hidden text-sm items-center justify-center p-2.5 sm:flex xl:p-5">
                <div className="text-black dark:text-white">
                  {`${new Date(candidate.createdAt).toLocaleDateString('ru-RU', {
                    day: '2-digit', month: 'long', year: '2-digit'
                  })} / ${new Date(candidate.updatedAt).toLocaleDateString('ru-RU', {
                    day: '2-digit', month: 'long', year: '2-digit'
                  })}`}
                </div>
              </div>
              <div className="hidden items-center justify-end p-2.5 sm:flex xl:p-5">
                <div className="text-meta-5">{candidate.phone}</div>
              </div>
            </div>
          ))
        }
      </div>

      {/* Пагинация */}
      {filteredCandidates.length > candidatesPerPage && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-md"
          >
            Назад
          </button>
          <span className="mx-4 text-sm font-medium text-black dark:text-white">
            Страница {currentPage} из {Math.ceil(filteredCandidates.length / candidatesPerPage)}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredCandidates.length / candidatesPerPage)}
            className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-md"
          >
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
};

export default TableCandidate;
