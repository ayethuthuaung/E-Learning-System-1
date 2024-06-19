package com.ai.e_learning.service;

import com.ai.e_learning.dto.QuestionCreationDTO;
import com.ai.e_learning.dto.QuestionDTO;
import com.ai.e_learning.model.Question;

import java.util.List;
import java.util.Set;

public interface QuestionService {
    public QuestionDTO addQuestion(QuestionDTO questionDTO);

    public QuestionDTO updateQuestion(QuestionDTO questionDTO);

    public Set<QuestionDTO> getQuestions();

    public QuestionDTO getQuestion(Long questionId);

    public void deleteQuestion(Long questionId);

    boolean createQuestion(List<QuestionCreationDTO> questionCreationDTOList);

    public List<QuestionDTO> getQuestionsForExam(Long examId);
}