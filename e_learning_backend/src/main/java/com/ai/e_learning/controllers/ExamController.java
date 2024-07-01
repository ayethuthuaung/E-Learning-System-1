package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.ExamDto;
import com.ai.e_learning.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam")
@CrossOrigin("*")
public class ExamController {

    @Autowired
    private ExamService examService;

    // Add exam
    @PostMapping(value = "/add", produces = "application/json")
    public ResponseEntity<ExamDto> addExam(@RequestBody ExamDto examDTO) {
        ExamDto savedExam = examService.addExam(examDTO);
        return ResponseEntity.ok(savedExam);
    }

    // Get exam by ID
    @GetMapping(value = "/viewOne/{examId}", produces = "application/json")
    public ResponseEntity<ExamDto> getExam(@PathVariable("examId") Long examId) {
        ExamDto examDTO = examService.getExam(examId);
        if (examDTO != null) {
            return ResponseEntity.ok(examDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all exams
    @GetMapping(value = "/viewList", produces = "application/json")
    public ResponseEntity<List<ExamDto>> getExams() {
        List<ExamDto> exams = examService.getExams();
        return ResponseEntity.ok(exams);
    }

    // Update exam
    @PutMapping(value = "/update", produces = "application/json")
    public ResponseEntity<ExamDto> updateExam(@RequestBody ExamDto examDTO) {
        ExamDto updatedExam = examService.updateExam(examDTO);
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
    //for answer-form
    @GetMapping("/{examId}")
    public ResponseEntity<?> getExamById(@PathVariable("examId") Long examId) {
        ExamDto exam = this.examService.getExamById(examId);
        return ResponseEntity.ok(exam);
    }
//for exams with questions list
@GetMapping("/examsWithQuestions/{examId}")
public ResponseEntity<ExamDto> getExamWithQuestions(@PathVariable("examId") Long examId) {
    ExamDto examDTO = examService.getExamWithQuestions(examId);
    return ResponseEntity.ok(examDTO);
}
}
