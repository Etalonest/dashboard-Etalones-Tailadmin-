// 'use client'
// import React, { useState, useEffect } from "react";
// import SearchResultsTable from "./SearchResultsTable"; 
// import SidebarRight from "../SidebarRight"; 

// interface SearchResult {
//   id: string;
//   name: string;
//   phone: string;
//   profession?: string;
//   type: "candidate" | "partner";
//   private?: boolean;
// }

// const Search = () => {
//   const [inputValue, setInputValue] = useState<string>(""); 
//   const [results, setResults] = useState<any[]>([]); 
//   const [isLoading, setIsLoading] = useState<boolean>(false); 
//   const [debouncedValue, setDebouncedValue] = useState<string>(""); 
//   const [sidebarOpen, setSidebarOpen] = useState(false); 
//   const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null); 
//   const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
//   const [formType, setFormType] = useState<"viewCandidate" | "viewPartner" | null>(null); 

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(event.target.value);
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedValue(inputValue); 
//     }, 500); 

//     return () => {
//       clearTimeout(timer);
//     };
//   }, [inputValue]);

//   useEffect(() => {
//     if (debouncedValue.trim() === "") {
//       setResults([]); 
//       return;
//     }

//     setIsLoading(true);

//     const queryParams = new URLSearchParams({ query: debouncedValue.trim() }).toString();

//     fetch(`/api/search?${queryParams}`)
//       .then((response) => response.json())
//       .then((data) => {
//         setResults(data.results || []); 
//       })
//       .catch((error) => {
//         console.error("Ошибка при получении результатов поиска:", error);
//         setResults([]); 
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }, [debouncedValue]);

//   const handleSelectResult = (result: SearchResult) => {
//     if (result.type === "candidate") {
//       setSelectedCandidate(result);  
//       setFormType("viewCandidate");  
//     } else if (result.type === "partner") {
//       setSelectedPartner(result);    
//       setFormType("viewPartner");    
//     }
//     setSidebarOpen(true);
//   };
  
  

//   return (
//     <div className="relative w-full">
//       <div className="relative w-full">
//         <input
//           type="text"
//           value={inputValue}
//           onChange={handleChange}
//           placeholder={isLoading ? "Загрузка..." : "Поиск..."}
//           className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
//         />
//       </div>

//       {results.length > 0 && (
//         <div
//           className="absolute w-max max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-lg z-10"
//           style={{ top: "100%", left: 0 }}
//         >
//           <SearchResultsTable results={results} onSelectResult={handleSelectResult} />
//         </div>
//       )}

//           <SidebarRight
//           sidebarROpen={sidebarOpen}
//           setSidebarROpen={setSidebarOpen}
//           selectedCandidate={formType === "viewCandidate" ? selectedCandidate : null} 
//           selectedPartner={formType === "viewPartner" ? selectedPartner : null} 
//           formType={formType} 
//         />

//     </div>
//   );
// };

// export default Search;
'use client';
import React, { useState, useEffect } from "react";
import SearchResultsTable from "./SearchResultsTable";
import SidebarRight from "../SidebarRight";
import { Candidate } from "@/src/types/candidate";
import { Partner } from "@/src/types/partner";

interface SearchResult {
  id: string;
  name: string;
  phone: string;
  profession?: string;
  type: "candidate" | "partner";
  private?: boolean;
}

const Search = () => {
  const [inputValue, setInputValue] = useState<string>(""); 
  const [results, setResults] = useState<SearchResult[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [debouncedValue, setDebouncedValue] = useState<string>(""); 
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null); 
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue); 
    }, 500); 

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  useEffect(() => {
    if (debouncedValue.trim() === "") {
      setResults([]); 
      return;
    }

    setIsLoading(true);

    const queryParams = new URLSearchParams({ query: debouncedValue.trim() }).toString();

    fetch(`/api/search?${queryParams}`)
      .then((response) => response.json())
      .then((data) => {
        setResults(data.results || []); 
      })
      .catch((error) => {
        console.error("Ошибка при получении результатов поиска:", error);
        setResults([]); 
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [debouncedValue]);

  const handleSelectResult = (result: any) => {
    if (result.type === "candidate") {
      setSelectedCandidate(result);  
    } else if (result.type === "partner") {
      setSelectedPartner(result);    
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative w-full">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={isLoading ? "Загрузка..." : "Поиск..."}
          className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
        />
      </div>

      {isLoading && (
        <div
          className="absolute w-max max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-lg z-10"
          style={{ top: "100%", left: 0 }}
        >
          {/* Можно отображать анимацию загрузки или текст "Поиск..." */}
          <p className="text-center p-4 text-sm text-gray-500">Поиск...</p>
        </div>
      )}

      {results.length > 0 && !isLoading && (
        <div
          className="absolute w-max max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-lg z-10"
          style={{ top: "100%", left: 0 }}
        >
          <SearchResultsTable results={results} onSelectResult={handleSelectResult} isSearching={false} />
        </div>
      )}

      {results.length === 0 && !isLoading && debouncedValue.trim() !== "" && (
        <div
          className="absolute w-max max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-lg z-10"
          style={{ top: "100%", left: 0 }}
        >
          <p className="text-center p-4 text-sm text-gray-500">Ничего не найдено</p>
        </div>
      )}

     
    </div>
  );
};

export default Search;
