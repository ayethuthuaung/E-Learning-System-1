import { Category } from "./category.model";

export class Course {
  id: number;
  name: string;
  level: string;
  duration: string;
  description: string;
  categories: Category[];
  categorylist: number[];
  certificate?: string;
  badge?: string;
  deleted?: boolean;
  photoFile?: File;
  photoUrl?: string;
  completion: any;
photo: any;

  constructor() {
    this.id = 1;
    this.name = '';
    this.level = '';
    this.duration = '';
    this.description = '';
    this.categories = [];
    this.certificate = '';
    this.badge = '';
    this.deleted = false;
    this.categorylist = [];
    this.photoFile = undefined;
  }
}
