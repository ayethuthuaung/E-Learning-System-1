package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.CategoryDto;
import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.dto.ImageResponse;
import com.ai.e_learning.model.Category;
import com.ai.e_learning.service.CourseService;
import com.ai.e_learning.service.ProfileImageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping(value = "/courselist", produces = "application/json")
    public List<CourseDto> displayCourse(ModelMap model) {
        return courseService.getAllCourses();

    }

    @PostMapping(value = "/addcourse", produces = "application/json", consumes = "multipart/form-data")
    public ResponseEntity<CourseDto> addCourse(
            @RequestPart("course") CourseDto courseDto,
            @RequestParam(value = "photo", required = false) MultipartFile photo) throws IOException, GeneralSecurityException {

        if (photo.isEmpty()) {
            return ResponseEntity.badRequest().body(courseDto);
        }
        courseDto.setPhotoInput(photo);
        CourseDto savedCourse = courseService.saveCourse(courseDto);
        if (savedCourse != null) {
            return ResponseEntity.ok(savedCourse);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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

    @PutMapping(value = "/updatecourse/{id}", produces = "application/json")
    public ResponseEntity<CourseDto> updateCourse(@PathVariable Long id, @RequestBody CourseDto courseDto) {
        handlePhotoConversion(courseDto);
        CourseDto updatedCourse = courseService.updateCourse(id, courseDto);

        if (updatedCourse == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedCourse);
    }

    @DeleteMapping(value = "/delete/{id}")
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

    private void handlePhotoConversion(CourseDto courseDto) {
        if (courseDto.getPhoto() != null) {
            byte[] photoBytes = ProfileImageService.convertStringToByteArray(courseDto.getPhoto());
            courseDto.setPhoto(Arrays.toString(photoBytes));
        }
    }
  /*@PostMapping(value = "/addcourse", consumes = {"multipart/form-data"})
  public ResponseEntity<CourseDto> addCourse(@RequestParam("course") String courseDtoString,
                                             @RequestParam(value = "photo", required = false) MultipartFile photoFile) {
    try {
      CourseDto courseDto = new ObjectMapper().readValue(courseDtoString, CourseDto.class);

      // Handle photo conversion if needed
      if (photoFile != null) {
        byte[] photoBytes = photoFile.getBytes();
        // Convert photoBytes to necessary format and set it to courseDto
        courseDto.setPhoto(Arrays.toString(photoBytes)); // Example: Convert to base64 or store as byte array
      }

      CourseDto savedCourse = courseService.saveCourse(courseDto);
      if (savedCourse != null) {
        return ResponseEntity.ok(savedCourse); // Return HTTP 200 OK with saved course details
      } else {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Or handle error as needed
      }
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Handle JSON parsing or file reading errors
    }
  }*/
}

