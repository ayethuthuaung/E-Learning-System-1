package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.CourseModuleDto;
import com.ai.e_learning.dto.LessonDto;
import com.ai.e_learning.model.Lesson;
import com.ai.e_learning.service.CourseModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class CourseModuleController {
  private final CourseModuleService courseModuleService;

  @GetMapping("/{id}")
  public ResponseEntity<CourseModuleDto> getModuleById(@PathVariable Long id) {
    CourseModuleDto courseModuleDto = courseModuleService.getModuleById(id);
    return ResponseEntity.ok(courseModuleDto);
  }

  @PostMapping("/createModules")
  public ResponseEntity<Map<String, String>> createModules(
    @RequestPart("modules") List<CourseModuleDto> courseModuleDtos,
    @RequestPart("files") List<MultipartFile> fileInputs) {

    try {
      courseModuleService.createModules(courseModuleDtos, fileInputs);
      Map<String, String> response = new HashMap<>();
      response.put("message", "CourseModules created successfully");
      return ResponseEntity.ok(response);
    } catch (IOException | GeneralSecurityException e) {
      Map<String, String> response = new HashMap<>();
      response.put("error", "Failed to create modules");
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
  }


  @PutMapping("/{id}")
  public ResponseEntity<Map<String, String>> updateModule(@PathVariable Long id,
                                                      @RequestPart("module") CourseModuleDto courseModuleDto,
                                                      @RequestPart(value = "file",required = false) MultipartFile fileInput) {
      courseModuleDto.setFileInput(fileInput);
      CourseModuleDto updatedModule = courseModuleService.updateModule(id, courseModuleDto);
    Map<String, String> response = new HashMap<>();

    if(updatedModule != null) {

        response.put("message", "CourseModules updated successfully");
      System.out.println(response);
      return ResponseEntity.ok(response);
      }else {
        response.put("message", "Failed to update CourseModule");

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
      }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
    courseModuleService.deleteModule(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping
  public ResponseEntity<List<CourseModuleDto>> getAllModules() {
    List<CourseModuleDto> modules = courseModuleService.getAllModules();
    return ResponseEntity.ok(modules);
  }

  @GetMapping("/completion-percentage")
  public Double getCompletionPercentage(@RequestParam Long userId, @RequestParam Long courseId) {
    return courseModuleService.calculateCompletionPercentage(userId, courseId);
  }

  @GetMapping("/all-students-progress")
  public Map<String, Map<String, Double>> getAllStudentsProgress() {
    return courseModuleService.getAllStudentsProgress();
  }

  @GetMapping("/all-courses-progress")
  public Map<String, Map<String, Double>> getAllCoursesProgress() {
    return courseModuleService.getAllCoursesProgress();
  }

  @GetMapping("/byLesson/{lessonId}")
  public ResponseEntity<List<CourseModuleDto>> getModulesByLessonId(@PathVariable Long lessonId) {
    List<CourseModuleDto> modules = courseModuleService.getModulesByLessonId(lessonId);
    return ResponseEntity.ok(modules);
  }
//NN
@GetMapping("/lessons/{moduleId}")
public ResponseEntity<List<LessonDto>> getLessonsByModuleId(@PathVariable Long moduleId) {
  List<LessonDto> lessonDtos = courseModuleService.getLessonsByModuleId(moduleId);
  return ResponseEntity.ok(lessonDtos);
}

  @GetMapping("/byCourse/{courseId}")
  public ResponseEntity<List<CourseModuleDto>> getModulesByCourseId(@PathVariable Long courseId) {
    List<CourseModuleDto> modules = courseModuleService.getModulesByCourseId(courseId);
    return ResponseEntity.ok(modules);
  }


}
