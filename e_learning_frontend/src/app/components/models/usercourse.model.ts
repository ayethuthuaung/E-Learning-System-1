import { User } from './user.model';
import { Course } from './course.model';

export class UserCourse {
  id: number;
  userId: number;
  courseId: number;
 
 
  user?: User; 
  course?: Course; 

  constructor() {
    this.id = 0;
    this.userId = 0;
    this.courseId = 0;
    
    
  }
}
