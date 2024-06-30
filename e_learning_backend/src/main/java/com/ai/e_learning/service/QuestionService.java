package com.ai.e_learning.service;

import com.ai.e_learning.dto.QuestionCreationDTO;
import com.ai.e_learning.dto.QuestionDTO;
import com.ai.e_learning.dto.StudentAnswerRequestDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface QuestionService {
    public QuestionDTO addQuestion(QuestionDTO questionDTO);

    public QuestionDTO updateQuestion(QuestionDTO questionDTO);

    public Set<QuestionDTO> getQuestions();

    public QuestionDTO getQuestion(Long questionId);

    public void deleteQuestion(Long questionId);

    public boolean createQuestion(List<QuestionCreationDTO> questionCreationDTOList);

    List<QuestionDTO> getQuestionsByQuestionType(Long questionTypeId);

   public List<Map<String, Object>> saveStudentAnswers(List<StudentAnswerRequestDTO> studentAnswerRequestDTOList);
}
