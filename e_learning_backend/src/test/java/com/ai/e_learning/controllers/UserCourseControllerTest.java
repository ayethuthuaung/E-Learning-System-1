package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.UserCourseDto;
import com.ai.e_learning.service.UserCourseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserCourseController.class)
class UserCourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserCourseService userCourseService;

    @MockBean
    private ModelMapper modelMapper;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    @Test
    void enrollUserInCourse_ShouldReturnCreated() throws Exception {
        UserCourseDto userCourseDto = new UserCourseDto();
        when(userCourseService.enrollUserInCourse(anyLong(), anyLong())).thenReturn(userCourseDto);

        mockMvc.perform(post("/api/user-course/enroll")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("userId", 1L, "courseId", 1L))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty());
    }

    @Test
    void displayUserCourse_ShouldReturnListOfUserCourses() throws Exception {
        List<UserCourseDto> userCourses = Collections.singletonList(new UserCourseDto());
        when(userCourseService.getAllUserCourseByUserId(anyLong())).thenReturn(userCourses);

        mockMvc.perform(get("/api/user-course/userCourselist")
                        .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").isNotEmpty());
    }

    @Test
    void changeStatus_ShouldReturnOk() throws Exception {
        mockMvc.perform(post("/api/user-course/change-status/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "completed"))))
                .andExpect(status().isOk());
    }

    @Test
    void updateUserCourse_ShouldReturnUpdatedUserCourse() throws Exception {
        UserCourseDto userCourseDto = new UserCourseDto();
        when(userCourseService.updateUserCourse(anyLong(), anyBoolean(), anyInt(), anyString())).thenReturn(userCourseDto);

        mockMvc.perform(put("/api/user-course/update/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userCourseDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNotEmpty());
    }

    @Test
    void getCoursesByUserId_ShouldReturnListOfCourses() throws Exception {
        List<UserCourseDto> userCourses = Collections.singletonList(new UserCourseDto());
        when(userCourseService.getCoursesByUserId(anyLong())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/user-course/user/1/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").isNotEmpty());
    }
}

