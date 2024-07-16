import { ExamList } from "./examList.model";
import { Module } from "./module.model";


export interface Lesson {
    id: number;
 courseId:number;
  title:string;
  file:string;
 modules:Module[];
 fileType: string; 
 examListDto: ExamList;
}
