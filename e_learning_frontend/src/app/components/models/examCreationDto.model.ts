import { QuestionDto } from './question.model';

export interface ExamCreationDto {
  lessonId: number;
  title: string;
  description: string;
  duration: string;
  questionList: QuestionDto[];
}
