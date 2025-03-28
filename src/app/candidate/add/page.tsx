import AddCandidateForm from "@/src/components/forms/FormCandidate/AddCandidateForm"
import PEx from "@/src/components/forms/PEx/Pex"
import DefaultLayout from "@/src/components/Layouts/DefaultLayout"
import { ProfessionProvider } from "@/src/context/ProfessionContext"
import Profession from "@/src/models/Profession"

export default function Page(){
    return (
        <ProfessionProvider>
            <div className="">
                <PEx/>
                <AddCandidateForm/>
            </div>
            </ProfessionProvider>
    )
}