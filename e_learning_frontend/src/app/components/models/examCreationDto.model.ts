import { QuestionDto } from './question.model';

export interface ExamCreationDto {
  title: string;
  description: string;
  questionList: QuestionDto[];
}
