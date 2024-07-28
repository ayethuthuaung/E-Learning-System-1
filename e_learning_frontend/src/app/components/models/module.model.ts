import { Lesson } from "./lesson.model";

export interface Module {

  id: number ;
fileType: string;
createdAt:number;
  name:string;
  file: string;
  fileInput:File | null;
  buttonText?: string;
  done: boolean;
  url: string;

}
