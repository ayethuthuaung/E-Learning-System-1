package com.ai.e_learning.service.impl;

import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.User;
import com.ai.e_learning.model.UserCourse;
import com.ai.e_learning.repository.CourseRepository;
import com.ai.e_learning.repository.UserCourseRepository;
import com.ai.e_learning.repository.UserRepository;
import com.ai.e_learning.service.UserCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserCourseServiceImpl implements UserCourseService {

  private final UserRepository userRepository;
  private final CourseRepository courseRepository;
  private final UserCourseRepository userCourseRepository;

  @Autowired
  public UserCourseServiceImpl(UserRepository userRepository, CourseRepository courseRepository,
                               UserCourseRepository userCourseRepository) {
    this.userRepository = userRepository;
    this.courseRepository = courseRepository;
    this.userCourseRepository = userCourseRepository;
  }

  @Override
  public UserCourse enrollUserInCourse(Long userId, Long courseId) {
    User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
    Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("Course not found"));

    UserCourse userCourse = new UserCourse();
    userCourse.setUser(user);
    userCourse.setCourse(course);
    //userCourse.setEnrolled(true);
    userCourse.setCompleted(false);
    userCourse.setProgress(0);

    return userCourseRepository.save(userCourse);
  }

  @Override
  public UserCourse updateUserCourse(Long userCourseId, boolean completed, int progress) {
    UserCourse userCourse = userCourseRepository.findById(userCourseId)
      .orElseThrow(() -> new IllegalArgumentException("UserCourse not found"));

    userCourse.setCompleted(completed);
    userCourse.setProgress(progress);

    return userCourseRepository.save(userCourse);
  }

  @Override
  public User findById(Long userId) {
    return userRepository.findById(userId).orElse(null);
  }

  @Override
  public Course findCourseById(Long courseId) {
    return courseRepository.findById(courseId).orElse(null);
  }

  @Override
  public List<Course> getCoursesByUserId(Long userId) {
    return userCourseRepository.findByUserId(userId).stream()
      //.filter(UserCourse::isEnrolled)
      .map(UserCourse::getCourse)
      .collect(Collectors.toList());
  }
}

