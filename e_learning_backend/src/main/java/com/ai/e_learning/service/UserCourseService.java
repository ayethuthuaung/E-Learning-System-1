package com.ai.e_learning.service;

import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.dto.UserCourseDto;
import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.User;
import com.ai.e_learning.model.UserCourse;

import java.util.List;

public interface UserCourseService {
  UserCourse enrollUserInCourse(Long userId, Long courseId);
  //AT
  List<UserCourseDto> getAllUserCourses();
  void changeStatus(Long id, String status);
  //AT

  UserCourse updateUserCourse(Long userCourseId, boolean completed, int progress, String status);
  User findById(Long userId);
  Course findCourseById(Long courseId);
  List<Course> getCoursesByUserId(Long userId);
  boolean checkEnrollment(Long userId, Long courseId); // Add this method
  boolean checkEnrollmentAcceptance(Long userId, Long courseId);

  List<UserCourseDto> getAllUserCourseByUserId(Long userId);
}
