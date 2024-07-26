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
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Map;


@Service
public class UserCourseServiceImpl implements UserCourseService {

  private final UserRepository userRepository;
  private final CourseRepository courseRepository;
  private final UserCourseRepository userCourseRepository;
  private final ModelMapper modelMapper;

  @Autowired
  private NotificationController notificationController;

  @Autowired
  private RoleService roleService;

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


    sendInstructorNotification(course, user);
    userCourse = userCourseRepository.save(userCourse);

    return modelMapper.map(userCourse, UserCourseDto.class);
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

    sendStudentNotification(userCourse);
  }
  private void sendStudentNotification(UserCourse userCourse) {
    User student = userCourse.getUser();
    Course course = userCourse.getCourse();
    Optional<Role> studentRoleOptional = roleService.getRoleByName("Student");
    if(studentRoleOptional.isPresent()) {
      Role instructorRole = studentRoleOptional.get();
      Notification studentNotification = new Notification();
      studentNotification.setMessage("Your enrollment status for the course " + course.getName() + " has been changed to " + userCourse.getStatus());
      studentNotification.setRole(instructorRole);
      studentNotification.setUser(student);

      notificationController.sendNotificationToUser(studentNotification, student);
    }else {
      System.out.println("Student role is not found");
    }
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

  //PK
  @Override
  public Map<String, Long> getAcceptedUserCountsByCourse() {
    List<UserCourse> acceptedCourses = userCourseRepository.findByStatus("accept");
    Map<String, Long> acceptedUserCounts = new HashMap<>();
    for (UserCourse userCourse : acceptedCourses) {
      String courseName = userCourse.getCourse().getName();
      acceptedUserCounts.put(courseName, acceptedUserCounts.getOrDefault(courseName, 0L) + 1);
    }
    return acceptedUserCounts;
  }

  @Override
  public Map<String, Long> getAcceptedStudentCount() {
    List<UserCourse> acceptedCourses = userCourseRepository.findByStatus("accept");
    Map<String, Long> acceptedStudentCounts = new HashMap<>();

    for (UserCourse userCourse : acceptedCourses) {
      String courseName = userCourse.getCourse().getName();
      Long count = userCourseRepository.countDistinctUsersByCourseAndStatus(userCourse.getCourse(), "accept");
      acceptedStudentCounts.put(courseName, count);
    }

    return acceptedStudentCounts;
  }
  @Override
  public Map<String, Double> getCourseAttendanceByInstructor(Long userId) {
    List<Course> courses = courseRepository.findByUserId(userId);
    Map<String, Double> courseAttendance = new HashMap<>();

    for (Course course : courses) {
      Long totalStudents = userCourseRepository.countByCourseId(course.getId());
      Long acceptedStudents = userCourseRepository.countByCourseIdAndStatus(course.getId(), "Accept");
      double percentage = (acceptedStudents / (double) totalStudents) * 100;
      courseAttendance.put(course.getName(), percentage);
    }

    return courseAttendance;
  }
  @Override
  public Map<String, Long> getMonthlyStudentCounts() {
    List<UserCourse> acceptedCourses = userCourseRepository.findByStatus("Accept");
    Map<String, Long> monthlyStudentCounts = new HashMap<>();

    for (UserCourse userCourse : acceptedCourses) {
      LocalDate date = Instant.ofEpochMilli(userCourse.getCreatedAt()).atZone(ZoneId.systemDefault()).toLocalDate();
      String monthName = date.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
      monthlyStudentCounts.put(monthName, monthlyStudentCounts.getOrDefault(monthName, 0L) + 1);
    }

    // Ensure all months are present in the map
    for (String month : List.of("January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December")) {
      monthlyStudentCounts.putIfAbsent(month, 0L);
    }

    return monthlyStudentCounts;
  }


}

