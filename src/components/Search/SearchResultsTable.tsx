

// Тип для результата поиска
interface SearchResult {
  id: string;  // Уникальный идентификатор для каждого результата
  name: string;
  phone: string;
  type: "candidate" | "partner"; // Тип результата (кандидат или партнёр)
  profession?: string; // Профессия (если имеется)
}

interface SearchResultsProps {
  results: SearchResult[]; // Передаем массив результатов поиска
  onSelectResult: (result: SearchResult) => void; // Обработчик для выбора кандидата/партнёра
}

const SearchResultsTable: React.FC<SearchResultsProps> = ({ results, onSelectResult }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {results.length === 0 ? (
        <p className="text-center p-4 text-sm text-gray-500">Результаты не найдены</p>
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
