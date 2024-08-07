package com.ai.e_learning.service;

import com.ai.e_learning.dto.UserCourseDto;
import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.User;
import com.ai.e_learning.model.UserCourse;

import java.util.List;
import java.util.Map;

public interface UserCourseService {
  //AT
  List<UserCourseDto> getAllUserCourses();
  //PK
  List<UserCourseDto> getAllAcceptedUserCourses();
  void changeStatus(Long id, String status);
  //AT
  UserCourseDto enrollUserInCourse(Long userId, Long courseId);

  UserCourseDto updateUserCourse(Long userCourseId, boolean completed, int progress, String status);
  User findById(Long userId);
  Course findCourseById(Long courseId);
  List<Course> getCoursesByUserId(Long userId);
  boolean checkEnrollment(Long userId, Long courseId);
  int checkEnrollmentAcceptance(Long userId, Long courseId);

  List<UserCourseDto> getAllUserCourseByUserId(Long userId);

  //PK
  Map<String, Long> getAcceptedUserCountsByCourse();
  List<Course> getTrendingCourses();

  Map<String, Long> getAcceptedStudentCount();

  Map<String, Double> getCourseAttendanceByInstructor(Long userId);
  Map<String, Long> getMonthlyStudentCounts();


}
