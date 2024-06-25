package com.ai.e_learning.service;

import com.ai.e_learning.dto.AnswerOptionDTO;
import com.ai.e_learning.dto.ExamDTO;
import com.ai.e_learning.dto.QuestionDTO;
import com.ai.e_learning.model.AnswerOption;
import com.ai.e_learning.model.Exam;
import com.ai.e_learning.model.Question;
import com.ai.e_learning.repository.AnswerOptionRepository;
import com.ai.e_learning.repository.ExamRepository;
import com.ai.e_learning.repository.QuestionRepository;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private AnswerOptionRepository answerOptionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ModelMapper modelMapper;

    public ExamDTO addExam(ExamDTO examDTO) {
        Exam exam = convertToEntity(examDTO);
        Exam savedExam = examRepository.save(exam);
        return convertToDto(savedExam);
    }

    public ExamDTO updateExam(ExamDTO examDTO) {
        Exam exam = convertToEntity(examDTO);
        Exam updatedExam = examRepository.save(exam);
        return convertToDto(updatedExam);
    }

    public List<ExamDTO> getExams() {
        return examRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ExamDTO getExam(Long examId) {
        return examRepository.findById(examId)
                .map(this::convertToDto)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found"));
    }

    public void softDeleteExam(Long examId) {
        examRepository.findById(examId)
                .ifPresent(exam -> {
                    exam.setDeleted(true);
                    examRepository.save(exam);
                });
    }

    private Exam convertToEntity(ExamDTO examDTO) {
        return modelMapper.map(examDTO, Exam.class);
    }

    private ExamDTO convertToDto(Exam exam) {
        return modelMapper.map(exam, ExamDTO.class);
    }


    public ExamDTO getExamById(Long examId) {
        // Fetch the exam entity
        Exam exam = EntityUtil.getEntityById(examRepository, examId, "Exam");

        // Fetch all questions associated with the exam
        List<Question> questionList = questionRepository.findAllByExamId(examId);

        // Initialize a list to hold QuestionDTOs
        List<QuestionDTO> questionDTOList = new ArrayList<>();

        // Iterate through each question and fetch the corresponding answer options
        for (Question question : questionList) {
            // Fetch the answer options for the current question
            List<AnswerOption> answerOptionList = answerOptionRepository.findByQuestionId(question.getId());

            // Map the answer options to their respective DTOs
            List<AnswerOptionDTO> answerOptionDTOList = answerOptionList.stream()
                    .map(answerOption -> DtoUtil.map(answerOption, AnswerOptionDTO.class, modelMapper))
                    .collect(Collectors.toList());

            // Map the question to a QuestionDTO
            QuestionDTO questionDTO = DtoUtil.map(question, QuestionDTO.class, modelMapper);

            // Set the answer options in the QuestionDTO
            questionDTO.setAnswerList(answerOptionDTOList);

            // Add the QuestionDTO to the list
            questionDTOList.add(questionDTO);
        }
        List<Question> questionLists = questionDTOList.stream().map(questionDTO -> modelMapper.map(questionDTO,Question.class)).collect(Collectors.toList());

        // Map the exam to an ExamDTO
        ExamDTO examDTO = DtoUtil.map(exam, ExamDTO.class, modelMapper);

        // Set the question list in the ExamDTO
        examDTO.setQuestions(new HashSet<>(questionDTOList));
        return examDTO;
    }

}
