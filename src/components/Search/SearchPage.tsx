'use client';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import SearchCandidates from "./SearchCandidate";
import SearchPartners from "./SearchPartner";

const SearchPage = () => {


  return (
    <div>
     <Tabs defaultValue="candidate" >
     <TabsList className="grid w-full grid-cols-6 bg-slate-200">
        <TabsTrigger value="candidate" className="col-span-2">Кандидат</TabsTrigger>
        <TabsTrigger value="partner" className="col-span-2">Партнёр</TabsTrigger>
        {/* <TabsTrigger value="vacancy" className="col-span-2">Вакансия</TabsTrigger> */}

      </TabsList>
      <TabsContent value="candidate">
<SearchCandidates/>
      </TabsContent>
      <TabsContent value="partner">
<SearchPartners/>
      </TabsContent>
      {/* <TabsContent value="vacancy">
        <p>Vacancy</p>
      </TabsContent> */}
     </Tabs>
    </div>
  );
};

export default SearchPage;
