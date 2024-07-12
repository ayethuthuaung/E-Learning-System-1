package com.ai.e_learning.service;

import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.model.UserCourse;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

public interface CourseService {
  List<CourseDto> getAllCoursesByStatus(String status);
  CourseDto saveCourse(CourseDto courseDto) throws IOException, GeneralSecurityException;
  CourseDto getCourseById(Long id);
  CourseDto updateCourse(Long id, CourseDto courseDto);
  void softDeleteCourse(Long id);
  List<CourseDto> getCoursesByCategory(Long categoryId);
  void addCategoryToCourse(Long courseId, Long categoryId);
  boolean isCourseNameAlreadyExists(String name);
  void changeStatus(Long id,String status);
  List<CourseDto> getCoursesByUserId(Long userId);

  List<CourseDto> getAllCourses();

  List<CourseDto> getLatestAcceptedCourses();
}
