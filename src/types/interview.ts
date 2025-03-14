import { Candidate } from "./candidate";
import { Manager } from "./manager";
import { VacancyType } from "./vacancy";

export type InterviewType = {
    name: string;
    status: string;
    vacancy: VacancyType;
    manager: Manager;
    date: Date;
    comment: string;
    candidate: Candidate;
    createdAt: Date;
    updatedAt: Date;
}