// 'use client'
// import { Eye, Plus, Settings } from "lucide-react";
// import { Partner } from '@/src/types/partner';
// import { useState } from 'react';
// import {useSidebar} from '@/src/context/SidebarContext';
// import { useSession } from '@/src/context/SessionContext';
// import { useManager } from "@/src/context/ManagerContext";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { VacancyType } from "@/src/types/vacancy";
// import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import SidebarRight from "../SidebarRight";
// const Vacancy = () => {

//   const { session } = useSession();
//   const { manager } = useManager(); 

//   const managerId = session?.managerId ?? 'defaultManagerId';
//   const {
//     setSidebarROpen,
//     setFormType,
//     setSelectedVacancy,
//   } = useSidebar();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
//   const partnersPerPage = 10;

//   const [selectedGroups, setSelectedGroups] = useState<string[]>([]); // для выбранных групп


//   const groupedPartners = filteredPartners.reduce((acc, partner) => {
//     const status = partner.status || "Без статуса";
//     if (!acc[status]) {
//       acc[status] = [];
//     }
//     acc[status].push(partner);
//     return acc;
//   }, {} as Record<string, Partner[]>);
//   const fetchVacancy = async (vacancyId: string) => {
//     try {
//       const response = await fetch(`/api/vacancy/${vacancyId}`);
//       if (!response.ok) {
//         throw new Error('Не удалось загрузить данные вакансии');
//       }

//       const vacancy = await response.json();
//       return vacancy;
//     } catch (error) {
//       console.error('Ошибка при загрузке вакансии:', error);
//     }
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(event.target.value);
//   };
  
//   const handleEditVacancy = async (partner: Partner, profession: any) => {
//     const vacancyId = profession;

//     if (!vacancyId) {
//       console.log("Вакансия не найдена для редактирования.");
//       return;
//     }

//     console.log("Vacancy ID from profession:", vacancyId);

//     const vacancy = await fetchVacancy(vacancyId);

//     if (!vacancy) {
//       console.log("Вакансия с таким ID не найдена!");
//       return;
//     }

//     console.log("Vacancy found:", vacancy);

//   };
//   const handleViewVacancy = async (partner: Partner, profession: any) => {
//     const vacancyId = profession;

//     if (!vacancyId) {
//       console.log("Вакансия не найдена для редактирования.");
//       return;
//     }

//     console.log("Vacancy ID from profession:", vacancyId);

//     const vacancy = await fetchVacancy(vacancyId);

//     if (!vacancy) {
//       console.log("Вакансия с таким ID не найдена!");
//       return;
//     }

//     console.log("Vacancy found:", vacancy);

//     // toggleSidebar("viewVacancy", partner, profession, vacancy);
//   };

//   const handleGroupChange = (group: string, checked: boolean) => {
//     if (checked) {
//       setSelectedGroups((prev) => [...prev, group]);
//     } else {
//       setSelectedGroups((prev) => prev.filter((g) => g !== group));
//     }
//   };
//  const toggleSidebar = (type: 'addVacancy' | 'editVacancy' | 'viewVacancy', vacancy?: VacancyType) => {
//      setFormType(type);
//      setSelectedVacancy(vacancy || null);
//      setSidebarROpen(true); // Открытие сайдбара
//    };
//   return (
//     <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//       <div className='flex justify-between items-center'>
//         <div className='flex items-center gap-3 mb-6 '>

//           <h4 className="text-xl font-semibold text-black dark:text-white">
//             Мои Вакансии
//           </h4>
//         </div>
//         <SidebarRight
//         />
//          <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <button className="px-4 py-2 border rounded-md">Группировать по статусу</button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent>
//             <DropdownMenuLabel>Выберите статус</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             {Object.keys(groupedPartners).map((status) => (
//               <DropdownMenuCheckboxItem
//                 key={status}
//                 checked={selectedGroups.includes(status)}
//                 onCheckedChange={(checked: boolean) => handleGroupChange(status, checked)}
//               >
//                 {status}
//               </DropdownMenuCheckboxItem>
//             ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={handleSearchChange}
//           placeholder="Поиск по имени, телефону или услуге"
//           className="mb-4 px-4 py-2  border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
//         />
//       </div>

//       <Table>
//         <TableHeader>
//           <TableRow className="grid grid-cols-5 gap-2">
//             <TableHead>Заказчик</TableHead>
//             <TableHead>Свободные места</TableHead>
//             <TableHead className="text-right">На собеседовании</TableHead>
//             <TableHead className="text-right">Документы</TableHead>
//             <TableHead className="text-right">Вакансия</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//         {Object.keys(groupedPartners).filter(status => selectedGroups.includes(status)).map((status) => (
//             <div
//               // className={`grid grid-cols-3 sm:grid-cols-5 ${'border-b border-stroke dark:border-strokedark'}`}
//               key={status}
//             >
//                             {groupedPartners[status].map((partner, index) => (
//                               <TableRow key={index} className="grid grid-cols-5 gap-2">
//               <TableCell>
//                 <div className="flex ">
//                   <p className="hidden text-black dark:text-white sm:block">{partner.companyName || 'Не указано'}</p>
//                 </div>
//                 <p className="hidden text-black text-md font-bold dark:text-white sm:block">{partner.name}</p>
//               </TableCell>
//               <TableCell>
//                 <div className="w-full h-[50px] border border-stroke dark:border-strokedark">

//                 </div>
//               </TableCell>
//               <TableCell className="text-right">
//                 {partner.professions.map((p, index) => (
//                   <div className="py-2" key={index}>{p.name}</div>
//                 ))}
//               </TableCell>
//               <TableCell className="text-right">
//                 {partner?.professions?.map((profession, index) => (
//                   profession.pDocs?.map((doc: string, docIndex: number) => (
//                     <div className="text-end" key={`${index}-${docIndex}`}>{doc}</div>
//                   ))
//                 ))}
//               </TableCell>
//               <TableCell>

//                 <div className="flex flex-col gap-2 items-end my-auto">
//                   {partner.professions.map((profession: any, index: any) => (
//                     <div className="py-2 text-right" key={index}>
//                       <span className="font-bold ">{profession.name}</span>
//                       <div className="flex gap-2 justify-end">
//                         <button className={`text-${profession.vacancy ? 'gray-500' : 'green-500'} ${profession.vacancy ? 'cursor-not-allowed' : ''}`}
//                           onClick={() => toggleSidebar("addVacancy", partner, profession)}
//                           disabled={profession.vacancy}><Plus /></button>
//                         <button
//                           className={`text-${profession.vacancy ? 'green-500' : 'gray-500'} ${profession.vacancy ? '' : 'cursor-not-allowed'}`}
//                           onClick={() => handleEditVacancy(partner, profession.vacancy)}
//                           disabled={!profession.vacancy}
//                         ><Settings /></button>
//                         <button
//                           className={`text-${profession.vacancy ? 'green-500' : 'gray-500'} ${profession.vacancy ? '' : 'cursor-not-allowed'}`}
//                           onClick={() => handleViewVacancy(partner, profession.vacancy)}
//                           disabled={!profession.vacancy}
//                         ><Eye /></button>


//                       </div>
//                     </div>
//                   ))}

//                 </div>
//               </TableCell>
//               </TableRow>
//                             ))}
//             </div>
//           ))}
//         </TableBody>
//       </Table>

//       {/* Пагинация */}
//       {managerId && filteredPartners.length > partnersPerPage && (
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-md"
//           >
//             Назад
//           </button>
//           <span className="mx-4 text-sm font-medium text-black dark:text-white">
//             Страница {currentPage} из {Math.ceil(filteredPartners.length / partnersPerPage)}
//           </span>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === Math.ceil(filteredPartners.length / partnersPerPage)}
//             className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-md"
//           >
//             Вперёд
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Vacancy;
'use client'
import { Eye, Plus, Settings } from "lucide-react";
import { Partner } from '@/src/types/partner';
import { useState } from 'react';
import { useSidebar } from '@/src/context/SidebarContext';
import { useSession } from '@/src/context/SessionContext';
import { useManager } from "@/src/context/ManagerContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SidebarRight from "../SidebarRight";

const Vacancy = () => {
  const { session } = useSession();
  const { manager } = useManager(); // Получаем данные менеджера
  const { partners = [] } = manager || {}; // Достаем партнеров из менеджера, если они есть
  console.log("PARTNERSSS#@#@",partners)
  const managerId = session?.managerId ?? 'defaultManagerId';
  
  const {
    setSidebarROpen,
    setFormType,
    setSelectedProfession,
    setSelectedPartner,
    setSelectedVacancy
  } = useSidebar();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]); // для выбранных групп
  const partnersPerPage = 10;

  // Группировка партнеров по статусу
  const groupedPartners = partners.reduce((acc, partner) => {
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Функция редактирования вакансии
  const handleEditVacancy = async (partner: Partner, professionId: string) => {
    if (!professionId) {
      console.log("Вакансия не найдена для редактирования.");
      return;
    }

    const vacancy = await fetchVacancy(professionId);

    if (!vacancy) {
      console.log("Вакансия с таким ID не найдена!");
      return;
    }

    console.log("Vacancy found:", vacancy);
    toggleSidebar("editVacancy", vacancy);
  };

  // Функция для просмотра вакансии
  const handleViewVacancy = async (partner: Partner, professionId: string) => {
    if (!professionId) {
      console.log("Вакансия не найдена для просмотра.");
      return;
    }

    const vacancy = await fetchVacancy(professionId);

    if (!vacancy) {
      console.log("Вакансия с таким ID не найдена!");
      return;
    }

    console.log("Vacancy found:", vacancy);
    toggleSidebar("viewVacancy", vacancy);
  };

  const toggleSidebar = (type: 'addVacancy' | 'editVacancy' | 'viewVacancy', profession?: any, partner?: any, vacancy?: any) => {
    console.log("Selected Profession:аномалия", profession);
    console.log("Selected Partner:аномалия", partner);
    console.log("Selected Vacancy:аномалия", vacancy);
    setFormType(type);
    setSelectedProfession(profession || null); // Передаем профессию в правильный контекст
    setSelectedPartner(partner || null); // Передаем партнёра в правильный контекст
    setSelectedVacancy(vacancy || null); // Передаем вакансию в правильный контекст
    setSidebarROpen(true); // Открытие сайдбара
};

  
  
  // Изменение выбранной группы
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
        <div className='flex items-center gap-3 mb-6'>
          <h4 className="text-xl font-semibold text-black dark:text-white">Мои Вакансии</h4>
        </div>
        <SidebarRight />
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
          className="mb-4 px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
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
            <div key={status}>
              {groupedPartners[status].map((partner, index) => (
                <TableRow key={index} className="grid grid-cols-5 gap-2">
                  <TableCell>
                    <div className="flex ">
                      <p className="hidden text-black dark:text-white sm:block">{partner.companyName || 'Не указано'}</p>
                    </div>
                    <p className="hidden text-black text-md font-bold dark:text-white sm:block">{partner.name}</p>
                  </TableCell>
                  <TableCell>
                    <div className="w-full h-[50px] border border-stroke dark:border-strokedark"></div>
                  </TableCell>
                  <TableCell className="text-right">
                    {partner.professions.map((profession, index) => (
                      <div className="py-2" key={index}>{profession.name}</div>
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
                      {partner.professions.map((profession, index) => (
                        <div className="py-2 text-right" key={index}>
                          <span className="font-bold ">{profession.name}</span>
                          <div className="flex gap-2 justify-end">
                          <button
  className={`text-${profession.vacancy ? 'gray-500' : 'green-500'} ${profession.vacancy ? 'cursor-not-allowed' : ''}`}
  // onClick={() => toggleSidebar("addVacancy", profession)}  
  onClick={() => toggleSidebar("addVacancy", partner, profession)}  
  disabled={profession.vacancy}
><Plus />
</button>
                            <button
                              className={`text-${profession.vacancy ? 'green-500' : 'gray-500'} ${profession.vacancy ? '' : 'cursor-not-allowed'}`}
                              onClick={() => toggleSidebar("editVacancy", profession, partner, profession.vacancy)}  
                              disabled={!profession.vacancy}
                            ><Settings />
                            </button>
                            <button
                              className={`text-${profession.vacancy ? 'green-500' : 'gray-500'} ${profession.vacancy ? '' : 'cursor-not-allowed'}`}
                              onClick={() => handleViewVacancy(partner, profession.vacancy)}
                              disabled={!profession.vacancy}
                            ><Eye />
                            </button>
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
      {managerId && partners.length > partnersPerPage && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-md"
          >
            Назад
          </button>
          <span className="mx-4 text-sm font-medium text-black dark:text-white">
            Страница {currentPage} из {Math.ceil(partners.length / partnersPerPage)}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(partners.length / partnersPerPage)}
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
