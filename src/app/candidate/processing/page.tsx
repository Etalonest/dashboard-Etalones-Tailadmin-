import CandidatePage from "../page";

export default function Page () {
    const data =  process.env.NEXT_PUBLIC_STAGE_PROCESSING
    
    return (
        <div>
            <CandidatePage data={data}/>
        </div>
    )
}