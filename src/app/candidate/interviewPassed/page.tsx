'use client'
import { useSession } from "@/src/context/SessionContext";
import CandidatePage from "../page";
import { useManager } from "@/src/context/ManagerContext";
import { useState, useEffect } from "react";

export default function Page() {
  const stageId =  process.env.NEXT_PUBLIC_CANDIDATES_STAGE_INTERVIEW_SUCCESS
         const { session } = useSession();
         const { candidateFromInterview } = useManager();
         const [adminData, setAdminData] = useState([]);
         const [loading, setLoading] = useState(true);
     
         useEffect(() => {
             if (session?.managerRole === 'admin') {
                 const fetchData = async () => {
                     try {
                         const response = await fetch(`/api/candidate/stages?stageId=${stageId}`);
                         const data = await response.json();
                         setAdminData(data);
                     } catch (error) {
                         console.error("Ошибка загрузки данных для администратора:", error);
                     } finally {
                         setLoading(false);
                     }
                 };
                 fetchData();
             } else {
                 setLoading(false); 
             }
         }, [session?.managerRole]);
     
         const data = session?.managerRole === 'admin' ? adminData : candidateFromInterview;
     
         if (loading) {
             return <div>Загрузка...</div>; 
         }
     return (
         <div>
             <CandidatePage data={data}/>
         </div>
     )
}