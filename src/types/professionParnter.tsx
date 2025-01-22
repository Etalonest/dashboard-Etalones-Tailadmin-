export type ProfessionPartner = {
    id: number;
    name: string;
    location: string;
    skills: string;
    experience: string;
    place: number;
    salary: string;
    rentPrice: string;
    avans: string;
    workwear: string;
    drivePermis: string[];
    langue: string[];
    workHours: string;
    getStart: Date;
    candidates: string[]; // Здесь типы ObjectId, можно изменить на string для простоты
    interview: string[];
  };