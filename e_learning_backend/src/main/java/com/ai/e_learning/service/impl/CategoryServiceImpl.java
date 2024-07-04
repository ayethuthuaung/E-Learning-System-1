package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.CategoryDto;
import com.ai.e_learning.model.Category;
import com.ai.e_learning.repository.CategoryRepository;
import com.ai.e_learning.service.CategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

  @Autowired
  private CategoryRepository categoryRepository;

  @Autowired
  private ModelMapper modelMapper;

  @Override
  public List<CategoryDto> getAllCategories() {
    List<Category> categories = categoryRepository.findAll();
    for(Category category : categories) {
      System.out.println(category.getName());
    }
    return categories.stream().map(this::convertToDto).collect(Collectors.toList());
  }

  @Override
  public CategoryDto saveCategory(CategoryDto categoryDto) {
    Category category = convertToEntity(categoryDto);
    Category savedCategory = categoryRepository.save(category);
    return convertToDto(savedCategory);
  }

  @Override
  public List<Category> findAll() {
    return categoryRepository.findAll();
  }

  @Override
  public Optional<Category> findById(Long id) {
    return categoryRepository.findById(id);
  }

  @Override
  public CategoryDto getCategoryById(Long id) {
    return categoryRepository.findById(id)
      .map(this::convertToDto)
      .orElse(null);
  }

  @Override
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

  @Override
  public void softDeleteCategory(Long id) {
    categoryRepository.findById(id)
      .ifPresent(category -> {
        category.setDeleted(true);
        categoryRepository.save(category);
      });
  }

  private Category convertToEntity(CategoryDto dto) {
    return modelMapper.map(dto, Category.class);
  }

  private CategoryDto convertToDto(Category category) {
    return modelMapper.map(category, CategoryDto.class);
  }
  @Override
  public boolean isCategoryNameAlreadyExists(String name) {
    return categoryRepository.existsByName(name);
  }

}

