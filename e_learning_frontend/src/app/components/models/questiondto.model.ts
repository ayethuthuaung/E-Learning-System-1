// questiondto.model.ts

export interface QuestionDTO {
    id: number;
    content: string;
    questionTypeId: number; // Assuming this field is also needed
    answerList: AnswerOptionDTO[];
  }
  
  export interface AnswerOptionDTO {
    id: number;
    answer: string;
    isAnswered: boolean;
  }
  