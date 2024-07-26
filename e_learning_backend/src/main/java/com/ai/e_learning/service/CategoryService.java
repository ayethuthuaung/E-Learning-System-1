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
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


public interface CategoryService {
  List<CategoryDto> getAllCategories();
  CategoryDto saveCategory(CategoryDto categoryDto);
  List<Category> findAll();
  Optional<Category> findById(Long id);
  CategoryDto getCategoryById(Long id);
  CategoryDto updateCategory(Long id, CategoryDto categoryDto);
  void softDeleteCategory(Long id);
  boolean isCategoryNameAlreadyExists(String name);
  Map<String, Long> getCourseCountsPerCategory();
}


