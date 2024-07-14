package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.*;
import com.ai.e_learning.model.*;
import com.ai.e_learning.repository.*;
import com.ai.e_learning.service.ExamService;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExamServiceImpl implements ExamService {

    @Autowired
    private ExamRepository examRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private QuestionTypeRepository questionTypeRepository;
    @Autowired
    private AnswerOptionRepository answerOptionRepository;
    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private ModelMapper modelMapper;


    @Override
    public boolean createExam(ExamCreationDto examCreationDto) {
        try {
            Lesson lesson = EntityUtil.getEntityById(lessonRepository,examCreationDto.getLessonId(),"Lesson");
            Exam exam = new Exam();
            exam.setTitle(examCreationDto.getTitle());
            exam.setDescription(examCreationDto.getDescription());
            exam.setDeleted(false);
            exam.setLesson(lesson);
            Exam savedExam = EntityUtil.saveEntity(examRepository, exam, "Exam");
            List<QuestionDto> questionDtoList = examCreationDto.getQuestionList();
            for (QuestionDto questionDTO : questionDtoList) {
                Question question = new Question();
                question.setContent(questionDTO.getContent());
                question.setExam(savedExam);
                QuestionType questionType = EntityUtil.getEntityById(questionTypeRepository, questionDTO.getQuestionTypeId(), "QuestionType");
                question.setQuestionType(questionType);
                question.setMarks(questionDTO.getMarks());
                Question savedQuestion = EntityUtil.saveEntity(questionRepository, question, "Question");

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
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    //No Use
    @Override
    public ExamDto addExam(ExamDto examDTO) {
        Exam exam = convertToEntity(examDTO);
        Exam savedExam = examRepository.save(exam);
        return convertToDto(savedExam);
    }

    @Override
    public ExamDto updateExam(ExamDto examDTO) {
        Exam exam = convertToEntity(examDTO);
        Exam updatedExam = examRepository.save(exam);
        return convertToDto(updatedExam);
    }

    @Override
    public List<ExamDto> getExams() {
        return examRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ExamDto getExam(Long examId) {
        return examRepository.findById(examId)
                .map(this::convertToDto)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found"));
    }

    @Override
    public void softDeleteExam(Long examId) {
        examRepository.findById(examId)
                .ifPresent(exam -> {
                    exam.setDeleted(true);
                    examRepository.save(exam);
                });
    }


    @Override
    public ExamDto getExamById(Long examId) {
        // Fetch the exam entity
        Exam exam = EntityUtil.getEntityById(examRepository, examId, "Exam");

        // Fetch all questions associated with the exam
        List<Question> questionList = questionRepository.findAllByExamId(examId);

        // Initialize a list to hold QuestionDTOs
        List<QuestionDto> questionDtoList = new ArrayList<>();

        // Iterate through each question and fetch the corresponding answer options
        for (Question question : questionList) {
            // Fetch the answer options for the current question
            List<AnswerOption> answerOptionList = answerOptionRepository.findByQuestionId(question.getId());

            // Map the answer options to their respective DTOs
//            List<AnswerOptionDto> answerOptionDtoList = answerOptionList.stream()
//                    .map(answerOption -> DtoUtil.map(answerOption, AnswerOptionDto.class, modelMapper))
//                    .collect(Collectors.toList());

            List<AnswerOptionDto> answerOptionDtoList = DtoUtil.mapList(answerOptionList, AnswerOptionDto.class,modelMapper);

            // Map the question to a QuestionDTO
            QuestionDto questionDTO = DtoUtil.map(question, QuestionDto.class, modelMapper);

            // Set the answer options in the QuestionDTO
            questionDTO.setAnswerList(answerOptionDtoList);

            // Add the QuestionDTO to the list
            questionDtoList.add(questionDTO);
        }
        List<Question> questionLists = questionDtoList.stream().map(questionDTO -> modelMapper.map(questionDTO, Question.class)).collect(Collectors.toList());

        // Map the exam to an ExamDTO
        ExamDto examDTO = DtoUtil.map(exam, ExamDto.class, modelMapper);

        // Set the question list in the ExamDTO
        examDTO.setQuestions(new HashSet<>(questionDtoList));
        return examDTO;
    }

    @Override
    public ExamDto getExamWithQuestions(Long examId) {
        Exam exam = examRepository.findByIdWithQuestions(examId)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found"));

        return convertToDto(exam);
    }


    private Exam convertToEntity(ExamDto examDTO) {
        return modelMapper.map(examDTO, Exam.class);
    }


    private ExamDto convertToDto(Exam exam) {
        return modelMapper.map(exam, ExamDto.class);
    }

}
