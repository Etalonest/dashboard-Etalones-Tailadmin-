'use client'
import CandidatesInterview from "@/src/components/CandidatesInterview/CandidatesInterview";
import { useManager } from "@/src/context/ManagerContext";
export default function Page() {
    const { candidateFromInterview } = useManager();
    const data = candidateFromInterview;
    console.log("DATA", data);
     return (
         <div>
             <CandidatesInterview data={data || []}/>
         </div>
     )
}