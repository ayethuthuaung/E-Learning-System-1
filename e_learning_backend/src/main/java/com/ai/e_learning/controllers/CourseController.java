package com.ai.e_learning.controllers;
import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

  @Autowired
  private CourseService courseService;

  @GetMapping(value = "", produces = "application/json")
  public List<CourseDto> displayCourse(ModelMap model) {
    return courseService.getAllCourses()                                                                  ;

  }

  @PostMapping(value = "", produces = "application/json")
  public CourseDto addCourse(@RequestBody CourseDto course) {
    return courseService.saveCourse(course);
  }


  @GetMapping(value = "/{id}", produces = "application/json")
  public ResponseEntity<CourseDto> getCourseById(@PathVariable Long id) {
    CourseDto courseDto = courseService.getCourseById(id);
    if (courseDto != null) {
      return ResponseEntity.ok(courseDto);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @PutMapping(value = "/{id}", produces = "application/json")
  public ResponseEntity<CourseDto> updateCourse(@PathVariable Long id, @RequestBody CourseDto courseDto) {

    CourseDto updatedCourse = courseService.updateCourse(id, courseDto);

    if (updatedCourse == null) {
      return ResponseEntity.notFound().build();
    } else {

      return ResponseEntity.ok(updatedCourse);
    }
  }

  @DeleteMapping(value = "/{id}")
  public ResponseEntity<Void> softDeleteCourse(@PathVariable Long id) {
    courseService.softDeleteCourse(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping(value = "/byCategory/{categoryId}", produces = "application/json")
  public ResponseEntity<List<CourseDto>> getCoursesByCategory(@PathVariable Long categoryId) {
    List<CourseDto> courses = courseService.getCoursesByCategory(categoryId);
    return ResponseEntity.ok(courses);
  }

  @PostMapping(value = "/{courseId}/categories/{categoryId}", produces = "application/json")
  public ResponseEntity<Void> addCategoryToCourse(@PathVariable Long courseId, @PathVariable Long categoryId) {
    courseService.addCategoryToCourse(courseId, categoryId);
    return ResponseEntity.ok().build();
  }
  @GetMapping("/existsByName")
  public boolean isCourseNameAlreadyExists(@RequestParam String name) {
    return courseService.isCourseNameAlreadyExists(name);
  }

  }


