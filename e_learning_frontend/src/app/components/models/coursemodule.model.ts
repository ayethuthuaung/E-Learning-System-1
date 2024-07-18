export class CourseModule {
    id: number;
    name: string;
    createdAt?: number;
    file?: string;
  
    constructor(id: number, name: string, createdAt?: number, file?: string) {
      this.id = id;
      this.name = name;
      this.createdAt = createdAt;
      this.file = file;
    }
}