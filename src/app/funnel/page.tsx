'use client'
import  CandidatesInWork  from "@/src/components/CandidatesInWork/CandidatesInWork";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout"
import { AllCandidatesProvider } from "@/src/context/AllCandidatesContext";
import UploadForm from "@/src/components/UploadForm/UploadForm";

export default function Page() {
  return (
    <DefaultLayout>
        <AllCandidatesProvider>
{/* <CandidatesInWork /> */}
<UploadForm />
    </AllCandidatesProvider>
    </DefaultLayout>
  );
}