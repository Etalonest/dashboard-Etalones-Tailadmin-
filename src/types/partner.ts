import { Manager } from "./manager";

// Тип для профессии партнёра
export type Profession = {
    workHours: string;
    salary: string;
    location: string;
    pDocs: any;
    id: string;              // Идентификатор профессии
    name: string;            // Название профессии
    experience: string;      // Опыт работы
    _id: string;             // ID профессии в базе данных
  };
  
  // Тип для документа партнёра
  export type Document = {
    id: string;              // Идентификатор документа
    docType: string;         // Тип документа
    dateExp: string;         // Дата окончания действия (можно оставить пустым)
    numberDoc: string;       // Номер документа
    _id: string;             // ID документа в базе данных
  };
  
  // Тип для контракта партнёра
  export type Contract = {
    typeC: string;           // Тип контракта (например, "Почасовый")
    sum: string;             // Сумма контракта
    salaryWorker?: string;    // Зарплата работника
  };
  
  // Тип для языков (если партнёр предоставляет информацию о языке)
  export type Language = {
    name: string;            // Язык
    level: string;           // Уровень языка
  };
  
  // Тип для статуса партнёра
  export type StatusFromPartner = {
    status: string;          // Статус партнёра (например, "Думает над предложением")
    who: string;             // Кто поставил статус
  };
  
  // Тип для комментариев партнёра
  export type Comment = string[]; // Массив строк для комментариев
  
  // Тип для даты, которая используется в MongoDB (например, для createdAt и updatedAt)
  export type DateField = {
    $date: {
      $numberLong: string; // Строка, представляющая число в миллисекундах
    };
  };
 export type Vacancy = {
  homeImages: any[];
    image: any;
    documents: any[];
    urgently: boolean;
    last: boolean;
    onSite: boolean;
  id: any;
  _id: any;
  title: string;
  name: string;
  description: string;
  date: string;
  status: string;
  experience: string;
  skills: string;
  location: string;
  grafik: string;
  work_descr: string;
  home_descr: string;
  homePrice: string;
  roof_type: string;
  place: number;
  salary: string;
  rentPrice: string;
  avans: string;
  workwear: string;
  drivePermis: string[];
  langue: string[];
  workHours: string;
  getStart: Date;
  pDocs: string[];
  candidates: string[]; 
  interview: string[];
 }
  // Основной тип для партнёра
  export type Partner = {
    avatar: any;
    id: string;
    _id: string;               // ID партнёра
    professions: Profession[];  // Массив профессий партнёра
    name: string;              // Имя партнёра
    phone: string;             // Телефон партнёра
    email: string;             // Email партнёра
    site: string;              // Сайт партнёра
    companyName: string;       // Название компании
    workwear: {
      desc: string;            // Описание рабочей одежды
      stat: boolean;           // Статус
    };
    numberDE: string;          // Номер DE
    location: string;          // Локация партнёра
    manager: Manager;           // ID менеджера партнёра
    candidates: string[];      // Массив ID кандидатов
    contract: Contract;        // Контракт партнёра
    status: string;            // Статус партнёра
    comment: Comment;          // Массив комментариев
    documentsFile: string[];   // Массив файлов документов
    documents: Document[];     // Массив документов партнёра
    createdAt: any;      // Дата создания партнёра
    updatedAt: any;      // Дата обновления партнёра
    __v: number;               // Версия, используемая MongoDB
  };
  