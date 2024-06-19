// question.model.ts
export interface QuestionDTO {
  id: number;
  content: string;
  questionTypeId: number;
  answerList: AnswerOptionDTO[];
}

export interface AnswerOptionDTO {
  id: number;
  answer: string;
  isAnswered: boolean;
}
