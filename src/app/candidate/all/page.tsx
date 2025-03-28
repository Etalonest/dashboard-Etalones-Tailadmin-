import TestPage from "../../testPage/page";

export default function Page () {
    const data = {
        stageId: process.env.NEXT_PUBLIC_STAGE_ALL_CANDIDATES
    }
    return (
        <div>
            <TestPage data={data}/>
        </div>
    )
}