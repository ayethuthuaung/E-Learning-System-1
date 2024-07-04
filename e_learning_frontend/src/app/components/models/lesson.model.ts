import { Module } from "./module.model";


export interface Lesson {
 courseId:number;
  title:string;
  file:string;
 modules:Module[];
 fileType: string; 
}
