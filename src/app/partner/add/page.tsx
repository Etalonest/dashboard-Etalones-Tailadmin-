import AddpartnerForm from "@/src/components/forms/FormPartner/AddpartnerForm";
import { ProfessionProvider } from "@/src/context/ProfessionContext";

export default function Page() {
    return (
        <ProfessionProvider>
            <AddpartnerForm/>
        </ProfessionProvider>
    )
}