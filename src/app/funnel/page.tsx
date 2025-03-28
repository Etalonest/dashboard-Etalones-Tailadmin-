'use client'
import  CandidatesInWork  from "@/src/components/CandidatesInWork/CandidatesInWork";
import { AllCandidatesProvider } from "@/src/context/AllCandidatesContext";

export default function Page() {
  return (
    <>
        <AllCandidatesProvider>
<CandidatesInWork />
    </AllCandidatesProvider>
    </>
  );
}