package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.CategoryDto;
import com.ai.e_learning.service.CategoryService;
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
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@WebMvcTest(CategoryController.class)
public class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private CategoryController categoryController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllCategories() throws Exception {
        CategoryDto category = new CategoryDto();
        category.setId(1L);
        category.setName("Test Category");

        when(categoryService.getAllCategories()).thenReturn(Arrays.asList(category));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/categories/categorylist")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Test Category"));
    }

    @Test
    public void testAddCategory() throws Exception {
        CategoryDto category = new CategoryDto();
        category.setId(1L);
        category.setName("Test Category");

        when(categoryService.saveCategory(any(CategoryDto.class))).thenReturn(category);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/categories/addcategory")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\": 1, \"name\": \"Test Category\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Test Category"));
    }

    @Test
    public void testGetCategoryById() throws Exception {
        CategoryDto category = new CategoryDto();
        category.setId(1L);
        category.setName("Test Category");

        when(categoryService.getCategoryById(anyLong())).thenReturn(category);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/categories/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Test Category"));
    }

    @Test
    public void testUpdateCategory() throws Exception {
        CategoryDto category = new CategoryDto();
        category.setId(1L);
        category.setName("Updated Category");

        when(categoryService.updateCategory(anyLong(), any(CategoryDto.class))).thenReturn(category);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/categories/update/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\": 1, \"name\": \"Updated Category\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Updated Category"));
    }

    @Test
    public void testSoftDeleteCategory() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/categories/delete/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    public void testIsCategoryNameAlreadyExists() throws Exception {
        when(categoryService.isCategoryNameAlreadyExists(anyString())).thenReturn(true);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/categories/existsByName")
                        .param("name", "Test Category")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("true"));
    }

    @Test
    public void testGetCourseCountsPerCategory() throws Exception {
        Map<String, Long> courseCounts = Collections.singletonMap("Test Category", 10L);

        when(categoryService.getCourseCountsPerCategory()).thenReturn(courseCounts);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/categories/course-counts")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.['Test Category']").value(10L));
    }
}
