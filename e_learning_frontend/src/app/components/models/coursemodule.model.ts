export class CourseModule {
    id: number;
    name: string;
    createdAt?: number;
    file?: string;
  done: boolean;
  lessonId: number;
  courseId: number;
  
    constructor(id: number, name: string,lessonId: number,courseId: number, createdAt?: number, file?: string,done: boolean = true) {
      this.id = id;
      this.name = name;
      this.lessonId=lessonId;
      this.courseId=courseId;
      this.createdAt = createdAt;
      this.file = file;
      this.done=done;
    
    }
}