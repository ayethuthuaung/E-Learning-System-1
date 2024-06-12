package com.ai.e_learning.service;


import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.model.Category;
import com.ai.e_learning.model.Course;

import com.ai.e_learning.repository.CategoryRepository;
import com.ai.e_learning.repository.CourseRepository;
import jakarta.persistence.EntityNotFoundException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CourseService {

  @Autowired
  private CourseRepository courseRepository;

  @Autowired
  private CategoryRepository categoryRepository;

  @Autowired
  private ModelMapper modelMapper;

  public List<CourseDto> getAllCourses() {
    List<Course> allCourses = courseRepository.findAll();
    return allCourses.stream()
      .map(this::convertToDto)
      .collect(Collectors.toList());
  }

  public CourseDto saveCourse(CourseDto courseDto) {
    Course course = convertToEntity(courseDto);
    Set<Category> categories = new HashSet<>();
    for(Long categoryId:courseDto.getCategorylist()){
      Category category=categoryRepository.findById(categoryId).orElseThrow(()->
     new EntityNotFoundException("category not found"));
      categories.add(category);
    }
    course.setCategories(categories);
    System.out.println(courseDto.toString());

    Course savedCourse = courseRepository.save(course);
    int maxDescriptionLength = 255; // Adjust this value based on your database schema
    String truncatedDescription = course.getDescription().substring(0, Math.min(course.getDescription().length(), maxDescriptionLength));


    course.setDescription(truncatedDescription);


    return convertToDto(savedCourse);
  }



  private Course convertToEntity(CourseDto dto) {
    return modelMapper.map(dto, Course.class);
  }


  private CourseDto convertToDto(Course course) {
    return modelMapper.map(course, CourseDto.class);
  }



  public CourseDto getCourseById(Long id) {
    return courseRepository.findById(id)
      .map(this::convertToDto)
      .orElse(null);
  }

  public CourseDto updateCourse(Long id, CourseDto courseDto) {
    return courseRepository.findById(id)
      .map(existingCourse -> {
        // Ensure the ID of the existing entity is retained
        courseDto.setId(existingCourse.getId());
        modelMapper.map(courseDto, existingCourse);
        Course updatedCourse = courseRepository.save(existingCourse);
        return convertToDto(updatedCourse);
      })
      .orElse(null);
  }


  public void softDeleteCourse(Long id) {
    courseRepository.findById(id)
      .ifPresent(course -> {
        course.setDeleted(true);
        courseRepository.save(course);
      });
  }

  public List<CourseDto> getCoursesByCategory(Long categoryId) {
    return courseRepository.findByCategories_Id(categoryId).stream()
      .map(this::convertToDto)
      .collect(Collectors.toList());
  }

  public void addCategoryToCourse(Long courseId, Long categoryId) {
    Optional<Course> courseOpt = courseRepository.findById(courseId);
    Optional<Category> categoryOpt = categoryRepository.findById(categoryId);

    if (courseOpt.isPresent() && categoryOpt.isPresent()) {
      Course course = courseOpt.get();
      Category category = categoryOpt.get();
      course.getCategories().add(category);
      category.getCourses().add(course);
      courseRepository.save(course);
    }
  }
}
