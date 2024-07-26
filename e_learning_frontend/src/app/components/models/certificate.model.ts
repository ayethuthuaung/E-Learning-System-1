import { Course } from "./course.model";
import { User } from "./user.model";

export interface Certificate {
    id: number;
    user: User;
    course: Course;
    createdAt: number;
}