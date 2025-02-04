export interface DriveOption {
    value: string;
    label: string;
  }
  export interface DocumentEntry {
  docType: string;
  dateExp: string;
  dateOfIssue: string;
  numberDoc: string;
  file?: File | null;
  }
  export interface File{
    _id?:any;
    name?: string;
    data?:string;
    contentType?: string;
  } 

  export interface CommentEntry {
    authorId: any;
    author?: string;
    text?: string;
    date: Date;
  }
  export interface Contract {
    typeC: string;
    sum: string;
    salaryWorker?: string;
  }
  export interface Profession {
     name: string; 
     expirience: string; 
     category: string; 
}
  export interface Langue {
    name: string;
    level: string;
  }