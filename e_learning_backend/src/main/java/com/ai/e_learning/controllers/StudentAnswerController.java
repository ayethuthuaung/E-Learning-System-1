package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.StudentAnswerRequestDto;
import com.ai.e_learning.model.StudentAnswer;
import com.ai.e_learning.service.StudentAnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-answers")
@CrossOrigin("*")
public class StudentAnswerController {

    @Autowired
    private StudentAnswerService studentAnswerService;

    @PostMapping
    public ResponseEntity<StudentAnswer> addStudentAnswer(@RequestBody StudentAnswerRequestDto request) {
        StudentAnswer studentAnswer = studentAnswerService.saveStudentAnswer(request.getQuestionId(), request.getAnswerOptionId());
        return ResponseEntity.ok(studentAnswer);
    }
//@PostMapping
//public ResponseEntity<StudentAnswer> addStudentAnswer(@RequestBody StudentAnswerRequestDTO request) {
//    StudentAnswer studentAnswer = studentAnswerService.saveStudentAnswer(
//            request.getQuestionId(),
//            request.getAnswerOptionId(),
//            request.getCorrectAnswerId()); // Include correctAnswerId
//    return ResponseEntity.ok(studentAnswer);
//}

    @GetMapping
    public ResponseEntity<List<StudentAnswer>> getAllStudentAnswers() {
        List<StudentAnswer> studentAnswers = studentAnswerService.getAllStudentAnswers();
        return ResponseEntity.ok(studentAnswers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentAnswer> getStudentAnswerById(@PathVariable Long id) {
        StudentAnswer studentAnswer = studentAnswerService.getStudentAnswerById(id);
        return ResponseEntity.ok(studentAnswer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentAnswer(@PathVariable Long id) {
        studentAnswerService.deleteStudentAnswer(id);
        return ResponseEntity.ok().build();
    }
}
