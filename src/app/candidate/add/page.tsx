import PEx from "@/src/components/forms/PEx/Pex"
import DefaultLayout from "@/src/components/Layouts/DefaultLayout"

export default function Page(){
    return (
        <DefaultLayout>
            <div className="w-[50vw]">
                <PEx/>
            </div>
        </DefaultLayout>
    )
}