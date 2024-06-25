package com.ai.e_learning.service;

import com.ai.e_learning.dto.AnswerFeedback;
import com.ai.e_learning.dto.QuestionCreationDTO;
import com.ai.e_learning.dto.QuestionDTO;
import com.ai.e_learning.model.StudentAnswer;
import java.util.List;
import java.util.Set;

public interface QuestionService {
    public QuestionDTO addQuestion(QuestionDTO questionDTO);

    public QuestionDTO updateQuestion(QuestionDTO questionDTO);

    public Set<QuestionDTO> getQuestions();

    public QuestionDTO getQuestion(Long questionId);

    public void deleteQuestion(Long questionId);

    public boolean createQuestion(List<QuestionCreationDTO> questionCreationDTOList);

    public List<AnswerFeedback> submitStudentAnswers(List<StudentAnswer> studentAnswers);

    public AnswerFeedback generateFeedback(StudentAnswer studentAnswer);

    List<QuestionDTO> getQuestionsByQuestionType(Long questionTypeId);


//    List<QuestionDTO> getQuestionsWithAnswers(Long examId);
}
