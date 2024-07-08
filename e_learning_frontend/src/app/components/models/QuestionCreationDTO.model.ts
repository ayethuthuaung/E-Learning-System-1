import { QuestionDto } from './question.model';

export interface QuestionCreationDTO {
  examId: number;
  questionList: QuestionDto[];
}
