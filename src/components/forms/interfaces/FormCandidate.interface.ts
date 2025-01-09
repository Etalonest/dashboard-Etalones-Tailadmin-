export interface DriveOption {
    value: string;
    label: string;
  }
  export interface DocumentEntry {
    docType: string;
    dateExp: string;
    dateOfIssue: string;
    numberDoc: string;
    file: any;
  }
  export interface Comment {
    authorId: Object;
    author: string;
    text: string;
    date: Date;
  }
  export interface Profession {
    level: string; name: string; experience: string; category: string; 
}
  export interface Language {
    name: string;
    level: string;
  }