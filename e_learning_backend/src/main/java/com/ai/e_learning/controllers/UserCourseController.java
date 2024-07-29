package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.dto.UserCourseDto;
import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.User;
import com.ai.e_learning.service.UserCourseService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-course")
public class UserCourseController {

  private final UserCourseService userCourseService;
  private final ModelMapper modelMapper;
  @Autowired
  public UserCourseController(UserCourseService userCourseService,ModelMapper modelMapper) {
    this.userCourseService = userCourseService;
    this.modelMapper = modelMapper;
  }

  @PostMapping("/enroll")
  public ResponseEntity<UserCourseDto> enrollUserInCourse(@RequestBody Map<String, Long> payload) {
    Long userId = payload.get("userId");
    Long courseId = payload.get("courseId");
    UserCourseDto userCourseDto = userCourseService.enrollUserInCourse(userId, courseId);
    return ResponseEntity.status(HttpStatus.CREATED).body(userCourseDto);
  }

  //ATTA
  @GetMapping(value = "/userCourselist", produces = "application/json")
  public List<UserCourseDto> displayUserCourse(@RequestParam("userId")Long userId) {
    return userCourseService.getAllUserCourseByUserId(userId);
  }

  @PostMapping(value = "/change-status/{id}", produces = "application/json")
  public ResponseEntity<?> changeStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
    String status = payload.get("status");
    try {
      userCourseService.changeStatus(id, status);
      return ResponseEntity.status(HttpStatus.OK).build();
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected Error Occur");
    }
  }

  //ATTA

//  @PutMapping("/update/{userCourseId}")
//  public ResponseEntity<UserCourseDto> updateUserCourse(
//    @PathVariable Long userCourseId,
//    @RequestBody UserCourseDto userCourseDto
//  ) {
//    UserCourseDto updatedUserCourse = userCourseService.updateUserCourse(userCourseId,
//      userCourseDto.isCompleted(), userCourseDto.getProgress(), userCourseDto.getStatus());
//    return ResponseEntity.ok(updatedUserCourse);
//  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<User> getUserById(@PathVariable Long userId) {
    User user = userCourseService.findById(userId);
    return ResponseEntity.ok(user);
  }

  @GetMapping("/course/{courseId}")
  public ResponseEntity<Course> getCourseById(@PathVariable Long courseId) {
    Course course = userCourseService.findCourseById(courseId);
    return ResponseEntity.ok(course);
  }

  @GetMapping("/user/{userId}/courses")
  public ResponseEntity<List<UserCourseDto>> getCoursesByUserId(@PathVariable Long userId) {
    List<Course> courses = userCourseService.getCoursesByUserId(userId);
    List<UserCourseDto> courseDtos = courses.stream()
      .map(course -> modelMapper.map(course, UserCourseDto.class)) // Use modelMapper here
      .collect(Collectors.toList());
    return ResponseEntity.ok(courseDtos);
  }

  @GetMapping("/check")
  public ResponseEntity<Boolean> checkEnrollment(@RequestParam Long userId, @RequestParam Long courseId) {
    boolean isEnrolled = userCourseService.checkEnrollment(userId, courseId);
    return ResponseEntity.ok(isEnrolled);
  }

  @GetMapping("/check-enrollment-acceptance/{userId}/{courseId}")
  public ResponseEntity<Integer> checkEnrollmentAcceptance(@PathVariable Long userId, @PathVariable Long courseId) {
    int isAccepted = userCourseService.checkEnrollmentAcceptance(userId, courseId);
    return ResponseEntity.ok(isAccepted);
  }

  @GetMapping("/accepted-user-counts")
  public ResponseEntity<Map<String, Long>> getAcceptedUserCountsByCourse() {
    Map<String, Long> acceptedUserCounts = userCourseService.getAcceptedUserCountsByCourse();
    return ResponseEntity.ok(acceptedUserCounts);
  }

  @GetMapping("/trending-courses")
  public ResponseEntity<List<CourseDto>> getTrendingCourses() {
    List<Course> trendingCourses = userCourseService.getTrendingCourses();
    List<CourseDto> courseDtos = trendingCourses.stream()
      .map(course -> modelMapper.map(course, CourseDto.class))
      .collect(Collectors.toList());
    return ResponseEntity.ok(courseDtos);
  }

  @GetMapping("/accepted-student-counts")
  public ResponseEntity<Map<String, Long>> getAcceptedStudentCounts() {
    Map<String, Long> acceptedStudentCounts = userCourseService.getAcceptedStudentCount();
    return ResponseEntity.ok(acceptedStudentCounts);
  }

  @GetMapping("/course-attendance/{userId}")
  public ResponseEntity<Map<String, Double>> getCourseAttendanceByInstructor(@PathVariable Long userId){
    Map<String, Double> courseAttendance = userCourseService.getCourseAttendanceByInstructor(userId);
    return ResponseEntity.ok(courseAttendance);
  }

  @GetMapping("/monthly-student-counts")
  public Map<String, Long> getMonthlyStudentCounts() {
    return userCourseService.getMonthlyStudentCounts();
  }


}
