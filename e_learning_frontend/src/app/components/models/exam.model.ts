// exam.model.ts

import { Question_Type } from "./question-type.model";

export class Exam {
    id?: number;
    title: string;
    description: string;
    questionTypes: Question_Type[]; // Ensure this is an array of Question_Type objects
    questionTypeList: number[];

    constructor() {
        this.title = '';
        this.description = '';
        this.questionTypes = []; // Initialize as an empty array
        this.questionTypeList = []; // Initialize as an empty array
    }
}
