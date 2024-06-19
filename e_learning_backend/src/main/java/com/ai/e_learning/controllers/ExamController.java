package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.dto.ExamDTO;
import com.ai.e_learning.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exam")
@CrossOrigin("*")
public class ExamController {

    @Autowired
    private ExamService examService;

    // Add exam
    @PostMapping(value = "/add", produces = "application/json")
    public ResponseEntity<ExamDTO> addExam(@RequestBody ExamDTO examDTO) {
        ExamDTO savedExam = examService.addExam(examDTO);
        return ResponseEntity.ok(savedExam);
    }

    // Get exam by ID
    @GetMapping(value = "/viewOne/{examId}", produces = "application/json")
    public ResponseEntity<ExamDTO> getExam(@PathVariable("examId") Long examId) {
        ExamDTO examDTO = examService.getExam(examId);
        if (examDTO != null) {
            return ResponseEntity.ok(examDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all exams
    @GetMapping(value = "/viewList", produces = "application/json")
    public ResponseEntity<List<ExamDTO>> getExams() {
        List<ExamDTO> exams = examService.getExams();
        return ResponseEntity.ok(exams);
    }

    // Update exam
    @PutMapping(value = "/update", produces = "application/json")
    public ResponseEntity<ExamDTO> updateExam(@RequestBody ExamDTO examDTO) {
        ExamDTO updatedExam = examService.updateExam(examDTO);
        if (updatedExam != null) {
            return ResponseEntity.ok(updatedExam);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete exam
    @DeleteMapping(value = "/delete/{examId}")
    public ResponseEntity<Void> deleteExam(@PathVariable("examId") Long examId) {
        examService.softDeleteExam(examId);
        return ResponseEntity.noContent().build();
    }
//    @GetMapping(value = "/byQuestionType/{questionTypeId}", produces = "application/json")
//    public ResponseEntity<List<CourseDto>> getCoursesByCategory(@PathVariable Long categoryId) {
//        List<CourseDto> courses = courseService.getCoursesByCategory(categoryId);
//        return ResponseEntity.ok(courses);
//    }
//
//    @PostMapping(value = "/{courseId}/categories/{categoryId}", produces = "application/json")
//    public ResponseEntity<Void> addCategoryToCourse(@PathVariable Long courseId, @PathVariable Long categoryId) {
//        courseService.addCategoryToCourse(courseId, categoryId);
//        return ResponseEntity.ok().build();
//    }
}
