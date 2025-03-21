'use client'
import CandidatesList from "@/src/components/CandidateList/CandidateList";
import PEx from "@/src/components/forms/PEx/Pex";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout"

export default function Page() {
    
  return (
    <DefaultLayout>
      <PEx/>
        {/* <CandidatesList /> */}
    </DefaultLayout>
  );
}
