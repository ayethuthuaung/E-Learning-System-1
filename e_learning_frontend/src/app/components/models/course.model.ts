import { Category } from "./category.model";

export class Course {
    id?: number;
    name: string;
    level: string;
    duration: string;
    description: string;
    categories: Category[];
    categorylist:number[];
    certificate?: string;
    badge?: string;
    deleted?: boolean;
  
    constructor() {
      this.name = '';
      this.level = '';
      this.duration = '';
      this.description = '';
      this.categories = [];
      this.certificate = '';
      this.badge = '';
      this.deleted = false;
      this.categorylist=[]
    }
    
    
    }
