import React from "react";

const SearchResultsTable = ({ results }: { results: any[] }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {results.map((result, index) => (
        <div
          className="grid grid-cols-6 gap-4 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={index}
        >
          <div className="col-span-3 flex items-center">
            <p className="text-sm text-black dark:text-white truncate">{result.name}</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white truncate">{result.phone}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white truncate">
              {result.role === "candidate" ? "Кандидат" : "Партнёр"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultsTable;
