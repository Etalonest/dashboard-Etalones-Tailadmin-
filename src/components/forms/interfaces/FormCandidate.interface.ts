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
    author: string;
    text: string;
    date: Date;
  }
  export interface Profession { name: string; experience: string }
  export interface Language {
    name: string;
    level: string;
  }