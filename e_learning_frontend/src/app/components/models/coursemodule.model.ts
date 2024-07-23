export class CourseModule {
    id: number;
    name: string;
    createdAt?: number;
    file?: string;
  done: boolean;
  
    constructor(id: number, name: string, createdAt?: number, file?: string,done: boolean = true) {
      this.id = id;
      this.name = name;
      this.createdAt = createdAt;
      this.file = file;
      this.done=done;
    }
}