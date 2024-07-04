package com.ai.e_learning.service;

import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.User;
import com.ai.e_learning.model.UserCourse;

import java.util.List;

public interface UserCourseService {
  UserCourse enrollUserInCourse(Long userId, Long courseId);
  UserCourse updateUserCourse(Long userCourseId, boolean completed, int progress);
  User findById(Long userId);
  Course findCourseById(Long courseId);
  List<Course> getCoursesByUserId(Long userId);
}

