import { QuestionDTO } from './question.model';

export interface QuestionCreationDTO {
  examId: number;
  questionList: QuestionDTO[];
}
