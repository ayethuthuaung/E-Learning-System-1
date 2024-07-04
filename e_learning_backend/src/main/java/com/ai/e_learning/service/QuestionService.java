package com.ai.e_learning.service;

import com.ai.e_learning.dto.QuestionCreationDto;
import com.ai.e_learning.dto.QuestionDto;
import com.ai.e_learning.dto.StudentAnswerRequestDto;


import com.ai.e_learning.dto.QuestionCreationDto;
import com.ai.e_learning.dto.QuestionDto;
import com.ai.e_learning.model.StudentAnswer;
import java.util.List;
import java.util.Map;
import java.util.Set;

public interface QuestionService {
    public QuestionDto addQuestion(QuestionDto questionDTO);

    public QuestionDto updateQuestion(QuestionDto questionDTO);

    public Set<QuestionDto> getQuestions();

    public QuestionDto getQuestion(Long questionId);

    public void deleteQuestion(Long questionId);

    public boolean createQuestion(List<QuestionCreationDto> questionCreationDtoList);

    public List<QuestionDto> getQuestionsByQuestionType(Long questionTypeId);

    public List<Map<String, Object>> saveStudentAnswers(List<StudentAnswerRequestDto> studentAnswerRequestDTOList);


//    List<QuestionDTO> getQuestionsWithAnswers(Long examId);
}
