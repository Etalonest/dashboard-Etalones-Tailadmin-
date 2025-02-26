'use client'
import  CandidatesInWork  from "@/src/components/CandidatesInWork/CandidatesInWork";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout"
import { AllCandidatesProvider } from "@/src/context/AllCandidatesContext";
import UploadForm from "@/src/components/UploadForm/UploadForm";
import FileManager from "@/src/lib/firebase/FileManager";

export default function Page() {
  return (
    <DefaultLayout>
        <AllCandidatesProvider>
{/* <CandidatesInWork /> */}
<FileManager />
    </AllCandidatesProvider>
    </DefaultLayout>
  );
}