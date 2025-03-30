import { ApexOptions } from "apexcharts";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSession } from "@/src/context/SessionContext";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3", "#80CAEE"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: Array.from({ length: 31 }, (_, i) => (i + 1).toString()), // Дни месяца (1-31)
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
  },
};

const ChartCandAdded: React.FC = () => {
  // Состояние для данных графика
  const [series, setSeries] = useState([{ name: "Candidates Added", data: Array(31).fill(0) }]);
  // Состояние для выбранного месяца
  const [selectedMonth, setSelectedMonth] = useState("2025-01");

  // Получаем сессию, чтобы узнать ID и роль пользователя
  const { session } = useSession();
  const userId = session?.managerId; 
  const userRole = session?.managerRole; 

  // const fetchCandidatesData = async (month: string) => {
  //   try {
  //     const response = await fetch(`/api/apex/candidates?month=${month}&userId=${userId}&role=${userRole}`); // Запрос с информацией о пользователе
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch candidates data');
  //     }
  //     const data = await response.json();
  //     setSeries([{ name: "Candidates Added", data: data.candidateCounts }]);
  //   } catch (error) {
  //     console.error("Error fetching candidates data:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (userId && userRole) {
  //     fetchCandidatesData(selectedMonth);
  //   }
  // }, [selectedMonth, userId, userRole]);

  // const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedMonth(event.target.value);
  // };
  const fetchCandidatesData = useCallback(async (month: string) => {
    try {
      const response = await fetch(`/api/apex/candidates?month=${month}&userId=${userId}&role=${userRole}`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidates data');
      }
      const data = await response.json();
      setSeries([{ name: "Candidates Added", data: data.candidateCounts }]);
    } catch (error) {
      console.error("Error fetching candidates data:", error);
    }
  }, [userId, userRole]); // Зависимости: userId и userRole
  
  // useEffect с правильными зависимостями
  useEffect(() => {
    if (userId && userRole) {
      fetchCandidatesData(selectedMonth);
    }
  }, [selectedMonth, userId, userRole, fetchCandidatesData]); // Зависимости: selectedMonth, userId, userRole, fetchCandidatesData
  
  // Обработчик смены месяца
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Candidates Added</p>
              <p className="text-sm font-medium">{selectedMonth}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="month-select" className="text-sm font-medium text-primary mr-2">
          Select Month:
        </label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="2025-01">January 2025</option>
          <option value="2025-02">February 2025</option>
          <option value="2025-03">March 2025</option>
          <option value="2024-10">October 2024</option>
          <option value="2024-11">November 2024</option>
          {/* Добавьте другие месяцы, если необходимо */}
        </select>
      </div>

      <div>
        <div id="chartCandAdded" className="-ml-5">
          <ReactApexChart options={options} series={series} type="area" height={350} width={"100%"} />
        </div>
      </div>
    </div>
  );
};

export default ChartCandAdded;
