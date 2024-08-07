import { Course } from "./course.model";

export class Category {
   
    id: number;
    name: string;
    deleted: boolean;
    courses: Course[];
    instructorName: string;
    createdBy: string;
    checked?: boolean; // Add this property


    constructor() {
        this.id=0
        this.name = '';
        this.deleted = false;
        this.courses = []; 
        this.instructorName = '';
        this.createdBy = '';
        
      }
}