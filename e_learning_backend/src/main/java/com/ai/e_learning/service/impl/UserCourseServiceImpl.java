package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.UserCourseDto;
import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.User;
import com.ai.e_learning.model.UserCourse;
import com.ai.e_learning.repository.CourseRepository;
import com.ai.e_learning.repository.UserCourseRepository;
import com.ai.e_learning.repository.UserRepository;
import com.ai.e_learning.service.UserCourseService;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserCourseServiceImpl implements UserCourseService {

  private final UserRepository userRepository;
  private final CourseRepository courseRepository;
  private final UserCourseRepository userCourseRepository;
  private final ModelMapper modelMapper;

  @Autowired
  public UserCourseServiceImpl(UserRepository userRepository, CourseRepository courseRepository,
                               UserCourseRepository userCourseRepository, ModelMapper modelMapper) {
    this.userRepository = userRepository;
    this.courseRepository = courseRepository;
    this.userCourseRepository = userCourseRepository;
    this.modelMapper = modelMapper;
  }

  @Override
  public UserCourseDto enrollUserInCourse(Long userId, Long courseId) {
    User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
    Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("Course not found"));

    boolean isEnrolled = userCourseRepository.existsByUserAndCourse(user, course);
    if (isEnrolled) {
      throw new IllegalStateException("User is already enrolled in this course");
    }

    UserCourse userCourse = new UserCourse();
    userCourse.setUser(user);
    userCourse.setCourse(course);
    userCourse.setCompleted(false);
    userCourse.setProgress(0);
    userCourse.setStatus("Pending");

    userCourse = userCourseRepository.save(userCourse);

    return modelMapper.map(userCourse, UserCourseDto.class);
  }

  //AT
  @Override
  public  List<UserCourseDto> getAllUserCourses(){
    List<UserCourse> userCourseList = EntityUtil.getAllEntities(userCourseRepository);
    if(userCourseList==null)
      return null;
    return DtoUtil.mapList(userCourseList, UserCourseDto.class, modelMapper);
  }

  @Override
  public void changeStatus(Long id, String status) {
    UserCourse userCourse = userCourseRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("UserCourse not found"));
    userCourse.setStatus(status);
    userCourseRepository.save(userCourse);
  }
  //AT

  @Override
  public UserCourseDto updateUserCourse(Long userCourseId, boolean completed, int progress, String status) {
    UserCourse userCourse = userCourseRepository.findById(userCourseId)
      .orElseThrow(() -> new IllegalArgumentException("UserCourse not found"));

    userCourse.setCompleted(completed);
    userCourse.setProgress(progress);
    userCourse.setStatus(status);

    userCourse = userCourseRepository.save(userCourse);

    return modelMapper.map(userCourse, UserCourseDto.class);
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
    return userCourseRepository.findByUserIdAndStatus(userId, "Accept").stream()
      .map(UserCourse::getCourse)
      .collect(Collectors.toList());
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
    return userCourseOptional.isPresent() && userCourseOptional.get().getStatus().equals("Accept");
  }
  @Override
  public List<UserCourseDto> getAllUserCourseByUserId(Long userId) {
    List<Course> courses = courseRepository.findByUserId(userId);
    List<UserCourse> userCourses = new ArrayList<>();
    for (Course course : courses) {
      List<UserCourse> courseUserCourses = userCourseRepository.findByCourseId(course.getId());
      userCourses.addAll(courseUserCourses);
    }
    return DtoUtil.mapList(userCourses,UserCourseDto.class,modelMapper);
  }
  @Override
  public List<Course> getTrendingCourses() {
    List<Course> trendingCourses = userCourseRepository.findTopTrendingCourses();
    return trendingCourses.stream().limit(3).collect(Collectors.toList());
  }


}

