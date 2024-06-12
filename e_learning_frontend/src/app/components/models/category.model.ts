import { Course } from "./course.model";

export class Category {
    id?: number;
    name: string;
    deleted: boolean;
    courses: Course[];

    constructor() {
        
        this.name = '';
        this.deleted = false;
        this.courses = []; 
      }
}