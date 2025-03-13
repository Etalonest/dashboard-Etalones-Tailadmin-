import { Eye, UserCog, UserRoundPlus } from "lucide-react";
import { Partner } from '@/src/types/partner';
import { useState, useEffect } from 'react';
import SidebarRight from '../SidebarRight';
import { usePartners } from '@/src/context/PartnerContext';
import { useSession } from '@/src/context/SessionContext';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import React from "react";


const TablePartner = () => {
  const { session } = useSession();
  const managerId = session?.managerId ?? 'defaultManagerId';
  const { partners } = usePartners();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const partnersPerPage = 10;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formType, setFormType] = useState<"addPartner" | "editPartner" | "viewPartner" | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]); // состояние для выбранных групп
  const groupedPartners = filteredPartners.reduce((acc, partner) => {
    const status = partner.status || "Без статуса";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(partner);
    return acc;
  }, {} as Record<string, Partner[]>);

  useEffect(() => {
    if (partners && Array.isArray(partners)) {
      const filtered = partners.filter((partner) => {
        const lowerCaseSearch = searchQuery.toLowerCase();
        return (
          (partner.name && partner.name.toLowerCase().includes(lowerCaseSearch)) ||
          (partner.phone && partner.phone.toLowerCase().includes(lowerCaseSearch))
        );
      });
      setFilteredPartners(filtered);
    }
  }, [searchQuery, partners]);

  // Обновляем фильтрацию на основе выбранных групп
  const handleGroupChange = (group: string, checked: boolean) => {
    if (checked) {
      setSelectedGroups((prev) => [...prev, group]);
    } else {
      setSelectedGroups((prev) => prev.filter((g) => g !== group));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const toggleSidebar = (type: "addPartner" | "editPartner" | "viewPartner", partner?: Partner) => {
    setFormType(type);
    setSelectedPartner(partner || null);
    setSidebarOpen((prevState) => !prevState);
  };

  // Фильтрация партнёров по выбранным группам
  const filteredByGroups = Object.keys(groupedPartners)
    .filter((group) => selectedGroups.includes(group))
    .reduce((acc, group) => {
      acc[group] = groupedPartners[group];
      return acc;
    }, {} as Record<string, Partner[]>);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 mb-6">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Мои партнёры
          </h4>
          <UserRoundPlus color="green" onClick={() => toggleSidebar("addPartner")} className="cursor-pointer" />
        </div>
        <SidebarRight
          sidebarROpen={sidebarOpen}
          setSidebarROpen={setSidebarOpen}
          formType={formType}
          selectedPartner={selectedPartner}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Групировать по статусам</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Статус</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.keys(groupedPartners).map((status, index) => (
              <DropdownMenuCheckboxItem
                key={index}
                checked={selectedGroups.includes(status)}
                onCheckedChange={(checked: boolean) => handleGroupChange(status, checked as boolean)}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Поиск по имени, телефону или услуге"
          className="mb-4 px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="flex flex-col">
        {Object.keys(filteredByGroups).map((status, index) => (
          <div key={index}>
            <h5 className="text-lg font-medium text-black dark:text-white mt-6">
              {status}
            </h5>

            <div className="grid grid-cols-4 rounded-sm bg-gray-2">
              <div className="p-2.5 xl:p-5">Имя</div>
              <div className="p-2.5 text-start xl:p-5">Профессии</div>
              <div className="hidden p-2.5 text-center sm:block xl:p-5">Добавлен/Обновлён</div>
              <div className="hidden p-2.5 text-end sm:block xl:p-5">Телефон</div>
            </div>

            {filteredByGroups[status].map((partner, partnerIndex) => (
              <div className="grid grid-cols-4" key={partnerIndex}>
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <Eye onClick={() => toggleSidebar("viewPartner", partner)} />
                    <UserCog onClick={() => toggleSidebar("editPartner", partner)} />
                  </div>
                  <div>
                    <p className="hidden text-black dark:text-white sm:block">{partner.name}</p>
                    <span>{partner.companyName}</span>
                  </div>
                </div>
                <div className="flex items-center justify-start p-2.5 xl:p-5">
                  <div className="text-meta-3">
                    {partner.professions.map((prof, index) => (
                      <div key={index}>{prof.name}</div>
                    ))}
                  </div>
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
        ))}
      </div>

      {/* Пагинация */}
      {managerId && filteredPartners.length > partnersPerPage && (
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
