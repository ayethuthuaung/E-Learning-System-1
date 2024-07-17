  // question.model.ts
  export interface QuestionDto {
    id: number;
    content: string;
    marks: number;
    questionTypeId: number;
    answerList: AnswerOptionDto[];
  }

  export interface AnswerOptionDto {
    id: number;
    questionId: number;
    answer: string;
    isAnswered: boolean;
  }
