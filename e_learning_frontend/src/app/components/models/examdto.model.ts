import { QuestionDTO } from './question.model';

export interface ExamDTO {
  id: number;
  title: string;
  description: string;
  questions: QuestionDTO[];
}
