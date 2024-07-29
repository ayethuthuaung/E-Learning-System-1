package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.UserCourseModuleDto;
import com.ai.e_learning.service.UserCourseModuleService;
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
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserCourseModuleController.class)
class UserCourseModuleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserCourseModuleService userCourseModuleService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    @Test
    void markModuleAsDone_ShouldReturnOk() throws Exception {
        UserCourseModuleDto userCourseModuleDto = new UserCourseModuleDto();
        when(userCourseModuleService.markModuleAsDone(anyLong(), anyLong())).thenReturn(userCourseModuleDto);

        mockMvc.perform(post("/api/userCourseModules/markAsDone")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("userId", 1L, "moduleId", 1L))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNotEmpty());
    }

    @Test
    void markModuleAsDone_ShouldReturnNotFound() throws Exception {
        when(userCourseModuleService.markModuleAsDone(anyLong(), anyLong())).thenThrow(new IllegalArgumentException("Module not found"));

        mockMvc.perform(post("/api/userCourseModules/markAsDone")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("userId", 1L, "moduleId", 1L))))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Module not found"));
    }

    @Test
    void getModuleCompletionStatus_ShouldReturnOk() throws Exception {
        when(userCourseModuleService.getModuleCompletionStatus(anyLong(), anyLong())).thenReturn(true);

        mockMvc.perform(get("/api/userCourseModules/status/1/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void getModuleCompletionStatus_ShouldReturnInternalServerError() throws Exception {
        when(userCourseModuleService.getModuleCompletionStatus(anyLong(), anyLong())).thenThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(get("/api/userCourseModules/status/1/1"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Unexpected error"));
    }
}
