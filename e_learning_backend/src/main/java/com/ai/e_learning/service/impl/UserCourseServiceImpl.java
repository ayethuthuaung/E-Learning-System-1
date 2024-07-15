package com.ai.e_learning.service.impl;

import com.ai.e_learning.controllers.NotificationController;
import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.dto.UserCourseDto;
import com.ai.e_learning.model.*;
import com.ai.e_learning.repository.CourseRepository;
import com.ai.e_learning.repository.UserCourseRepository;
import com.ai.e_learning.repository.UserRepository;
import com.ai.e_learning.service.RoleService;
import com.ai.e_learning.service.UserCourseService;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserCourseServiceImpl implements UserCourseService {

  private final UserRepository userRepository;
  private final CourseRepository courseRepository;
  private final UserCourseRepository userCourseRepository;

  @Autowired
  private ModelMapper modelMapper;

  @Autowired
  private NotificationController notificationController;

  @Autowired
  private RoleService roleService;

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


    sendInstructorNotification(course, user);
    return userCourseRepository.save(userCourse);
  }
  private void sendInstructorNotification(Course course, User student) {
    Optional<Role> instructorRoleOptional = roleService.getRoleByName("Instructor");
    if (instructorRoleOptional.isPresent()) {
      Role instructorRole = instructorRoleOptional.get();
      Notification instructorNotification = new Notification();
      instructorNotification.setMessage("Student " + student.getName() + " has enrolled in your course " + course.getName());
      instructorNotification.setRole(instructorRole);
      instructorNotification.setUser(course.getUser()); // Assuming 'getInstructor()' gives you the instructor of the course
      notificationController.sendNotificationToUser(instructorNotification, course.getUser());
    } else {
      System.out.println("Instructor role not found");
    }
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
  public UserCourse updateUserCourse(Long userCourseId, boolean completed, int progress, String status) {
    UserCourse userCourse = userCourseRepository.findById(userCourseId)
      .orElseThrow(() -> new IllegalArgumentException("UserCourse not found"));

    userCourse.setCompleted(completed);
    userCourse.setProgress(0);
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


}
