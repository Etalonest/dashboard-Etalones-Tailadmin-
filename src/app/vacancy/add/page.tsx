'use client'
import AddVacancyForm from "@/src/components/forms/VacancyForm/AddVacancyForm";
import { ManagerProvider, useManager } from "@/src/context/ManagerContext";
export default function Page() {
    const { partners } = useManager();
        return (

        <ManagerProvider>
            <AddVacancyForm partners={partners } />
            </ManagerProvider>
    )
}