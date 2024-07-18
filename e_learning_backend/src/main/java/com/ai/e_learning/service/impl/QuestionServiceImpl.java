package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.*;
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

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final QuestionTypeRepository questionTypeRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final ExamRepository examRepository;
    private final ModelMapper modelMapper;




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
//original
//    @Override
//    public boolean createQuestion(List<QuestionCreationDto> questionCreationDtoList) {
//        try {
//            for (QuestionCreationDto questionCreationDTO : questionCreationDtoList) {
//                Exam exam = EntityUtil.getEntityById(examRepository, questionCreationDTO.getExamId(), "Exam");
//                for (QuestionDto questionDTO : questionCreationDTO.getQuestionList()) {
//                    Question question = new Question();
//                    question.setContent(questionDTO.getContent());
//                    question.setExam(exam);
//                    QuestionType questionType = EntityUtil.getEntityById(questionTypeRepository, questionDTO.getQuestionTypeId(), "QuestionType");
//                    question.setQuestionType(questionType);
//                    Question savedQuestion = questionRepository.save(question);
//                    List<AnswerOption> answerOptions = new ArrayList<>();
//                    for (AnswerOptionDto answerOptionDTO : questionDTO.getAnswerList()) {
//                        AnswerOption answerOption = new AnswerOption();
//                        answerOption.setAnswer(answerOptionDTO.getAnswer());
//                        answerOption.setIsAnswered(answerOptionDTO.getIsAnswered());
//                        answerOption.setQuestion(savedQuestion);
//                        answerOptions.add(answerOption);
//                    }
//                    answerOptionRepository.saveAll(answerOptions);
//                }
//            }
//            return true;
//        } catch (Exception e) {
//            e.printStackTrace();
//            return false;
//        }
//    }

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

                    // Save AnswerOptions
                    List<AnswerOption> answerOptions = new ArrayList<>();
                    for (AnswerOptionDto answerOptionDTO : questionDTO.getAnswerList()) {
                        AnswerOption answerOption = new AnswerOption();
                        answerOption.setAnswer(answerOptionDTO.getAnswer());
                        answerOption.setIsAnswered(answerOptionDTO.getIsAnswered());
                        answerOption.setQuestion(savedQuestion);
                        answerOptions.add(answerOption);
                    }
                    answerOptionRepository.saveAll(answerOptions);

                    // Save Marks
//                    List<Marks> marksList = new ArrayList<>();
//                    for (MarksDto marksDto : questionDTO.getMarksList()) {
//                        Marks marks = new Marks();
//                        marks.setMark(marksDto.getMark());
//                        marks.setQuestion(savedQuestion);
//                        marksList.add(marks);
//                    }
//                    marksRepository.saveAll(marksList);
                }
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }





}











