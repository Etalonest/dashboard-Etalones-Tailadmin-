
interface SearchResult {
  id: string;  
  name: string;
  phone: string;
  type: "candidate" | "partner"; 
  profession?: string; // Профессия (если имеется)
}

interface SearchResultsProps {
  results: SearchResult[]; // Передаем массив результатов поиска
  onSelectResult: (result: SearchResult) => void; // Обработчик для выбора кандидата/партнёра
  isSearching: boolean; // Флаг, показывающий, идет ли поиск
}

const SearchResultsTable: React.FC<SearchResultsProps> = ({ results, onSelectResult, isSearching }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {isSearching ? (
        <p className="text-center p-4 text-sm text-gray-500">Поиск...</p> // Пока идет поиск
      ) : results.length === 0 ? (
        <p className="text-center p-4 text-sm text-gray-500">Ничего не найдено</p> // Если нет результатов
      ) : (
        results.map((result, index) => (
          <div
            className="grid grid-cols-6 gap-4 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={index}
            onClick={() => onSelectResult(result)} 
          >
            <div className="col-span-3 flex items-center">
              <p className="text-sm text-black dark:text-white truncate">{result.name}</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="text-sm text-black dark:text-white truncate">{result.phone}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white truncate">
                {result.type === "candidate" ? "Кандидат" : "Партнёр"}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResultsTable;
