package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.LessonDto;
import com.ai.e_learning.service.LessonService;
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

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@WebMvcTest(LessonController.class)
public class LessonControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LessonService lessonService;

    @InjectMocks
    private LessonController lessonController;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateLesson_Success() throws Exception {
        LessonDto lessonDto = new LessonDto();
        // Set necessary fields for LessonDto

        when(lessonService.createLesson(any(LessonDto.class))).thenReturn(lessonDto);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/lessons/createLesson")
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .flashAttr("lessonDto", lessonDto))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(lessonDto.getId()));
    }

    @Test
    public void testGetAllLessons_Success() throws Exception {
        LessonDto lessonDto1 = new LessonDto();
        lessonDto1.setId(1L);
        lessonDto1.setTitle("Lesson 1");

        LessonDto lessonDto2 = new LessonDto();
        lessonDto2.setId(2L);
        lessonDto2.setTitle("Lesson 2");

        List<LessonDto> lessons = Arrays.asList(lessonDto1, lessonDto2);

        when(lessonService.getAllLessons()).thenReturn(lessons);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/lessons/getAllLessons")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Lesson 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(2L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("Lesson 2"));
    }

    @Test
    public void testGetLessonsByCourseId_Success() throws Exception {
        LessonDto lessonDto1 = new LessonDto();
        lessonDto1.setId(1L);
        lessonDto1.setTitle("Lesson 1");

        LessonDto lessonDto2 = new LessonDto();
        lessonDto2.setId(2L);
        lessonDto2.setTitle("Lesson 2");

        List<LessonDto> lessons = Arrays.asList(lessonDto1, lessonDto2);

        when(lessonService.getLessonsByCourseId(anyLong(), anyLong())).thenReturn(lessons);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/lessons/getLessonsByCourse/1/user/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Lesson 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(2L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("Lesson 2"));
    }

    @Test
    public void testGetLessonById_Success() throws Exception {
        LessonDto lessonDto = new LessonDto();
        lessonDto.setId(1L);
        lessonDto.setTitle("Lesson 1");

        when(lessonService.getLessonById(anyLong())).thenReturn(lessonDto);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/lessons/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Lesson 1"));
    }

    @Test
    public void testUpdateLesson_Success() throws Exception {
        LessonDto lessonDto = new LessonDto();
        lessonDto.setId(1L);
        lessonDto.setTitle("Updated Lesson");

        when(lessonService.updateLesson(anyLong(), any(LessonDto.class))).thenReturn(lessonDto);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/lessons/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(lessonDto)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Updated Lesson"));
    }

    @Test
    public void testDeleteLesson_Success() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/lessons/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}
