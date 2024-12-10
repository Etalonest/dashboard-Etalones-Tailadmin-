'use client'
import { useManager } from '@/src/context/ManagerContext'; 
import { Eye, UserCog, UserRoundPlus } from "lucide-react";
import { Candidate } from '@/src/types/candidate';
import { useState, useEffect } from 'react';
import  Modal  from '@/src/modal/globalModal/GlobalCandidateModal';
import ModalAddCandidate from '../modals/ModalAddCandidate';

const TableCandidate = () => {
  const { manager } = useManager();
  const [isModalAddCandidate, setIsModalAddCandidate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);

  const candidatesPerPage = 10;

  // Считываем кандидатов для отображения на текущей странице
  const currentCandidates = filteredCandidates.slice(
    (currentPage - 1) * candidatesPerPage,
    currentPage * candidatesPerPage
  );

  // Фильтрация кандидатов по имени, телефону или профессии
  useEffect(() => {
    if (manager) {
      const filtered = manager.candidates.filter((candidate) => {
        const lowerCaseSearch = searchQuery.toLowerCase();
        return (
          candidate.name.toLowerCase().includes(lowerCaseSearch) ||
          candidate.phone.toLowerCase().includes(lowerCaseSearch) ||
          candidate.professions.some((profession: Candidate) =>
            profession.name.toLowerCase().includes(lowerCaseSearch)
          )
        );
      });
      setFilteredCandidates(filtered);
    }
  }, [manager, searchQuery]);

  // Обработчик для изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Обработчик для изменения поиска
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenModalAddCandidate = () => {
    setIsModalAddCandidate(true);
  };
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3 mb-6 '>
      <h4 className="text-xl font-semibold text-black dark:text-white">
        Мои кандидаты
      </h4>
      <UserRoundPlus color='green' onClick={() => handleOpenModalAddCandidate()} className='cursor-pointer' />
        </div>
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
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Имя
            </h5>
          </div>
          <div className="p-2.5 text-start xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Профессии
            </h5>
          </div>
          <div className="p-2.5 text-start xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Документы
            </h5>
          </div>
          <div className="hidden p-2.5 text-start sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Добавлен/Обновлён
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Телефон
            </h5>
          </div>
        </div>

        {manager && currentCandidates.map((candidate) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${'border-b border-stroke dark:border-strokedark'}`}
            key={candidate.id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                <Eye />
                <UserCog />
              </div>
              <p className="hidden text-black dark:text-white sm:block">{candidate.name}</p>
            </div>

            <div className="flex items-center justify-start p-2.5 xl:p-5">
              <p className="text-black dark:text-white">
                {candidate.professions.map((profession) => (
                  <div key={profession.id}>{profession.name}</div>
                ))}
              </p>
            </div>

            <div className="flex items-center justify-start p-2.5 xl:p-5">
              <p className="text-meta-3">
                {candidate.documents.map((document) => (
                  <div key={document.id}>{document.docType}</div>
                ))}
              </p>
            </div>

            <div className="hidden text-sm items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">
                {`${new Date(candidate.createdAt).toLocaleDateString('ru-RU', {
                  day: '2-digit', month: 'long', year: '2-digit'
                })} / ${new Date(candidate.updatedAt).toLocaleDateString('ru-RU', {
                  day: '2-digit', month: 'long', year: '2-digit'
                })}`}
              </p>
            </div>

            <div className="hidden items-center justify-end p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{candidate.phone}</p>
            </div>
          </div>
        ))}
        {
  isModalAddCandidate && (
    <Modal isOpen={isModalAddCandidate} onClose={() => setIsModalAddCandidate(false)}>
      <ModalAddCandidate  />
    </Modal>
  )
}
      </div>

      {/* Пагинация */}
      {manager && filteredCandidates.length > candidatesPerPage && (
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
