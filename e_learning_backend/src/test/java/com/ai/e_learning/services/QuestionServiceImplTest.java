package com.ai.e_learning.services;

import com.ai.e_learning.dto.*;
import com.ai.e_learning.model.*;
import com.ai.e_learning.repository.*;
import com.ai.e_learning.service.impl.QuestionServiceImpl;
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
public class QuestionServiceImplTest {

    @Mock
    private QuestionRepository questionRepository;
    @Mock
    private QuestionTypeRepository questionTypeRepository;
    @Mock
    private AnswerOptionRepository answerOptionRepository;
    @Mock
    private StudentAnswerRepository studentAnswerRepository;
    @Mock
    private ExamRepository examRepository;
    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private QuestionServiceImpl questionService;

    private Question question;
    private QuestionDto questionDto;
    private QuestionType questionType;
    private AnswerOption answerOption;
    private Exam exam;

    @BeforeEach
    void setUp() {
        questionType = new QuestionType();
        questionType.setId(1L);
        questionType.setType("Multiple Choice");

        question = new Question();
        question.setId(1L);
        question.setContent("Sample Question");
        question.setQuestionType(questionType);

        questionDto = new QuestionDto();
        questionDto.setId(1L);
        questionDto.setContent("Sample Question");
        questionDto.setQuestionTypeId(1L);

        exam = new Exam();
        exam.setId(1L);
        exam.setTitle("Sample Exam");

        answerOption = new AnswerOption();
        answerOption.setId(1L);
        answerOption.setAnswer("Sample Answer");
        answerOption.setIsAnswered(false);
        answerOption.setQuestion(question);
    }

    @Test
    void testAddQuestion() {
        when(questionTypeRepository.findById(any(Long.class))).thenReturn(Optional.of(questionType));
        when(questionRepository.save(any(Question.class))).thenReturn(question);
        when(modelMapper.map(any(Question.class), eq(QuestionDto.class))).thenReturn(questionDto);
        when(modelMapper.map(any(QuestionDto.class), eq(Question.class))).thenReturn(question);

        QuestionDto savedQuestionDto = questionService.addQuestion(questionDto);

        assertNotNull(savedQuestionDto);
        assertEquals("Sample Question", savedQuestionDto.getContent());
        verify(questionRepository, times(1)).save(any(Question.class));
    }

    @Test
    void testUpdateQuestion() {
        when(questionRepository.findById(any(Long.class))).thenReturn(Optional.of(question));
        when(questionTypeRepository.findById(any(Long.class))).thenReturn(Optional.of(questionType));
        when(questionRepository.save(any(Question.class))).thenReturn(question);
        when(modelMapper.map(any(Question.class), eq(QuestionDto.class))).thenReturn(questionDto);

        QuestionDto updatedQuestionDto = questionService.updateQuestion(questionDto);

        assertNotNull(updatedQuestionDto);
        assertEquals("Sample Question", updatedQuestionDto.getContent());
        verify(questionRepository, times(1)).save(any(Question.class));
    }

    @Test
    void testGetQuestionsByQuestionType() {
        when(questionRepository.findByQuestionTypeId(any(Long.class))).thenReturn(Collections.singletonList(question));
        when(modelMapper.map(any(Question.class), eq(QuestionDto.class))).thenReturn(questionDto);

        List<QuestionDto> questionDtos = questionService.getQuestionsByQuestionType(1L);

        assertNotNull(questionDtos);
        assertFalse(questionDtos.isEmpty());
        verify(questionRepository, times(1)).findByQuestionTypeId(any(Long.class));
    }

    @Test
    void testGetQuestions() {
        when(questionRepository.findAll()).thenReturn(Collections.singletonList(question));
        when(modelMapper.map(any(Question.class), eq(QuestionDto.class))).thenReturn(questionDto);

        Set<QuestionDto> questionDtos = questionService.getQuestions();

        assertNotNull(questionDtos);
        assertFalse(questionDtos.isEmpty());
        verify(questionRepository, times(1)).findAll();
    }

    @Test
    void testGetQuestion() {
        when(questionRepository.findById(any(Long.class))).thenReturn(Optional.of(question));
        when(modelMapper.map(any(Question.class), eq(QuestionDto.class))).thenReturn(questionDto);

        QuestionDto foundQuestionDto = questionService.getQuestion(1L);

        assertNotNull(foundQuestionDto);
        assertEquals("Sample Question", foundQuestionDto.getContent());
        verify(questionRepository, times(1)).findById(any(Long.class));
    }

    @Test
    void testDeleteQuestion() {
        when(questionRepository.findById(any(Long.class))).thenReturn(Optional.of(question));

        questionService.deleteQuestion(1L);

        verify(questionRepository, times(1)).deleteById(any(Long.class));
    }

    @Test
    void testCreateQuestion() {
        when(examRepository.findById(any(Long.class))).thenReturn(Optional.of(exam));
        when(questionRepository.save(any(Question.class))).thenReturn(question);
        when(answerOptionRepository.saveAll(any(List.class))).thenReturn(Collections.singletonList(answerOption));

        QuestionCreationDto questionCreationDto = new QuestionCreationDto();
        questionCreationDto.setExamId(1L);
        questionCreationDto.setQuestionList(Collections.singletonList(questionDto));

        boolean result = questionService.createQuestion(Collections.singletonList(questionCreationDto));

        assertTrue(result);
        verify(questionRepository, times(1)).save(any(Question.class));
        verify(answerOptionRepository, times(1)).saveAll(any(List.class));
    }
}
