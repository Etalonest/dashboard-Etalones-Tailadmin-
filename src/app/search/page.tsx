'use client'
import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
import SearchPage from "@/src/components/Search/SearchPage";
import { ProfessionProvider } from "@/src/context/ProfessionContext";

const Page = () => {
  return (
      <>
        <ProfessionProvider>
      <SearchPage/>
    </ProfessionProvider>
    </>
  );
};

export default Page;