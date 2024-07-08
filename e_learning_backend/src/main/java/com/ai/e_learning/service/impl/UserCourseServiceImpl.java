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
import java.util.Optional;
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

    // Check if user is already enrolled in the course
    boolean isEnrolled = userCourseRepository.existsByUserAndCourse(user, course);
    if (isEnrolled) {
      throw new IllegalStateException("User is already enrolled in this course");
    }

    UserCourse userCourse = new UserCourse();
    userCourse.setUser(user);
    userCourse.setCourse(course);
    userCourse.setCompleted(false);
    userCourse.setProgress(0);
    userCourse.setStatus("pending");

    return userCourseRepository.save(userCourse);
  }

  @Override
  public UserCourse updateUserCourse(Long userCourseId, boolean completed, int progress, String status) {
    UserCourse userCourse = userCourseRepository.findById(userCourseId)
      .orElseThrow(() -> new IllegalArgumentException("UserCourse not found"));

    userCourse.setCompleted(completed);
    userCourse.setProgress(progress);
    userCourse.setStatus(status);

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
    return userCourseRepository.findByUserIdAndStatus(userId, "accept").stream()
      .map(UserCourse::getCourse)
      .collect(Collectors.toList());
  }

  @Override
  public void changeStatus(Long id, String status) {
    UserCourse userCourse = userCourseRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("UserCourse not found"));
    userCourse.setStatus(status);
    userCourseRepository.save(userCourse);
  }

  @Override
  public boolean checkEnrollment(Long userId, Long courseId) {
    User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
    Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("Course not found"));
    return userCourseRepository.existsByUserAndCourse(user, course);
  }
  @Override
  public boolean checkEnrollmentAcceptance(Long userId, Long courseId) {
    Optional<UserCourse> userCourseOptional = userCourseRepository.findByUserIdAndCourseId(userId, courseId);
    return userCourseOptional.isPresent() && userCourseOptional.get().getStatus().equals("accept");
  }
}
