'use client'
import { useManager } from '@/src/context/ManagerContext';  
import { Eye, UserCog, UserRoundPlus } from "lucide-react";
import { Partner } from '@/src/types/partner';  
import { useState, useEffect } from 'react';
import SidebarRight from '../SidebarRight';

const TablePartner = () => {
  const { manager } = useManager();  

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);

  const partnersPerPage = 10;

  const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formType, setFormType] = useState<"addPartner" | "editPartner" | "viewPartner" | null>(null);
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

    const currentPartners = filteredPartners.slice(
    (currentPage - 1) * partnersPerPage,
    currentPage * partnersPerPage
  );

  useEffect(() => {
    if (manager) {
      const filtered = manager.partners.filter((partner: Partner) => {
        const lowerCaseSearch = searchQuery.toLowerCase();
  
        return (
          (partner.name && partner.name.toLowerCase().includes(lowerCaseSearch)) ||
          (partner.phone && partner.phone.toLowerCase().includes(lowerCaseSearch)) 
          
        );
      });
      setFilteredPartners(filtered);
    }
  }, [manager, searchQuery]);
  


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Обработчик для изменения поиска
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

    const toggleSidebar = (type: "addPartner" | "editPartner" | "viewPartner", partner?: Partner) => {
      setFormType(type);             
      setSelectedPartner(partner || null); 
      setSidebarOpen(prevState => !prevState);  
    };
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className='flex justify-between items-center'>
      <div className='flex items-center gap-3 mb-6 '>

        <h4 className="text-xl font-semibold text-black dark:text-white">
          Мои партнёры
        </h4>
        <UserRoundPlus color='green' onClick={() => toggleSidebar("addPartner")} className='cursor-pointer' />
        </div>
        <SidebarRight 
        sidebarROpen={sidebarOpen} 
        setSidebarROpen={setSidebarOpen} 
        formType={formType} 
        selectedPartner={selectedPartner} 
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Поиск по имени, телефону или услуге"
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
              Услуги
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

        {manager && currentPartners.map((partner, index) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${'border-b border-stroke dark:border-strokedark'}`}
            key={index}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                <Eye />
                <UserCog />
              </div>
              <p className="hidden text-black dark:text-white sm:block">{partner.name}</p>
            </div>

            <div className="flex items-center justify-start p-2.5 xl:p-5">
              <p className="text-black dark:text-white">
                {/* {partner.services.map((service) => (
                  <div key={service.id}>{service.name}</div>
                ))} */}
              </p>
            </div>

            <div className="flex items-center justify-start p-2.5 xl:p-5">
              <p className="text-meta-3">
                {partner.documents.map((document,index) => (
                  <div key={index}>{document.docType}</div>
                ))}
              </p>
            </div>

            <div className="hidden text-sm items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">
                {`${new Date(partner.createdAt).toLocaleDateString('ru-RU', {
                  day: '2-digit', month: 'long', year: '2-digit'
                })} / ${new Date(partner.updatedAt).toLocaleDateString('ru-RU', {
                  day: '2-digit', month: 'long', year: '2-digit'
                })}`}
              </p>
            </div>

            <div className="hidden items-center justify-end p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{partner.phone}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Пагинация */}
      {manager && filteredPartners.length > partnersPerPage && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-md"
          >
            Назад
          </button>
          <span className="mx-4 text-sm font-medium text-black dark:text-white">
            Страница {currentPage} из {Math.ceil(filteredPartners.length / partnersPerPage)}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredPartners.length / partnersPerPage)}
            className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-md"
          >
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
};

export default TablePartner;
