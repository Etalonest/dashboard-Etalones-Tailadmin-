// src/types/manager.ts
import { Candidate } from "./candidate";
// Тип для изображения менеджера
export interface ManagerImage {
    name: string;
    data: Buffer;
    // data: {
    //   base64: string;
    //   subType: string;
    // };
    contentType: string;
  }
  
  // Тип для кандидатов, партнеров, задач и других связанных сущностей
  export interface IdReference {
    stage: any;
    documents: any;
    id: number;
    professions: any;
    phone: any;
    name: any;
    $oid: string;
    candidates: Candidate[];
  }
  
  // Тип для контактов (телеграм, вайбер, whatsapp и email)
  export interface ManagerContact {
    telegram: string;
    viber: string;
    whatsapp: string;
    email: string;
  }
  
  // Основной тип для менеджера
  export interface Manager {
    allCandidates: any;
    _id?: IdReference;
    name?: string;
    phone?: string;
    image?: ManagerImage;
    telegram?: string;
    viber?: string;
    whatsapp?: string;
    email?: string;
    __v?: { $numberInt: string };
    candidates?: IdReference[];
    partners?: IdReference[];
    vacancy?: IdReference[];
    onSite?: boolean;
    tasks?: IdReference[];
    role?: string;
  }
  