'use client'
import CandidatesList from "@/src/components/CandidateList/CandidateList";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout"
import { useCandidates } from '@/src/context/CandidatesContext';

export default function Page() {
      const { candidates, isLoading, error } = useCandidates();
    
  return (
    <DefaultLayout>
        <CandidatesList />
    </DefaultLayout>
  );
}
