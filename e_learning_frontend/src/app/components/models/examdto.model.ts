import { QuestionDto } from './question.model';

export interface ExamDTO {
  id: number;
  title: string;
  description: string;
  duration: string;
  questions: QuestionDto[];
}
