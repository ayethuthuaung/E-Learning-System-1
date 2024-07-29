package com.ai.e_learning.services;

import com.ai.e_learning.dto.*;
import com.ai.e_learning.exception.EntityNotFoundException;
import com.ai.e_learning.model.*;
import com.ai.e_learning.repository.*;
import com.ai.e_learning.service.impl.ExamServiceImpl;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExamServiceImplTest {

    @InjectMocks
    private ExamServiceImpl examService;

    @Mock
    private ExamRepository examRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private QuestionTypeRepository questionTypeRepository;

    @Mock
    private AnswerOptionRepository answerOptionRepository;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private ModelMapper modelMapper;

    private Exam exam;
    private ExamDto examDto;
    private Lesson lesson;
    private Question question;
    private QuestionDto questionDto;
    private AnswerOption answerOption;
    private AnswerOptionDto answerOptionDto;
    private List<Question> questionList;
    private List<AnswerOption> answerOptionList;

    @BeforeEach
    void setUp() {
        lesson = new Lesson();
        lesson.setId(1L);

        exam = new Exam();
        exam.setId(1L);
        exam.setTitle("Exam 1");
        exam.setLesson(lesson);

        examDto = new ExamDto();
        examDto.setId(1L);
        examDto.setTitle("Exam 1");

        question = new Question();
        question.setId(1L);
        question.setContent("Question 1");

        questionDto = new QuestionDto();
        questionDto.setId(1L);
        questionDto.setContent("Question 1");

        answerOption = new AnswerOption();
        answerOption.setId(1L);
        answerOption.setAnswer("Option 1");

        answerOptionDto = new AnswerOptionDto();
        answerOptionDto.setId(1L);
        answerOptionDto.setAnswer("Option 1");

        questionList = new ArrayList<>();
        questionList.add(question);

        answerOptionList = new ArrayList<>();
        answerOptionList.add(answerOption);
    }

    @Test
    void testGetExam() {
        when(examRepository.findById(1L)).thenReturn(Optional.of(exam));
        when(modelMapper.map(exam, ExamDto.class)).thenReturn(examDto);

        ExamDto result = examService.getExam(1L);

        assertNotNull(result);
        assertEquals("Exam 1", result.getTitle());
        verify(examRepository, times(1)).findById(1L);
    }

    @Test
    void testGetExam_NotFound() {
        when(examRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> examService.getExam(1L));
    }

    @Test
    void testGetExams() {
        List<Exam> examList = new ArrayList<>();
        examList.add(exam);

        when(examRepository.findAll()).thenReturn(examList);
        when(modelMapper.map(exam, ExamDto.class)).thenReturn(examDto);

        List<ExamDto> result = examService.getExams();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Exam 1", result.get(0).getTitle());
        verify(examRepository, times(1)).findAll();
    }

    @Test
    void testSoftDeleteExam() {
        when(examRepository.findById(1L)).thenReturn(Optional.of(exam));

        examService.softDeleteExam(1L);

        assertTrue(exam.isDeleted());
        verify(examRepository, times(1)).save(exam);
    }

    @Test
    void testCreateExam() {
        ExamCreationDto examCreationDto = new ExamCreationDto();
        examCreationDto.setLessonId(1L);
        examCreationDto.setTitle("New Exam");
        List<QuestionDto> questionDtos = new ArrayList<>();
        questionDtos.add(questionDto);
        examCreationDto.setQuestionList(questionDtos);

        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));
        when(modelMapper.map(questionDto, Question.class)).thenReturn(question);
        when(questionRepository.save(any(Question.class))).thenReturn(question);
        when(answerOptionRepository.saveAll(anyList())).thenReturn(answerOptionList);

        boolean result = examService.createExam(examCreationDto);

        assertTrue(result);
        verify(examRepository, times(1)).save(any(Exam.class));
        verify(questionRepository, times(1)).save(any(Question.class));
        verify(answerOptionRepository, times(1)).saveAll(anyList());
    }
}
