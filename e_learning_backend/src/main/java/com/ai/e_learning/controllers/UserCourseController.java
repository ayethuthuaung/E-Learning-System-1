package com.ai.e_learning.controllers;

import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.User;
import com.ai.e_learning.model.UserCourse;
import com.ai.e_learning.service.UserCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-course")
public class UserCourseController {
  private final UserCourseService userCourseService;

  @Autowired
  public UserCourseController(UserCourseService userCourseService) {
    this.userCourseService = userCourseService;
  }

  @PostMapping("/enroll")
  public UserCourse enrollUserInCourse(@RequestBody Map<String, Long> payload) {
    Long userId = payload.get("userId");
    Long courseId = payload.get("courseId");
    return userCourseService.enrollUserInCourse(userId, courseId);
  }

  @PutMapping("/update/{userCourseId}")
  public UserCourse updateUserCourse(
    @PathVariable Long userCourseId,
    @RequestBody Map<String, Object> payload
  ) {
    boolean completed = (Boolean) payload.get("completed");
    int progress = (Integer) payload.get("progress");
    return userCourseService.updateUserCourse(userCourseId, completed, progress);
  }

  @GetMapping("/user/{userId}")
  public User getUserById(@PathVariable Long userId) {
    return userCourseService.findById(userId);
  }

  @GetMapping("/course/{courseId}")
  public Course getCourseById(@PathVariable Long courseId) {
    return userCourseService.findCourseById(courseId);
  }
  @GetMapping("/user/{userId}/courses")
  public List<Course> getCoursesByUserId(@PathVariable Long userId) {
    return userCourseService.getCoursesByUserId(userId);
  }
}
