package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.AnswerOptionDto;
import com.ai.e_learning.service.AnswerOptionService;
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
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Set;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;

@WebMvcTest(AnswerOptionController.class)
public class AnswerOptionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private AnswerOptionService answerOptionService;

    @InjectMocks
    private AnswerOptionController answerOptionController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(answerOptionController).build();
    }

    @Test
    public void testAddAnswerOption() throws Exception {
        AnswerOptionDto dto = new AnswerOptionDto(); // Populate with test data
        when(answerOptionService.addAnswerOption(dto)).thenReturn(dto);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/answerOption/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"property\": \"value\" }")) // Replace with actual JSON
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.property").value("value")); // Adjust JSON path as needed
    }

    @Test
    public void testGetAnswerOption() throws Exception {
        AnswerOptionDto dto = new AnswerOptionDto(); // Populate with test data
        when(answerOptionService.getAnswerOption(1L)).thenReturn(dto);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/answerOption/viewOne/1"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.property").value("value")); // Adjust JSON path as needed
    }

    @Test
    public void testGetAnswerOptions() throws Exception {
        Set<AnswerOptionDto> dtoSet = Set.of(new AnswerOptionDto()); // Populate with test data
        when(answerOptionService.getAnswerOptions()).thenReturn(dtoSet);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/answerOption/viewList"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].property").value("value")); // Adjust JSON path as needed
    }

    @Test
    public void testUpdateAnswerOption() throws Exception {
        AnswerOptionDto dto = new AnswerOptionDto(); // Populate with test data
        when(answerOptionService.updateAnswerOption(dto)).thenReturn(dto);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/answerOption/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"property\": \"value\" }")) // Replace with actual JSON
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.property").value("value")); // Adjust JSON path as needed
    }

    @Test
    public void testDeleteAnswerOption() throws Exception {
        doNothing().when(answerOptionService).deleteAnswerOption(1L);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/answerOption/delete/1"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }
}
