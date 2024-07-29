package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.CertificateDto;
import com.ai.e_learning.dto.StudentAnswerDto;
import com.ai.e_learning.model.*;
import com.ai.e_learning.repository.*;
import com.ai.e_learning.service.CertificateService;
import com.ai.e_learning.service.StudentAnswerService;
import com.ai.e_learning.util.EntityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentAnswerServiceImpl implements StudentAnswerService {

    @Autowired
    private StudentAnswerRepository studentAnswerRepository;

    @Autowired
    private AnswerOptionRepository answerOptionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CertificateService certificateService;

    @Override
    public List<Map<String, Object>> saveStudentAnswers(List<StudentAnswerDto> studentAnswerDTOList) {
        List<Map<String, Object>> result = new ArrayList<>();
        double totalMarks = 0.0;
        boolean finalExam = false;
        User student = null;
        Long examId = 0L;
        for (StudentAnswerDto requestDTO : studentAnswerDTOList) {

            Map<String, Object> answerResult = new HashMap<>();
            answerResult.put("questionId", requestDTO.getQuestionId());

            // Retrieve question entity
            Question question = EntityUtil.getEntityById(questionRepository, requestDTO.getQuestionId(), "Question");
            examId = question.getExam().getId();

            // Handle the case where answer option ID might be null or zero
            AnswerOption selectedAnswerOption = null;
            if (requestDTO.getAnswerOptionId() != null && requestDTO.getAnswerOptionId() != 0) {
                selectedAnswerOption = EntityUtil.getEntityById(answerOptionRepository, requestDTO.getAnswerOptionId(), "AnswerOption");
            }

            // Retrieve the correct answer options for the given question
            List<AnswerOption> correctAnswerOptions = answerOptionRepository.findByQuestionIdAndIsAnsweredTrue(question.getId());

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
            answerResult.put("selectedOptionId", selectedAnswerOption != null ? selectedAnswerOption.getId() : null);
            List<Long> correctAnswerIds = new ArrayList<>();
            for (AnswerOption correctAnswerOption : correctAnswerOptions) {
                correctAnswerIds.add(correctAnswerOption.getId());
            }
            answerResult.put("correctAnswerIds", correctAnswerIds);

            // Check if the selected answer is correct
            if (selectedAnswerOption != null && question.getQuestionType().getId() == 1) { // Multiple-choice
                if (correctAnswerIds.contains(selectedAnswerOption.getId())) {
                    totalMarks += question.getMarks();
                }
            } else if (question.getQuestionType().getId() == 2) { // Checkbox
                List<Long> selectedAnswerIds = studentAnswerDTOList.stream()
                        .filter(dto -> dto.getQuestionId().equals(question.getId()))
                        .map(StudentAnswerDto::getAnswerOptionId)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());

                if (new HashSet<>(selectedAnswerIds).containsAll(correctAnswerIds) && new HashSet<>(correctAnswerIds).containsAll(selectedAnswerIds)) {
                    totalMarks += question.getMarks();
                }
            }

            // Save the student answer with the selected option ID
            User user = EntityUtil.getEntityById(userRepository, requestDTO.getUserId(), "User");
            student = user;
            StudentAnswer studentAnswer = new StudentAnswer();
            studentAnswer.setAnswerOption(selectedAnswerOption);
            studentAnswer.setQuestion(question);
            studentAnswer.setUser(user);
            studentAnswer.setTotalMarks(totalMarks);
            studentAnswerRepository.save(studentAnswer);
            result.add(answerResult);
        }
        Exam exam = EntityUtil.getEntityById(examRepository, examId,"Exam");
        Course course = courseRepository.findCourseByExamId(exam.getId());
        finalExam = exam.isFinalExam();
        if(finalExam && totalMarks >= exam.getPassScore()){
            CertificateDto certificateDto = new CertificateDto();
            certificateDto.setUser(student);
            certificateDto.setCourse(course);
            certificateService.saveCertificate(certificateDto);
        }
        return result;
    }
}

