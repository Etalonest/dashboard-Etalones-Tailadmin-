'use client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
 import {Button} from "@/components/ui/button";
 import { useSession } from "@/src/context/SessionContext";
import { DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenu } from "@/components/ui/dropdown-menu";
import { useManager } from "@/src/context/ManagerContext";
import CandidatePage from "@/src/app/candidate/page";
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