'use client';
import Breadcrumb from "@/src/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
import { useState } from "react";
import TablePartner from "@/src/components/Tables/TablePartner";
import TableCandidate from "@/src/components/Tables/TableCandidate";
import { ProfessionProvider } from "@/src/context/ProfessionContext";
import { useSession } from "@/src/context/SessionContext";
import Vacancy from "@/src/components/Vacancy/Vacancy";
import { PartnerProvider } from "@/src/context/PartnerContext";

const TablesPage = () => {
  const { session } = useSession();
  
  // Переносим состояние за пределы условий
  const [activeTable, setActiveTable] = useState("table1");

  // Функция для смены активной таблицы
  const handleTableChange = (table: string) => {
    setActiveTable(table);
  };

  // Условный рендеринг для session должен быть до использования хука useState
  if (!session) {
    return <p>Пожалуйста, войдите в систему.</p>;
  }

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
                Партнеры
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
            {activeTable === "table1" && <TableCandidate />}
            {activeTable === "table2" && <TablePartner />}
            {activeTable === "table3" && <Vacancy />}
          </div>
      </ProfessionProvider>
    </DefaultLayout>
  );
};

export default TablesPage;
