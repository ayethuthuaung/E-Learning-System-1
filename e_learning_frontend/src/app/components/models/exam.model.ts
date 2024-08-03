// exam.model.ts

import { Question_Type } from "./question-type.model";
import { QuestionDto } from "./question.model";

export class Exam {
    id?: number;
    title: string;
    description: string;
    questions:QuestionDto[];
    questionTypes: Question_Type[]; // Ensure this is an array of Question_Type objects
    questionTypeList: number[];

    constructor() {
        this.title = '';
        this.description = '';
        this.questions=[];
        this.questionTypes = []; // Initialize as an empty array
        this.questionTypeList = []; // Initialize as an empty array
    }
}
