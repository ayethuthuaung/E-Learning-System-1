package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.service.CourseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@WebMvcTest(CourseController.class)
public class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private CourseService courseService;

    @InjectMocks
    private CourseController courseController;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testDisplayCourse_AllCourses() throws Exception {
        CourseDto course1 = new CourseDto();
        course1.setId(1L);
        course1.setName("Course 1");

        CourseDto course2 = new CourseDto();
        course2.setId(2L);
        course2.setName("Course 2");

        List<CourseDto> courses = Arrays.asList(course1, course2);

        when(courseService.getAllCourseList()).thenReturn(courses);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/courses/courselist")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Course 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(2L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("Course 2"));
    }

    @Test
    public void testGetCourseById_Success() throws Exception {
        CourseDto courseDto = new CourseDto();
        courseDto.setId(1L);
        courseDto.setName("Course Test");

        when(courseService.getCourseById(anyLong())).thenReturn(courseDto);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/courses/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Course Test"));
    }

    @Test
    public void testGetCoursesByCategory_Success() throws Exception {
        CourseDto course1 = new CourseDto();
        course1.setId(1L);
        course1.setName("Course 1");

        CourseDto course2 = new CourseDto();
        course2.setId(2L);
        course2.setName("Course 2");

        List<CourseDto> courses = Arrays.asList(course1, course2);

        when(courseService.getCoursesByCategory(anyLong())).thenReturn(courses);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/courses/byCategory/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Course 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(2L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("Course 2"));
    }

    @Test
    public void testIsCourseNameAlreadyExists_True() throws Exception {
        when(courseService.isCourseNameAlreadyExists(anyString())).thenReturn(true);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/courses/existsByName")
                        .param("name", "Test Course")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("true"));
    }

    @Test
    public void testIsCourseNameAlreadyExists_False() throws Exception {
        when(courseService.isCourseNameAlreadyExists(anyString())).thenReturn(false);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/courses/existsByName")
                        .param("name", "Test Course")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("false"));
    }
}
