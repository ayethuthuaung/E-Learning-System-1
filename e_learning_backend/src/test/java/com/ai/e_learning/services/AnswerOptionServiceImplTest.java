package com.ai.e_learning.services;

import com.ai.e_learning.dto.AnswerOptionDto;
import com.ai.e_learning.model.AnswerOption;
import com.ai.e_learning.model.Question;
import com.ai.e_learning.repository.AnswerOptionRepository;
import com.ai.e_learning.repository.QuestionRepository;
import com.ai.e_learning.service.impl.AnswerOptionServiceImpl;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.modelmapper.ModelMapper;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class AnswerOptionServiceImplTest {

    @InjectMocks
    private AnswerOptionServiceImpl answerOptionService;

    @Mock
    private AnswerOptionRepository answerOptionRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private ModelMapper modelMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addAnswerOption_ShouldReturnSavedAnswerOption() {
        AnswerOptionDto answerOptionDto = new AnswerOptionDto();
        answerOptionDto.setQuestionId(1L);
        AnswerOption answerOption = new AnswerOption();
        Question question = new Question();

        when(questionRepository.findById(anyLong())).thenReturn(Optional.of(question));
        when(modelMapper.map(answerOptionDto, AnswerOption.class)).thenReturn(answerOption);
        when(answerOptionRepository.save(any(AnswerOption.class))).thenReturn(answerOption);
        when(modelMapper.map(answerOption, AnswerOptionDto.class)).thenReturn(answerOptionDto);

        AnswerOptionDto result = answerOptionService.addAnswerOption(answerOptionDto);

        assertEquals(answerOptionDto, result);
        verify(answerOptionRepository).save(any(AnswerOption.class));
    }

    @Test
    void updateAnswerOption_ShouldReturnUpdatedAnswerOption() {
        AnswerOptionDto answerOptionDto = new AnswerOptionDto();
        answerOptionDto.setId(1L);
        answerOptionDto.setQuestionId(1L);
        AnswerOption answerOption = new AnswerOption();
        Question question = new Question();

        when(answerOptionRepository.findById(anyLong())).thenReturn(Optional.of(answerOption));
        when(questionRepository.findById(anyLong())).thenReturn(Optional.of(question));
        when(answerOptionRepository.save(any(AnswerOption.class))).thenReturn(answerOption);
        when(modelMapper.map(answerOption, AnswerOptionDto.class)).thenReturn(answerOptionDto);

        AnswerOptionDto result = answerOptionService.updateAnswerOption(answerOptionDto);

        assertEquals(answerOptionDto, result);
        verify(answerOptionRepository).save(any(AnswerOption.class));
    }

    @Test
    void getAnswerOptions_ShouldReturnSetOfAnswerOptions() {
        AnswerOption answerOption = new AnswerOption();
        List<AnswerOption> answerOptionList = List.of(answerOption);
        AnswerOptionDto answerOptionDto = new AnswerOptionDto();

        when(answerOptionRepository.findAll()).thenReturn(answerOptionList);
        when(modelMapper.map(answerOption, AnswerOptionDto.class)).thenReturn(answerOptionDto);

        Set<AnswerOptionDto> result = answerOptionService.getAnswerOptions();

        assertEquals(1, result.size());
        verify(answerOptionRepository).findAll();
    }

    @Test
    void getAnswerOption_ShouldReturnAnswerOption() {
        AnswerOption answerOption = new AnswerOption();
        AnswerOptionDto answerOptionDto = new AnswerOptionDto();

        when(answerOptionRepository.findById(anyLong())).thenReturn(Optional.of(answerOption));
        when(modelMapper.map(answerOption, AnswerOptionDto.class)).thenReturn(answerOptionDto);

        AnswerOptionDto result = answerOptionService.getAnswerOption(1L);

        assertEquals(answerOptionDto, result);
        verify(answerOptionRepository).findById(anyLong());
    }

    @Test
    void deleteAnswerOption_ShouldCallRepositoryDelete() {
        doNothing().when(answerOptionRepository).deleteById(anyLong());

        answerOptionService.deleteAnswerOption(1L);

        verify(answerOptionRepository).deleteById(anyLong());
    }
}
