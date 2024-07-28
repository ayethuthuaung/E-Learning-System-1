package com.ai.e_learning.services;

import com.ai.e_learning.dto.CategoryDto;
import com.ai.e_learning.model.Category;
import com.ai.e_learning.repository.CategoryRepository;
import com.ai.e_learning.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.modelmapper.ModelMapper;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class CategoryServiceImplTest {

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ModelMapper modelMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllCategories_ShouldReturnCategoryDtos() {
        Category category = new Category();
        category.setName("TestCategory");
        List<Category> categories = List.of(category);
        CategoryDto categoryDto = new CategoryDto();

        when(categoryRepository.findAll()).thenReturn(categories);
        when(modelMapper.map(any(Category.class), eq(CategoryDto.class))).thenReturn(categoryDto);

        List<CategoryDto> result = categoryService.getAllCategories();

        assertEquals(1, result.size());
        verify(categoryRepository).findAll();
        verify(modelMapper).map(any(Category.class), eq(CategoryDto.class));
    }

    @Test
    void saveCategory_ShouldReturnSavedCategoryDto() {
        Category category = new Category();
        CategoryDto categoryDto = new CategoryDto();

        when(modelMapper.map(any(CategoryDto.class), eq(Category.class))).thenReturn(category);
        when(categoryRepository.save(any(Category.class))).thenReturn(category);
        when(modelMapper.map(any(Category.class), eq(CategoryDto.class))).thenReturn(categoryDto);

        CategoryDto result = categoryService.saveCategory(categoryDto);

        assertEquals(categoryDto, result);
        verify(categoryRepository).save(any(Category.class));
        verify(modelMapper).map(any(CategoryDto.class), eq(Category.class));
        verify(modelMapper).map(any(Category.class), eq(CategoryDto.class));
    }

    @Test
    void findAll_ShouldReturnAllCategories() {
        List<Category> categories = List.of(new Category());

        when(categoryRepository.findAll()).thenReturn(categories);

        List<Category> result = categoryService.findAll();

        assertEquals(1, result.size());
        verify(categoryRepository).findAll();
    }

    @Test
    void findById_ShouldReturnCategory() {
        Category category = new Category();
        Long categoryId = 1L;

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));

        Optional<Category> result = categoryService.findById(categoryId);

        assertTrue(result.isPresent());
        assertEquals(category, result.get());
        verify(categoryRepository).findById(categoryId);
    }

    @Test
    void getCategoryById_ShouldReturnCategoryDto() {
        Category category = new Category();
        CategoryDto categoryDto = new CategoryDto();
        Long categoryId = 1L;

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(modelMapper.map(any(Category.class), eq(CategoryDto.class))).thenReturn(categoryDto);

        CategoryDto result = categoryService.getCategoryById(categoryId);

        assertEquals(categoryDto, result);
        verify(categoryRepository).findById(categoryId);
        verify(modelMapper).map(any(Category.class), eq(CategoryDto.class));
    }

    @Test
    void updateCategory_ShouldReturnUpdatedCategoryDto() {
        Category category = new Category();
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(1L);
        Long categoryId = 1L;

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(modelMapper.map(any(CategoryDto.class), eq(Category.class))).thenReturn(category);
        when(categoryRepository.save(any(Category.class))).thenReturn(category);
        when(modelMapper.map(any(Category.class), eq(CategoryDto.class))).thenReturn(categoryDto);

        CategoryDto result = categoryService.updateCategory(categoryId, categoryDto);

        assertEquals(categoryDto, result);
        verify(categoryRepository).findById(categoryId);
        verify(modelMapper).map(any(CategoryDto.class), eq(Category.class));
        verify(categoryRepository).save(any(Category.class));
        verify(modelMapper).map(any(Category.class), eq(CategoryDto.class));
    }

    @Test
    void softDeleteCategory_ShouldSetDeletedTrue() {
        Category category = new Category();
        Long categoryId = 1L;

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        categoryService.softDeleteCategory(categoryId);

        assertTrue(category.isDeleted());
        verify(categoryRepository).findById(categoryId);
        verify(categoryRepository).save(category);
    }

    @Test
    void getCourseCountsPerCategory_ShouldReturnCourseCountsMap() {
        Category category = new Category();
        category.setName("TestCategory");
        when(categoryRepository.findAll()).thenReturn(List.of(category));

        Map<String, Long> result = categoryService.getCourseCountsPerCategory();

        assertEquals(1, result.size());
        assertTrue(result.containsKey("TestCategory"));
        verify(categoryRepository).findAll();
    }

    @Test
    void isCategoryNameAlreadyExists_ShouldReturnTrueIfNameExists() {
        String categoryName = "TestCategory";

        when(categoryRepository.existsByName(categoryName)).thenReturn(true);

        boolean result = categoryService.isCategoryNameAlreadyExists(categoryName);

        assertTrue(result);
        verify(categoryRepository).existsByName(categoryName);
    }
}
