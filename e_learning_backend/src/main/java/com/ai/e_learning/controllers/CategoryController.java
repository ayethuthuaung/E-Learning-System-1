
package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.CategoryDto;
import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController

@RequestMapping("/api/categories")
public class CategoryController {
  @Autowired
  private CategoryService categoryService;

  @GetMapping(value = "/categorylist", produces = "application/json")
  public List<CategoryDto> getAllCategories() {
    return categoryService.getAllCategories();
  }

  @PostMapping(value = "/addcategory", produces = "application/json")
  public CategoryDto addcategory(@RequestBody CategoryDto category) {

    CategoryDto dto = new CategoryDto();
    dto.setId(category.getId());
    dto.setName(category.getName());
    dto.setCourses(category.getCourses());

    return categoryService.saveCategory(dto);
  }
  @GetMapping(value = "/{id}", produces = "application/json")
  public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Long id) {
    CategoryDto categoryDto = categoryService.getCategoryById(id);
    if (categoryDto!=null){
      return ResponseEntity.ok(categoryDto);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @PutMapping(value = "/update/{id}", produces = "application/json")
  public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id, @RequestBody CategoryDto category) {
    CategoryDto updatedCategory = categoryService.updateCategory(id, category);
    if (updatedCategory != null) {
      return ResponseEntity.ok(updatedCategory);
    } else {
      return ResponseEntity.notFound().build();
    }
  }
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<Void> softDeleteCourse(@PathVariable Long id) {
      categoryService.softDeleteCategory(id);
      return ResponseEntity.noContent().build();
    }
  @GetMapping("/existsByName")
  public boolean isCategoryNameAlreadyExists(@RequestParam String name) {
    return categoryService.isCategoryNameAlreadyExists(name);
  }
  }







