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

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


public interface CourseService {
  List<CourseDto> getAllCourses(String status);
  List<CourseDto> getAllCourseList();
  CourseDto saveCourse(CourseDto courseDto) throws IOException, GeneralSecurityException;
  CourseDto getCourseById(Long id);
  CourseDto updateCourse(Long id, CourseDto courseDto);
  void softDeleteCourse(Long id);
  List<CourseDto> getCoursesByCategory(Long categoryId);
  void addCategoryToCourse(Long courseId, Long categoryId);
  boolean isCourseNameAlreadyExists(String name);
  void changeStatus(Long id,String status);
  List<CourseDto> getCoursesByUserId(Long userId);

}
