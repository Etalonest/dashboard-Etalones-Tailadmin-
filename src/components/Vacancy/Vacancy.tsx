'use client'
import { Eye, Plus, Settings } from "lucide-react";
import { Partner } from '@/src/types/partner';
import { useState, useEffect, useCallback, } from 'react';
import SidebarRight from '@/src/components/SidebarRight';
import { usePartners } from '@/src/context/PartnerContext';
import { useSession } from 'next-auth/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProfessionPartner } from "@/src/types/professionParnter";
import { VacancyType } from "@/src/types/vacancy";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const Vacancy = () => {

  const { data: session } = useSession();
  const managerId = session?.managerId ?? 'defaultManagerId';
  const { partners, loadPartners } = usePartners();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const partnersPerPage = 10;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formType, setFormType] = useState<"addVacancy" | "editVacancy" | "viewVacancy" | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedProfession, setSelectedProfession] = useState<ProfessionPartner | null>(null);
  const [selectedVacancy, setSelectedVacancy] = useState<VacancyType | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]); // для выбранных групп

  const currentPartners = filteredPartners.slice(
    (currentPage - 1) * partnersPerPage,
    currentPage * partnersPerPage
  );
  const groupedPartners = filteredPartners.reduce((acc, partner) => {
    const status = partner.status || "Без статуса";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(partner);
    return acc;
  }, {} as Record<string, Partner[]>);
  const fetchVacancy = async (vacancyId: string) => {
    try {
      const response = await fetch(`/api/vacancy/${vacancyId}`);
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные вакансии');
      }

      const vacancy = await response.json();
      return vacancy;
    } catch (error) {
      console.error('Ошибка при загрузке вакансии:', error);
    }
  };

  useEffect(() => {
    if (managerId && partners.length === 0) {
      loadPartners(managerId);
    }
  }, [managerId, loadPartners, partners.length]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const toggleSidebar = useCallback(
    (type: "addVacancy" | "editVacancy" | "viewVacancy", partner?: Partner, profession?: ProfessionPartner, vacancy?: VacancyType) => {
      setFormType(type);
      setSelectedPartner(partner || null);
      setSelectedProfession(profession || null);
      setSelectedVacancy(vacancy || null);
      setSidebarOpen(prevState => !prevState);
    },
    []
  );
  const handleEditVacancy = async (partner: Partner, profession: any) => {
    const vacancyId = profession;

    if (!vacancyId) {
      console.log("Вакансия не найдена для редактирования.");
      return;
    }

    console.log("Vacancy ID from profession:", vacancyId);

    const vacancy = await fetchVacancy(vacancyId);

    if (!vacancy) {
      console.log("Вакансия с таким ID не найдена!");
      return;
    }

    console.log("Vacancy found:", vacancy);

    toggleSidebar("editVacancy", partner, profession, vacancy);
  };
  const handleViewVacancy = async (partner: Partner, profession: any) => {
    const vacancyId = profession;

    if (!vacancyId) {
      console.log("Вакансия не найдена для редактирования.");
      return;
    }

    console.log("Vacancy ID from profession:", vacancyId);

    const vacancy = await fetchVacancy(vacancyId);

    if (!vacancy) {
      console.log("Вакансия с таким ID не найдена!");
      return;
    }

    console.log("Vacancy found:", vacancy);

    toggleSidebar("viewVacancy", partner, profession, vacancy);
  };

  const handleGroupChange = (group: string, checked: boolean) => {
    if (checked) {
      setSelectedGroups((prev) => [...prev, group]);
    } else {
      setSelectedGroups((prev) => prev.filter((g) => g !== group));
    }
  };
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3 mb-6 '>

          <h4 className="text-xl font-semibold text-black dark:text-white">
            Мои Вакансии
          </h4>
        </div>
        <SidebarRight
          sidebarROpen={sidebarOpen}
          setSidebarROpen={setSidebarOpen}
          formType={formType}
          selectedPartner={selectedPartner}
          selectedProfession={selectedProfession}
          selectedVacancy={selectedVacancy}
        />
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="px-4 py-2 border rounded-md">Группировать по статусу</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Выберите статус</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.keys(groupedPartners).map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={selectedGroups.includes(status)}
                onCheckedChange={(checked: boolean) => handleGroupChange(status, checked)}
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
          className="mb-4 px-4 py-2  border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="grid grid-cols-5 gap-2">
            <TableHead>Заказчик</TableHead>
            <TableHead>Свободные места</TableHead>
            <TableHead className="text-right">На собеседовании</TableHead>
            <TableHead className="text-right">Документы</TableHead>
            <TableHead className="text-right">Вакансия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {Object.keys(groupedPartners).filter(status => selectedGroups.includes(status)).map((status) => (
            <div
              // className={`grid grid-cols-3 sm:grid-cols-5 ${'border-b border-stroke dark:border-strokedark'}`}
              key={status}
            >
                            {groupedPartners[status].map((partner, index) => (
                              <TableRow key={index} className="grid grid-cols-5 gap-2">
              <TableCell>
                <div className="flex ">
                  <p className="hidden text-black dark:text-white sm:block">{partner.companyName || 'Не указано'}</p>
                </div>
                <p className="hidden text-black text-md font-bold dark:text-white sm:block">{partner.name}</p>
              </TableCell>
              <TableCell>
                <div className="w-full h-[50px] border border-stroke dark:border-strokedark">

                </div>
              </TableCell>
              <TableCell className="text-right">
                {partner.professions.map((p, index) => (
                  <div className="py-2" key={index}>{p.name}</div>
                ))}
              </TableCell>
              <TableCell className="text-right">
                {partner?.professions?.map((profession, index) => (
                  profession.pDocs?.map((doc: string, docIndex: number) => (
                    <div className="text-end" key={`${index}-${docIndex}`}>{doc}</div>
                  ))
                ))}
              </TableCell>
              <TableCell>

                <div className="flex flex-col gap-2 items-end my-auto">
                  {partner.professions.map((profession: any, index: any) => (
                    <div className="py-2 text-right" key={index}>
                      <span className="font-bold ">{profession.name}</span>
                      <div className="flex gap-2 justify-end">
                        <button className={`text-${profession.vacancy ? 'gray-500' : 'green-500'} ${profession.vacancy ? 'cursor-not-allowed' : ''}`}
                          onClick={() => toggleSidebar("addVacancy", partner, profession)}
                          disabled={profession.vacancy}><Plus /></button>
                        <button
                          className={`text-${profession.vacancy ? 'green-500' : 'gray-500'} ${profession.vacancy ? '' : 'cursor-not-allowed'}`}
                          onClick={() => handleEditVacancy(partner, profession.vacancy)}
                          disabled={!profession.vacancy}
                        ><Settings /></button>
                        <button
                          className={`text-${profession.vacancy ? 'green-500' : 'gray-500'} ${profession.vacancy ? '' : 'cursor-not-allowed'}`}
                          onClick={() => handleViewVacancy(partner, profession.vacancy)}
                          disabled={!profession.vacancy}
                        ><Eye /></button>


                      </div>
                    </div>
                  ))}

                </div>
              </TableCell>
              </TableRow>
                            ))}
            </div>
          ))}
        </TableBody>
      </Table>

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

export default Vacancy;
