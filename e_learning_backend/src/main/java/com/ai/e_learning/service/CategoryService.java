package com.ai.e_learning.service;

import com.ai.e_learning.dto.CategoryDto;
import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.model.Category;
import com.ai.e_learning.model.Course;
import com.ai.e_learning.repository.CategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService {
  @Autowired
  private CategoryRepository categoryRepository;
  @Autowired
  private ModelMapper modelMapper;

  public CategoryDto saveCategory(CategoryDto categoryDto) {
    Category category = convertToEntity(categoryDto);
    Category savedCategory = categoryRepository.save(category);
    return convertToDto(savedCategory);
  }
  private Category convertToEntity(CategoryDto dto) {
    return modelMapper.map(dto, Category.class);
  }

  private CategoryDto convertToDto(Category category) {
    return modelMapper.map(category, CategoryDto.class);
  }

  public List<Category> findAll() {
    return categoryRepository.findAll();
  }

  public Optional<Category> findById(Long id) {
    return categoryRepository.findById(id);
  }


  public CategoryDto getCategoryById(Long id) {
    return categoryRepository.findById(id)
      .map(this::convertToDto)
      .orElse(null);
  }


  public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
    return categoryRepository.findById(id)
      .map(existingCategory -> {
        // Ensure the ID of the existing entity is retained
        categoryDto.setId(existingCategory.getId());
        modelMapper.map(categoryDto, existingCategory);
        Category updateCategory = categoryRepository.save(existingCategory);
        return convertToDto(updateCategory);
      })
      .orElse(null);
  }
  public void softDeleteCategory(Long id) {
    categoryRepository.findById(id)
      .ifPresent(category -> {
        category.setDeleted(true);
        categoryRepository.save(category);
      });
  }



}

