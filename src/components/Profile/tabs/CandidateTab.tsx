'use client'

 import { useSession } from "@/src/context/SessionContext";
import { useManager } from "@/src/context/ManagerContext";
import CandidatesInterview from "../../CandidatesInterview/CandidatesInterview";

  export function CandidateTab() {
const { session } = useSession();
const { manager } = useManager();
const candidates = manager?.candidates || [];
if (session?.managerRole && ['recruiter', 'manager', 'admin'].includes(session.managerRole)) {

    return (
    <CandidatesInterview data={candidates} />
    )
  }
}