package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.AnswerOptionDTO;
import com.ai.e_learning.dto.QuestionCreationDTO;
import com.ai.e_learning.dto.QuestionDTO;
import com.ai.e_learning.model.AnswerOption;
import com.ai.e_learning.model.Exam;
import com.ai.e_learning.model.Question;
import com.ai.e_learning.model.QuestionType;
import com.ai.e_learning.repository.AnswerOptionRepository;
import com.ai.e_learning.repository.ExamRepository;
import com.ai.e_learning.repository.QuestionRepository;
import com.ai.e_learning.repository.Question_TypeRepository;
import com.ai.e_learning.service.QuestionService;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private Question_TypeRepository questionTypeRepository;

    @Autowired
    private AnswerOptionRepository answerOptionRepository;

    @Autowired
    private ExamRepository examRepository;
    @Autowired
    private final ModelMapper modelMapper;

    @Override
    public QuestionDTO addQuestion(QuestionDTO questionDTO) {
      //  Exam exam = EntityUtil.getEntityById(examRepository, questionDTO.getExamId(), "Exam");
        QuestionType questionType = EntityUtil.getEntityById(questionTypeRepository, questionDTO.getQuestionTypeId(), "QuestionType");
        Question question = DtoUtil.map(questionDTO, Question.class, modelMapper);
      //  question.setExam(exam);
        question.setQuestionType(questionType);
        Question saveQuestion = EntityUtil.saveEntity(questionRepository, question, "Question");
        return DtoUtil.map(saveQuestion, QuestionDTO.class, modelMapper);
    }

    @Override
    public QuestionDTO updateQuestion(QuestionDTO questionDTO) {
        Question existingQuestion = EntityUtil.getEntityById(questionRepository, questionDTO.getId(), "Question");
     //   Exam exam = EntityUtil.getEntityById(examRepository, questionDTO.getExamId(), "Exam");
        QuestionType questionType = EntityUtil.getEntityById(questionTypeRepository, questionDTO.getQuestionTypeId(), "QuestionType");

        existingQuestion.setContent(questionDTO.getContent());
        existingQuestion.setQuestionType(questionType);
        //existingQuestion.setExam(exam);

        Question updatedQuestion = EntityUtil.saveEntity(questionRepository, existingQuestion, "Question");
        return DtoUtil.map(updatedQuestion, QuestionDTO.class, modelMapper);
    }

    @Override
    public Set<QuestionDTO> getQuestions() {
        List<Question> questionList = EntityUtil.getAllEntities(questionRepository);
        return questionList == null ? new HashSet<>() : new HashSet<>(DtoUtil.mapList(questionList, QuestionDTO.class, modelMapper));
    }

    @Override
    public QuestionDTO getQuestion(Long questionId) {
        Question question = EntityUtil.getEntityById(questionRepository, questionId, "Question");
        return DtoUtil.map(question, QuestionDTO.class, modelMapper);
    }

    @Override
    public void deleteQuestion(Long questionId) {
        EntityUtil.deleteEntity(questionRepository, questionId, "Question");
    }

    public boolean createQuestion(List<QuestionCreationDTO> questionCreationDTOList) {
        try {
            for (QuestionCreationDTO questionCreationDTO : questionCreationDTOList) {
                // Fetch or create the Exam entity
//                Exam exam = examRepository.findById(questionCreationDTO.getExamId()).orElse(new Exam());
                Exam exam = EntityUtil.getEntityById(examRepository, questionCreationDTO.getExamId(), "Exam");


                // Process each question in the DTO
                for (QuestionDTO questionDTO : questionCreationDTO.getQuestionList()) {
                    Question question = new Question();
                    question.setContent(questionDTO.getContent());
                    question.setExam(exam);

                    // Fetch the QuestionType entity
                    QuestionType questionType = EntityUtil.getEntityById(questionTypeRepository, questionDTO.getQuestionTypeId(), "QuestionType");

                    question.setQuestionType(questionType);

                    // Save the question to get the generated ID
                    Question savedQuestion = questionRepository.save(question);

                    // Process each answer option
                    for (AnswerOptionDTO answerOptionDTO : questionDTO.getAnswerList()) {
                        AnswerOption answerOption = new AnswerOption();
                        answerOption.setAnswer(answerOptionDTO.getAnswer());
                        answerOption.setAnswered(answerOptionDTO.getIsAnswered());
                        answerOption.setQuestion(savedQuestion);

                        // Save the answer option
                        answerOptionRepository.save(answerOption);
                    }
                }
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    @Override
    public List<QuestionDTO> getQuestionsForExam(Long examId) {
        List<Question> questions = questionRepository.findByExamId(examId); // Assuming you have a method findByExamId in your repository
        return questions.stream()
                .map(this::mapToQuestionDTO) // map each Question entity to QuestionDTO
                .collect(Collectors.toList());
    }

    private QuestionDTO mapToQuestionDTO(Question question) {
        QuestionDTO questionDTO = modelMapper.map(question, QuestionDTO.class);

        // Fetch answer options for the question
        List<AnswerOption> answerOptions = answerOptionRepository.findByQuestionId(question.getId()); // Assuming you have a method findByQuestionId in your repository
        List<AnswerOptionDTO> answerOptionDTOs = answerOptions.stream()
                .map(answerOption -> modelMapper.map(answerOption, AnswerOptionDTO.class))
                .collect(Collectors.toList());

        questionDTO.setAnswerList(answerOptionDTOs); // Set answer options in QuestionDTO

        return questionDTO;
    }

}