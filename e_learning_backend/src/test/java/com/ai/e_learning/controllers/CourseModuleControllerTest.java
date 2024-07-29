package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.CourseModuleDto;
import com.ai.e_learning.dto.LessonDto;
import com.ai.e_learning.service.CourseModuleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@WebMvcTest(CourseModuleController.class)
public class CourseModuleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private CourseModuleService courseModuleService;

    @InjectMocks
    private CourseModuleController courseModuleController;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetModuleById_Success() throws Exception {
        CourseModuleDto courseModuleDto = new CourseModuleDto();
        courseModuleDto.setId(1L);
        courseModuleDto.setName("Module 1");

        when(courseModuleService.getModuleById(anyLong())).thenReturn(courseModuleDto);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/modules/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Module 1"));
    }

    @Test
    public void testCreateModules_Success() throws Exception {
        CourseModuleDto courseModuleDto = new CourseModuleDto();
        courseModuleDto.setName("Module 1");

        MockMultipartFile file = new MockMultipartFile("files", "test.txt", "text/plain", "some content".getBytes());

        List<CourseModuleDto> courseModuleDtos = Arrays.asList(courseModuleDto);

        // Set up the mock to do nothing
        doNothing().when(courseModuleService).createModules(anyList(), anyList());

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/modules/createModules")
                        .file(file)
                        .param("modules", objectMapper.writeValueAsString(courseModuleDtos))
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("CourseModules created successfully"));
    }


    @Test
    public void testUpdateModule_Success() throws Exception {
        CourseModuleDto courseModuleDto = new CourseModuleDto();
        courseModuleDto.setName("Updated Module");

        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "some content".getBytes());

        Map<String, String> response = new HashMap<>();
        response.put("message", "CourseModules updated successfully");

        when(courseModuleService.updateModule(anyLong(), any(CourseModuleDto.class))).thenReturn(courseModuleDto);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/modules/1")
                        .file(file)
                        .param("module", objectMapper.writeValueAsString(courseModuleDto))
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("CourseModules updated successfully"));
    }

    @Test
    public void testDeleteModule_Success() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/modules/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    public void testGetAllModules_Success() throws Exception {
        CourseModuleDto courseModuleDto1 = new CourseModuleDto();
        courseModuleDto1.setId(1L);
        courseModuleDto1.setName("Module 1");

        CourseModuleDto courseModuleDto2 = new CourseModuleDto();
        courseModuleDto2.setId(2L);
        courseModuleDto2.setName("Module 2");

        List<CourseModuleDto> modules = Arrays.asList(courseModuleDto1, courseModuleDto2);

        when(courseModuleService.getAllModules()).thenReturn(modules);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/modules")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Module 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(2L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("Module 2"));
    }

    @Test
    public void testGetLessonsByModuleId_Success() throws Exception {
        LessonDto lessonDto1 = new LessonDto();
        lessonDto1.setId(1L);
        lessonDto1.setTitle("Lesson 1");

        LessonDto lessonDto2 = new LessonDto();
        lessonDto2.setId(2L);
        lessonDto2.setTitle("Lesson 2");

        List<LessonDto> lessons = Arrays.asList(lessonDto1, lessonDto2);

        when(courseModuleService.getLessonsByModuleId(anyLong())).thenReturn(lessons);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/modules/lessons/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].title").value("Lesson 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(2L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].title").value("Lesson 2"));
    }

    // Additional tests for other endpoints
}
