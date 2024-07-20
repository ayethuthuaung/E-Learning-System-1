import { Lesson } from "./lesson.model";

export interface Module {

  id: number ;
fileType: string;

  name:string;
  file: string;
  fileInput:File | null;
  buttonText?: string;
  done: boolean;

}
