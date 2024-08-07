package com.ai.e_learning.service.impl;

import com.ai.e_learning.controllers.NotificationController;
import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.dto.UserCourseDto;
import com.ai.e_learning.model.*;
import com.ai.e_learning.repository.*;
import com.ai.e_learning.service.CourseModuleService;
import com.ai.e_learning.service.RoleService;
import com.ai.e_learning.service.UserCourseService;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class UserCourseServiceImpl implements UserCourseService {

  private final UserRepository userRepository;
  private final CourseRepository courseRepository;
  private final UserCourseRepository userCourseRepository;
  private final RoleRepository roleRepository;
  private final CertificateRepository certificateRepository;

  private final ModelMapper modelMapper;
  private final CourseModuleService courseModuleService;

  @Autowired
  private NotificationController notificationController;

  @Autowired
  private RoleService roleService;



  @Override
  public UserCourseDto enrollUserInCourse(Long userId, Long courseId) {
    User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
    Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("Course not found"));

//    boolean isEnrolled = userCourseRepository.existsByUserAndCourse(user, course);
//    if (isEnrolled) {
//      throw new IllegalStateException("User is already enrolled in this course");
//    }

    UserCourse userCourse = new UserCourse();
    userCourse.setUser(user);
    userCourse.setCourse(course);
    userCourse.setCompleted(false);
    userCourse.setProgress(0);
    userCourse.setStatus("Pending");
    userCourse = userCourseRepository.save(userCourse);

    sendInstructorNotification(course, user);


    return modelMapper.map(userCourse, UserCourseDto.class);
  }

  private void sendInstructorNotification(Course course, User student) {
//    Optional<Role> instructorRoleOptional = roleService.getRoleByName("Instructor");
//    if (instructorRoleOptional.isPresent()) {
//      Role instructorRole = instructorRoleOptional.get();
    List<User> users = new ArrayList<>();
    users.add(course.getUser());
      Role ownerRole = roleRepository.findByUsers(users);
      Notification instructorNotification = new Notification();
      instructorNotification.setMessage("Student " + student.getName() + " has enrolled in your course " + course.getName());
      instructorNotification.setRole(ownerRole);
      instructorNotification.setUser(course.getUser()); // Assuming 'getInstructor()' gives you the instructor of the course
      notificationController.sendNotificationToUser(instructorNotification, course.getUser());
//    } else {
//      System.out.println("Instructor role not found");
//    }
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
  public List<UserCourseDto> getAllAcceptedUserCourses() {
    // Assuming the 'Accept' status means the course is in an accepted state
    List<UserCourse> acceptedCourses = userCourseRepository.findByStatus("Accept");

    // Extract course IDs from the accepted courses
    List<Long> courseIds = acceptedCourses.stream()
      .map(userCourse -> userCourse.getCourse().getId())
      .collect(Collectors.toList());

    // Get courses associated with these IDs
    List<Course> courses = courseRepository.findByIdIn(courseIds);

    // Prepare the list to hold user courses with progress and certificate details
    List<UserCourse> userCourses = new ArrayList<>();

    for (Course course : courses) {
      List<UserCourse> courseUserCourses = userCourseRepository.findByCourseId(course.getId());
      for (UserCourse userCourse : courseUserCourses) {
        Double completionPercentage = courseModuleService.calculateCompletionPercentage(userCourse.getUser().getId(), course.getId());
        userCourse.setProgress(completionPercentage);

        Certificate certificate = certificateRepository.findCertificateByUserIdAndCourseId(userCourse.getUser().getId(), course.getId());
        userCourse.setCompleted(certificate != null);
      }
      userCourses.addAll(courseUserCourses);
    }

    // Map to DTOs and format output
    List<UserCourseDto> userCourseDtoList = DtoUtil.mapList(userCourses, UserCourseDto.class, modelMapper);
    for (UserCourseDto userCourseDto : userCourseDtoList) {
      String progress = String.format("%.2f%%", userCourseDto.getProgress());
      userCourseDto.setProgressOutput(progress);

      String certificate = userCourseDto.isCompleted() ? "Available" : "Unavailable";
      userCourseDto.setCertificateOutput(certificate);
    }

    return userCourseDtoList;
  }





  @Override
  public void changeStatus(Long id, String status) {
    UserCourse userCourse = userCourseRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("UserCourse not found"));
    userCourse.setStatus(status);
    userCourse.setStatusChangeTimestamp(System.currentTimeMillis());
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

    return modelMapper. map(userCourse, UserCourseDto.class);
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
  public int checkEnrollmentAcceptance(Long userId, Long courseId) {
    List<UserCourse> userCourses = userCourseRepository.findByUserIdAndCourseId(userId, courseId);
    if (userCourses.isEmpty()) {
      return -1;
    }

    UserCourse latestUserCourse = userCourses.stream()
            .max(Comparator.comparingLong(UserCourse::getCreatedAt))
            .orElseThrow(); // Since the list is not empty, this should not throw

    return switch (latestUserCourse.getStatus()) {
      case "Pending" -> 0;
      case "Accept" -> 1;
      case "Reject" -> 2;
      default -> -1;
    };
  }


  @Override
  public List<UserCourseDto> getAllUserCourseByUserId(Long userId) {
    List<Course> courses = courseRepository.findByUserId(userId);
    List<UserCourse> userCourses = new ArrayList<>();
    for (Course course : courses) {
      List<UserCourse> courseUserCourses = userCourseRepository.findByCourseId(course.getId());
      for(UserCourse userCourse : courseUserCourses){
        Double completionPercentage = courseModuleService.calculateCompletionPercentage(userCourse.getUser().getId(), course.getId());
        userCourse.setProgress(completionPercentage);
        Certificate certificate = certificateRepository.findCertificateByUserIdAndCourseId(userCourse.getUser().getId(), course.getId());
        userCourse.setCompleted(certificate != null);
      }
      userCourses.addAll(courseUserCourses);
    }
    List<UserCourseDto> userCourseDtoList = DtoUtil.mapList(userCourses,UserCourseDto.class,modelMapper);
    for(UserCourseDto userCourseDto: userCourseDtoList){
      String progress = String.format("%.2f%%" ,userCourseDto.getProgress());
      userCourseDto.setProgressOutput(progress);
      String certificate = userCourseDto.isCompleted() ? "Available" : "Unavailable" ;
      userCourseDto.setCertificateOutput(certificate);
    }
      return userCourseDtoList;

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
    List<UserCourse> acceptedCourses = userCourseRepository.findByStatus("Accept");
    Map<String, Long> acceptedStudentCounts = new HashMap<>();

    for (UserCourse userCourse : acceptedCourses) {
      String courseName = userCourse.getCourse().getName();
      Long count = userCourseRepository.countDistinctUsersByCourseAndStatus(userCourse.getCourse(), "Accept");
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

