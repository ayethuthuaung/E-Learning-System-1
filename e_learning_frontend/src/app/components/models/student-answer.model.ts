export interface StudentAnswer {
    questionId: number;
    answerOptionId: number | null;
    isAnswered: boolean; // Changed from isCorrect to isAnswered
  }
  