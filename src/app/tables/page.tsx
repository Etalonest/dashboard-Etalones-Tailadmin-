'use client'
import Breadcrumb from "@/src/components/Breadcrumbs/Breadcrumb";
import TableThree from "@/src/components/Tables/TableThree";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
import { useState } from "react";
import TablePartner from "@/src/components/Tables/TablePartner";
import TableCandidate from "@/src/components/Tables/TableCandidaate";
import { ProfessionProvider } from "@/src/context/ProfessionContext";
import { useSession } from "next-auth/react";

const TablesPage = () => {
  const { data: session } = useSession();
  
  // Состояние для выбранной таблицы
  const [activeTable, setActiveTable] = useState("table1");

  // Функция для смены активной таблицы
  const handleTableChange = (table: string) => {
    setActiveTable(table);
  };
 
  return (
    <DefaultLayout>
      <ProfessionProvider>
      <Breadcrumb pageName="Tables" />

      <div className="mb-6">
        {/* Переключатель таблиц */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleTableChange("table1")}
            className={`px-4 py-2 rounded-md ${activeTable === "table1" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Кандидаты
          </button>
          <button
            onClick={() => handleTableChange("table2")}
            className={`px-4 py-2 rounded-md ${activeTable === "table2" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Пртнёры
          </button>
          <button
            onClick={() => handleTableChange("table3")}
            className={`px-4 py-2 rounded-md ${activeTable === "table3" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Вакансии
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {/* Условный рендеринг таблиц */}
        {activeTable === "table1" && <TableCandidate/>}
        {activeTable === "table2" && <TablePartner />}
        {activeTable === "table3" && <TableThree />}
      </div>
    
      </ProfessionProvider>
    </DefaultLayout>
  );
};

export default TablesPage;
