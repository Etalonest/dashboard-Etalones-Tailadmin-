import { Candidate } from "./candidate";
import { Manager } from "./manager";
import { VacancyType } from "./vacancy";

export type Events = {
    eventType: string;
    relatedId: Candidate;
    vacancy: VacancyType;
    comment: string;
    date: string;
    responsible: Manager;
    appointed: Manager;
    manager: Manager;
    description: string;
    status: string;
    _id: string;
  };
  
  