package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.LessonDto;
import com.ai.e_learning.service.LessonService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "http://localhost:4200")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @PostMapping("/createLesson")
    public ResponseEntity<LessonDto> createLesson(@ModelAttribute LessonDto lessonDto) throws GeneralSecurityException, IOException {
        LessonDto createdLesson = lessonService.createLesson(lessonDto);
        return ResponseEntity.ok(createdLesson);
    }

    @GetMapping("/getAllLessons")
    public ResponseEntity<List<LessonDto>> getAllLessons() throws GeneralSecurityException, IOException {
        List<LessonDto> lessons = lessonService.getAllLessons();
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/getLessonsByCourse/{courseId}/user/{userId}")
    public ResponseEntity<List<LessonDto>> getLessonsByCourseId(@PathVariable Long courseId,@PathVariable Long userId) {
        System.out.println("Hi");
        List<LessonDto> lessons = lessonService.getLessonsByCourseId(courseId,userId);
        return ResponseEntity.ok(lessons);
    }


    @GetMapping("/{id}")
    public ResponseEntity<LessonDto> getLessonById(@PathVariable Long id) {
        LessonDto lesson = lessonService.getLessonById(id);
        return ResponseEntity.ok(lesson);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LessonDto> updateLesson(@PathVariable Long id, @RequestBody  LessonDto lessonDto) {
        LessonDto updatedLesson = lessonService.updateLesson(id, lessonDto);
        return ResponseEntity.ok(updatedLesson);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
}
