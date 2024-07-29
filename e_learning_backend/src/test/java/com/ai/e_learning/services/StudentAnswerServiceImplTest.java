package com.ai.e_learning.services;

import com.ai.e_learning.dto.CertificateDto;
import com.ai.e_learning.dto.StudentAnswerDto;
import com.ai.e_learning.model.*;
import com.ai.e_learning.repository.*;
import com.ai.e_learning.service.CertificateService;
import com.ai.e_learning.service.impl.StudentAnswerServiceImpl;
import com.ai.e_learning.util.EntityUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudentAnswerServiceImplTest {

    @Mock
    private StudentAnswerRepository studentAnswerRepository;

    @Mock
    private AnswerOptionRepository answerOptionRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ExamRepository examRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private CertificateService certificateService;

    @InjectMocks
    private StudentAnswerServiceImpl studentAnswerService;

    private Question question;
    private AnswerOption answerOption;
    private User student;
    private Exam exam;
    private Course course;
    private StudentAnswerDto studentAnswerDto;

    @BeforeEach
    void setUp() {
        question = new Question();
        question.setId(1L);
        question.setContent("Sample Question");
        question.setMarks(10.0);
        QuestionType questionType = new QuestionType();
        questionType.setId(1L); // Multiple Choice
        question.setQuestionType(questionType);

        answerOption = new AnswerOption();
        answerOption.setId(1L);
        answerOption.setAnswer("Sample Answer");
        answerOption.setIsAnswered(true);
        answerOption.setQuestion(question);

        student = new User();
        student.setId(1L);
        student.setName("student");

        exam = new Exam();
        exam.setId(1L);
        exam.setTitle("Sample Exam");
        exam.setPassScore(50.0);
        exam.setFinalExam(true);
        question.setExam(exam);

        course = new Course();
        course.setId(1L);
        course.setName("Sample Course");

        studentAnswerDto = new StudentAnswerDto();
        studentAnswerDto.setQuestionId(1L);
        studentAnswerDto.setAnswerOptionId(1L);
        studentAnswerDto.setUserId(1L);
    }

    @Test
    void testSaveStudentAnswers() {
        when(questionRepository.findById(any(Long.class))).thenReturn(Optional.of(question));
        when(answerOptionRepository.findById(any(Long.class))).thenReturn(Optional.of(answerOption));
        when(answerOptionRepository.findByQuestionIdAndIsAnsweredTrue(any(Long.class))).thenReturn(Collections.singletonList(answerOption));
        when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(student));
        when(examRepository.findById(any(Long.class))).thenReturn(Optional.of(exam));
        when(courseRepository.findCourseByExamId(any(Long.class))).thenReturn(course);
        when(studentAnswerRepository.save(any(StudentAnswer.class))).thenReturn(new StudentAnswer());

        List<StudentAnswerDto> studentAnswerDtoList = Collections.singletonList(studentAnswerDto);
        List<Map<String, Object>> result = studentAnswerService.saveStudentAnswers(studentAnswerDtoList);

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).get("questionId"));

        verify(studentAnswerRepository, times(1)).save(any(StudentAnswer.class));
        verify(certificateService, times(1)).saveCertificate(any(CertificateDto.class));
    }

    @Test
    void testSaveStudentAnswers_WhenAnswerOptionIdIsNull() {
        studentAnswerDto.setAnswerOptionId(null);
        when(questionRepository.findById(any(Long.class))).thenReturn(Optional.of(question));
        when(answerOptionRepository.findByQuestionIdAndIsAnsweredTrue(any(Long.class))).thenReturn(Collections.singletonList(answerOption));
        when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(student));
        when(examRepository.findById(any(Long.class))).thenReturn(Optional.of(exam));
        when(courseRepository.findCourseByExamId(any(Long.class))).thenReturn(course);
        when(studentAnswerRepository.save(any(StudentAnswer.class))).thenReturn(new StudentAnswer());

        List<StudentAnswerDto> studentAnswerDtoList = Collections.singletonList(studentAnswerDto);
        List<Map<String, Object>> result = studentAnswerService.saveStudentAnswers(studentAnswerDtoList);

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertNull(result.get(0).get("selectedOptionId"));

        verify(studentAnswerRepository, times(1)).save(any(StudentAnswer.class));
    }
}
