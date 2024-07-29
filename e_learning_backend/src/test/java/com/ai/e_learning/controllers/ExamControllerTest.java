package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.*;
import com.ai.e_learning.service.ExamService;
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

@WebMvcTest(ExamController.class)
public class ExamControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExamService examService;

    @InjectMocks
    private ExamController examController;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateExam_Success() throws Exception {
        ExamCreationDto examCreationDto = new ExamCreationDto();
        // Set necessary fields for ExamCreationDto

        when(examService.createExam(any(ExamCreationDto.class))).thenReturn(true);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/exam/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(examCreationDto)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("true"));
    }

    @Test
    public void testGetExam_Success() throws Exception {
        ExamDto examDto = new ExamDto();
        examDto.setId(1L);
        examDto.setTitle("Exam 1");

        when(examService.getExam(anyLong())).thenReturn(examDto);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/exam/viewOne/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Exam 1"));
    }

    @Test
    public void testGetExams_Success() throws Exception {
        ExamDto examDto1 = new ExamDto();
        examDto1.setId(1L);
        examDto1.setTitle("Exam 1");

        ExamDto examDto2 = new ExamDto();
        examDto2.setId(2L);
        examDto2.setTitle("Exam 2");

        List<ExamDto> exams = Arrays.asList(examDto1, examDto2);

        when(examService.getExams()).thenReturn(exams);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/exam/viewList")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Exam 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(2L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("Exam 2"));
    }

    @Test
    public void testUpdateExam_Success() throws Exception {
        ExamDto examDto = new ExamDto();
        examDto.setId(1L);
        examDto.setTitle("Updated Exam");

        when(examService.updateExam(any(ExamDto.class))).thenReturn(examDto);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/exam/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(examDto)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Updated Exam"));
    }

    @Test
    public void testDeleteExam_Success() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/exam/delete/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    public void testGetExamById_Success() throws Exception {
        ExamDto examDto = new ExamDto();
        examDto.setId(1L);
        examDto.setTitle("Exam 1");

        when(examService.getExamById(anyLong())).thenReturn(examDto);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/exam/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Exam 1"));
    }

    @Test
    public void testGetExamWithQuestions_Success() throws Exception {
        ExamDto examDto = new ExamDto();
        examDto.setId(1L);
        examDto.setTitle("Exam 1");
        // Set other fields as necessary

        when(examService.getExamWithQuestions(anyLong())).thenReturn(examDto);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/exam/examsWithQuestions/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Exam 1"));
    }

    @Test
    public void testGetExamByLessonId_Success() throws Exception {
        ExamListDto examListDto1 = new ExamListDto();
        examListDto1.setId(1L);
        examListDto1.setTitle("Exam 1");

        ExamListDto examListDto2 = new ExamListDto();
        examListDto2.setId(2L);
        examListDto2.setTitle("Exam 2");

        List<ExamListDto> exams = Arrays.asList(examListDto1, examListDto2);

        when(examService.getExamByLessonId(anyLong())).thenReturn(exams);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/exam/byLesson/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Exam 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(2L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("Exam 2"));
    }
}
