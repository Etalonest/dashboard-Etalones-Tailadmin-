"use client";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchCandidates from "./SearchCandidate";
import SearchPartners from "./SearchPartner";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "candidate"; // По умолчанию "candidate"

  return (
    <div>
      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="candidate">Кандидат</TabsTrigger>
          <TabsTrigger value="partner">Партнёр</TabsTrigger>
        </TabsList>
        <TabsContent value="candidate">
          <SearchCandidates />
        </TabsContent>
        <TabsContent value="partner">
          <SearchPartners />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchPage;
