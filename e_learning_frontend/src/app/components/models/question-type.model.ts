import { Exam } from "./exam.model";

export class Question_Type {
    id?: number;
    type: string;
    exam: Exam[];

    constructor() {
        this.type = '';
        this.exam = [];
    }
}
