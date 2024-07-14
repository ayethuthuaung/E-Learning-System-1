package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.UserCourseModuleDto;
import com.ai.e_learning.service.UserCourseModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/userCourseModules")
public class UserCourseModuleController {

  private final UserCourseModuleService userCourseModuleService;

  @Autowired
  public UserCourseModuleController(UserCourseModuleService userCourseModuleService) {
    this.userCourseModuleService = userCourseModuleService;
  }

  @PostMapping("/markAsDone")
  public ResponseEntity<?> markModuleAsDone(@RequestBody Map<String, Long> requestBody) {
    try {
      Long userId = requestBody.get("userId");
      Long moduleId = requestBody.get("moduleId");
      UserCourseModuleDto result = userCourseModuleService.markModuleAsDone(userId, moduleId);
      return ResponseEntity.ok(result);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
  }
}
