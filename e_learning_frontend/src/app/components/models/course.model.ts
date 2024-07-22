import { User } from './user.model';
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
  photo?: string;
  userId: number;
  status: string;
  user: User | undefined;
  instructorName: string;
  instructorId: number; // Added property
  chatRoomId: number; // Added property

  acceptedAt: number;
  createdAt: number;

  createdDate: string;
  completion: any;
  showDetails: any;
 
  

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
    this.userId = 1;
    this.status ='';
    this.instructorId = 1; // Initialized property
    this.chatRoomId = 1; // Initialized property

    this.instructorName='';

    this.createdDate = '';
    this.createdAt = 0;
    this.acceptedAt = 0;

  }
}
