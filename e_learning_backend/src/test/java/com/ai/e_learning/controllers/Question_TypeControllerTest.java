package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.QuestionTypeDto;
import com.ai.e_learning.service.Question_TypeService;
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
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@WebMvcTest(Question_TypeController.class)
public class Question_TypeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private Question_TypeService questionTypeService;

    @InjectMocks
    private Question_TypeController questionTypeController;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testAddQuestionType_Success() throws Exception {
        QuestionTypeDto questionTypeDto = new QuestionTypeDto();
        questionTypeDto.setId(1L);
        questionTypeDto.setType("Multiple Choice");

        when(questionTypeService.addQuestionType(any(QuestionTypeDto.class))).thenReturn(questionTypeDto);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/questionType/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(questionTypeDto)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Multiple Choice"));
    }

    @Test
    public void testGetQuestionType_Success() throws Exception {
        QuestionTypeDto questionTypeDto = new QuestionTypeDto();
        questionTypeDto.setId(1L);
        questionTypeDto.setType("Multiple Choice");

        when(questionTypeService.getQuestionType(anyLong())).thenReturn(questionTypeDto);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/questionType/viewOne/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Multiple Choice"));
    }

    @Test
    public void testGetQuestionTypes_Success() throws Exception {
        QuestionTypeDto questionTypeDto1 = new QuestionTypeDto();
        questionTypeDto1.setId(1L);
        questionTypeDto1.setType("Multiple Choice");

        QuestionTypeDto questionTypeDto2 = new QuestionTypeDto();
        questionTypeDto2.setId(2L);
        questionTypeDto2.setType("True/False");

        List<QuestionTypeDto> questionTypes = Arrays.asList(questionTypeDto1, questionTypeDto2);

        when(questionTypeService.getQuestionTypes()).thenReturn(questionTypes);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/questionType/viewList")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Multiple Choice"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(2L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("True/False"));
    }

    @Test
    public void testUpdateQuestionType_Success() throws Exception {
        QuestionTypeDto questionTypeDto = new QuestionTypeDto();
        questionTypeDto.setId(1L);
        questionTypeDto.setType("Updated Multiple Choice");

        when(questionTypeService.updateQuestionType(any(QuestionTypeDto.class))).thenReturn(questionTypeDto);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/questionType/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(questionTypeDto)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Updated Multiple Choice"));
    }

    @Test
    public void testDeleteQuestionType_Success() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/questionType/delete/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}
