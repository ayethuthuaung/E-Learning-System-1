package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.*;
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
    private final Question_TypeRepository questionTypeRepository;
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
public List<Map<String, Object>> saveStudentAnswers(List<StudentAnswerRequestDto> studentAnswerRequestDtoList) {
    List<Map<String, Object>> result = new ArrayList<>();

    for (StudentAnswerRequestDto requestDTO : studentAnswerRequestDtoList) {
        Map<String, Object> answerResult = new HashMap<>();
        answerResult.put("questionId", requestDTO.getQuestionId());

        // Retrieve question and answer option entities
        Question question = questionRepository.findById(requestDTO.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("Question not found for ID: " + requestDTO.getQuestionId()));
        AnswerOption selectedAnswerOption = answerOptionRepository.findById(requestDTO.getAnswerOptionId())
                .orElseThrow(() -> new IllegalArgumentException("Answer option not found for ID: " + requestDTO.getAnswerOptionId()));

        // Retrieve the correct answer option for the given question
        AnswerOption correctAnswerOption = answerOptionRepository.findByQuestionIdAndIsAnsweredTrue(question.getId());

        // Simplify the question object to include only necessary attributes
        Map<String, Object> questionMap = new HashMap<>();
        questionMap.put("id", question.getId());
        questionMap.put("content", question.getContent());
        List<Map<String, Object>> optionsList = new ArrayList<>();
        for (AnswerOption option : question.getAnswerOptions()) {
            Map<String, Object> optionMap = new HashMap<>();
            optionMap.put("id", option.getId());
            optionMap.put("answer", option.getAnswer());
            optionMap.put("isAnswered", option.getIsAnswered());
            optionsList.add(optionMap);
        }
        questionMap.put("options", optionsList);

        // Add to the result list
        answerResult.put("selectedOptionId", selectedAnswerOption.getId());
        answerResult.put("correctAnswerId", correctAnswerOption.getId());
        answerResult.put("question", questionMap);

        // Save the student answer
        studentAnswerRepository.save(new StudentAnswer(question, selectedAnswerOption));

        result.add(answerResult);
    }

    return result;
}

}



//@Override
//public void saveStudentAnswers(List<StudentAnswerRequestDTO> studentAnswerRequestDTOList) {
//    for (StudentAnswerRequestDTO requestDTO : studentAnswerRequestDTOList) {
//        // Log the request DTO
//        System.out.println("Processing: " + requestDTO);
//
//        // Retrieve question entity
//        Question question = questionRepository.findById(requestDTO.getQuestionId())
//                .orElseThrow(() -> new IllegalArgumentException("Question not found for ID: " + requestDTO.getQuestionId()));
//
//        // Retrieve answer option entity for the selected answer
//        AnswerOption selectedAnswerOption = answerOptionRepository.findById(requestDTO.getAnswerOptionId())
//                .orElseThrow(() -> new IllegalArgumentException("Answer option not found for ID: " + requestDTO.getAnswerOptionId()));
//
//        // Log the selected answer option
//        System.out.println("Selected Answer Option: " + selectedAnswerOption);
//
//        // Retrieve all answer options for the given question
//        List<AnswerOption> answerOptions = answerOptionRepository.findByQuestionId(requestDTO.getQuestionId());
//        if (answerOptions.isEmpty()) {
//            throw new IllegalArgumentException("No answer options found for question ID: " + requestDTO.getQuestionId());
//        }
//
//        // Log all answer options for the question
//        System.out.println("Answer Options for Question ID " + requestDTO.getQuestionId() + ": " + answerOptions);
//
//        // Retrieve the correct answer option for the given question
//        AnswerOption correctAnswerOption = answerOptions.stream()
//                .filter(AnswerOption::getIsAnswered)
//                .findFirst()
//                .orElseThrow(() -> new IllegalArgumentException("Correct answer option not found for question ID: " + requestDTO.getQuestionId()));
//
//        // Log the correct answer option
//        System.out.println("Correct Answer Option: " + correctAnswerOption);
//
//        // Create a new StudentAnswer entity and set selectedOptionId and correctAnswerId
//        StudentAnswer studentAnswer = new StudentAnswer();
//        studentAnswer.setQuestion(question);
//        studentAnswer.setAnswerOption(selectedAnswerOption);
//        studentAnswer.setSelectedOptionId(selectedAnswerOption.getId()); // Set selected option ID
//        studentAnswer.setCorrectAnswerId(correctAnswerOption.getId()); // Set correct answer ID
//
//        // Save the student answer
//        studentAnswerRepository.save(studentAnswer);
//    }
//}







