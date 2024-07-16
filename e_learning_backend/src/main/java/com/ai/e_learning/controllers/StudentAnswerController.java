package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.StudentAnswerDto;
import com.ai.e_learning.model.StudentAnswer;
import com.ai.e_learning.service.StudentAnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student-answers")
@CrossOrigin("*")
public class StudentAnswerController {

    @Autowired
    private StudentAnswerService studentAnswerService;

    @PostMapping("/submitAnswers")
    public ResponseEntity<?> submitAnswers(@RequestBody List<StudentAnswerDto> studentAnswerDtoList) {
        List<Map<String, Object>> result = studentAnswerService.saveStudentAnswers(studentAnswerDtoList);
        return ResponseEntity.ok(result);
    }
}
