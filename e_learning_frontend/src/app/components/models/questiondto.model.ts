// questiondto.model.ts

import { MarksDTO } from "./marks.model";

export interface QuestionDTO {
    id: number;
    content: string;
    questionTypeId: number; // Assuming this field is also needed
    answerList: AnswerOptionDTO[];
    marksList: MarksDTO[]; // Add this line
  }
  
  export interface AnswerOptionDTO {
    id: number;
    answer: string;
    isAnswered: boolean;
  }
  