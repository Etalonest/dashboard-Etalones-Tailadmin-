'use client'
import  CandidatesInWork  from "@/src/components/CandidatesInWork/CandidatesInWork";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout"
import { AllCandidatesProvider } from "@/src/context/AllCandidatesContext";
export default function Page() {
  return (
    <DefaultLayout>
        <AllCandidatesProvider>
<CandidatesInWork />
    </AllCandidatesProvider>
    </DefaultLayout>
  );
}