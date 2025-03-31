import CandidatePage from "../../page"; 

const STAGE_MAP: Record<string, string> = {
  all: process.env.NEXT_PUBLIC_CANDIDATES_STAGE_ALL_CANDIDATES!,
  new: process.env.NEXT_PUBLIC_CANDIDATES_STAGE_NEW!,
  processing: process.env.NEXT_PUBLIC_CANDIDATES_STAGE_PROCESSING!,
  interview: process.env.NEXT_PUBLIC_CANDIDATES_STAGE_ON_INTERVIEW!,
  interviewPassed: process.env.NEXT_PUBLIC_CANDIDATES_STAGE_INTERVIEW_SUCCESS!,
  interviewRejected: process.env.NEXT_PUBLIC_CANDIDATES_STAGE_REJECTED!,
  onObject: process.env.NEXT_PUBLIC_CANDIDATES_STAGE_ON_OBJECT!,
  deleted: process.env.NEXT_PUBLIC_CANDIDATES_STAGE_DELETED!,
};
export default function Page({ params }: { params: { stage: string } }) {
  const stageId = STAGE_MAP[params.stage];

  if (!stageId) {
    return <div>Ошибка: Неизвестный этап</div>;
  }

  return <CandidatePage data={stageId} />;
}