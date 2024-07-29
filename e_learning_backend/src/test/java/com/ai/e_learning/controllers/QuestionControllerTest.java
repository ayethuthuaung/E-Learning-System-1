package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.QuestionCreationDto;
import com.ai.e_learning.dto.QuestionDto;
import com.ai.e_learning.service.QuestionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@WebMvcTest(QuestionController.class)
public class QuestionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuestionService questionService;

    @InjectMocks
    private QuestionController questionController;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateQuestion_Success() throws Exception {
        QuestionDto questionCreationDto = new QuestionDto();
        questionCreationDto.setContent("Sample question");

        when(questionService.createQuestion(any(List.class))).thenReturn(true);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/question/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Arrays.asList(questionCreationDto))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("true"));
    }

    @Test
    public void testGetQuestion_Success() throws Exception {
        QuestionDto questionDto = new QuestionDto();
        questionDto.setId(1L);
        questionDto.setContent("Sample question");

        when(questionService.getQuestion(anyLong())).thenReturn(questionDto);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/question/viewOne/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.questionText").value("Sample question"));
    }

    @Test
    public void testGetQuestions_Success() throws Exception {
        QuestionDto questionDto1 = new QuestionDto();
        questionDto1.setId(1L);
        questionDto1.setContent("Sample question 1");

        QuestionDto questionDto2 = new QuestionDto();
        questionDto2.setId(2L);
        questionDto2.setContent("Sample question 2");

        Set<QuestionDto> questions = new HashSet<>(Arrays.asList(questionDto1, questionDto2));

        when(questionService.getQuestions()).thenReturn(questions);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/question/viewList")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].questionText").value("Sample question"));
    }
}
