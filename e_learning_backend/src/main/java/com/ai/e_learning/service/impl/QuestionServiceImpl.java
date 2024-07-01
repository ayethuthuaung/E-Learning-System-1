package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.AnswerFeedback;
import com.ai.e_learning.dto.AnswerOptionDto;
import com.ai.e_learning.dto.QuestionCreationDto;
import com.ai.e_learning.dto.QuestionDto;
import com.ai.e_learning.model.AnswerOption;
import com.ai.e_learning.model.Exam;
import com.ai.e_learning.model.Question;
import com.ai.e_learning.model.QuestionType;
import com.ai.e_learning.model.StudentAnswer;
import com.ai.e_learning.repository.*;
import com.ai.e_learning.service.QuestionService;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final Question_TypeRepository questionTypeRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final ExamRepository examRepository;
    private final ModelMapper modelMapper;

//    @Override
//    public List<QuestionDTO> getQuestionsWithAnswers(Long examId) {
//        List<Question> questions = questionRepository.findByExamId(examId);
//
//        return (List<QuestionDTO>) questions.stream()
//                .map(question -> {
//                    QuestionDTO questionDTO = DtoUtil.map(question, QuestionDTO.class, modelMapper);
//                    List<AnswerOption> answerOptions = answerOptionRepository.findByQuestionId(question.getId());
//                    List<AnswerOptionDTO> answerOptionDTOs = answerOptions.stream()
//                            .map(answerOption -> DtoUtil.map(answerOption, AnswerOptionDTO.class, modelMapper))
//                            .collect(Collectors.toList());
//                    questionDTO.setAnswerList(answerOptionDTOs);
//                    return questionDTO;
//                })
//                .collect(Collectors.toSet());
//    }

    @Override
    public QuestionDto addQuestion(QuestionDto questionDTO) {
        QuestionType questionType = EntityUtil.getEntityById(questionTypeRepository, questionDTO.getQuestionTypeId(), "QuestionType");
        Question question = DtoUtil.map(questionDTO, Question.class, modelMapper);
        question.setQuestionType(questionType);
        Question savedQuestion = questionRepository.save(question);
        return DtoUtil.map(savedQuestion, QuestionDto.class, modelMapper);
    }

    @Override
    public QuestionDto updateQuestion(QuestionDto questionDTO) {
        Question existingQuestion = EntityUtil.getEntityById(questionRepository, questionDTO.getId(), "Question");
        QuestionType questionType = EntityUtil.getEntityById(questionTypeRepository, questionDTO.getQuestionTypeId(), "QuestionType");
        existingQuestion.setContent(questionDTO.getContent());
        existingQuestion.setQuestionType(questionType);
        Question updatedQuestion = questionRepository.save(existingQuestion);
        return DtoUtil.map(updatedQuestion, QuestionDto.class, modelMapper);
    }

    @Override
    public List<QuestionDto> getQuestionsByQuestionType(Long questionTypeId) {
        List<Question> questions = questionRepository.findByQuestionTypeId(questionTypeId);
        return questions.stream()
                .map(question -> DtoUtil.map(question, QuestionDto.class, modelMapper))
                .collect(Collectors.toList());
    }

//    @Override
//    public List<QuestionDTO> getQuestionsForExam(Long examId) {
//        List<Question> questions = questionRepository.findByExamId(examId);
//        return questions.stream()
//                .map(question -> DtoUtil.map(question, QuestionDTO.class, modelMapper))
//                .collect(Collectors.toList());
//    }

    @Override
    public Set<QuestionDto> getQuestions() {
        List<Question> questionList = EntityUtil.getAllEntities(questionRepository);
        return questionList.stream()
                .map(question -> DtoUtil.map(question, QuestionDto.class, modelMapper))
                .collect(Collectors.toSet());
    }

    @Override
    public QuestionDto getQuestion(Long questionId) {
        Question question = EntityUtil.getEntityById(questionRepository, questionId, "Question");
        return DtoUtil.map(question, QuestionDto.class, modelMapper);
    }

    @Override
    public void deleteQuestion(Long questionId) {
        EntityUtil.deleteEntity(questionRepository, questionId, "Question");
    }

    @Override
    public boolean createQuestion(List<QuestionCreationDto> questionCreationDtoList) {
        try {
            for (QuestionCreationDto questionCreationDTO : questionCreationDtoList) {
                Exam exam = EntityUtil.getEntityById(examRepository, questionCreationDTO.getExamId(), "Exam");
                for (QuestionDto questionDTO : questionCreationDTO.getQuestionList()) {
                    Question question = new Question();
                    question.setContent(questionDTO.getContent());
                    question.setExam(exam);
                    QuestionType questionType = EntityUtil.getEntityById(questionTypeRepository, questionDTO.getQuestionTypeId(), "QuestionType");
                    question.setQuestionType(questionType);
                    Question savedQuestion = questionRepository.save(question);
                    List<AnswerOption> answerOptions = new ArrayList<>();
                    for (AnswerOptionDto answerOptionDTO : questionDTO.getAnswerList()) {
                        AnswerOption answerOption = new AnswerOption();
                        answerOption.setAnswer(answerOptionDTO.getAnswer());
                        answerOption.setIsAnswered(answerOptionDTO.getIsAnswered());
                        answerOption.setQuestion(savedQuestion);
                        answerOptions.add(answerOption);
                    }
                    answerOptionRepository.saveAll(answerOptions);
                }
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<AnswerFeedback> submitStudentAnswers(List<StudentAnswer> studentAnswers) {
        List<StudentAnswer> savedStudentAnswers = studentAnswerRepository.saveAll(studentAnswers);
        return savedStudentAnswers.stream()
                .map(this::generateFeedback)
                .collect(Collectors.toList());
    }

    @Override
    public AnswerFeedback generateFeedback(StudentAnswer studentAnswer) {
        // Fetch the selected answer option
        AnswerOption selectedOption = answerOptionRepository.findById(studentAnswer.getAnswerOptionId())
                .orElseThrow(() -> new RuntimeException("Selected answer option not found"));

        // Fetch the corresponding question
        Question question = questionRepository.findById(studentAnswer.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // Fetch the correct answer option (assuming one is marked as correct)
        AnswerOption correctOption = question.getAnswerOptions().stream()
                .filter(AnswerOption::getIsAnswered)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Correct answer option not found"));

        // Prepare feedback object
        AnswerFeedback feedback = new AnswerFeedback();
        feedback.setQuestionId(studentAnswer.getQuestionId());
        feedback.setSelectedOptionId(selectedOption.getId());
        feedback.setCorrectOptionId(correctOption.getId());
        feedback.setCorrect(selectedOption.getId().equals(correctOption.getId()));

        return feedback;
    }
}
