package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.QuestionTypeDto;
import com.ai.e_learning.service.Question_TypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questionType")
@CrossOrigin("*")
public class Question_TypeController {

    @Autowired
    private Question_TypeService questionTypeService;

    // Add question type
    @PostMapping("/add")
    public ResponseEntity<QuestionTypeDto> addQuestionType(@RequestBody QuestionTypeDto questionTypeDTO) {
        QuestionTypeDto savedQuestionType = questionTypeService.addQuestionType(questionTypeDTO);
        return ResponseEntity.ok(savedQuestionType);
    }

    // Get question type by ID
    @GetMapping("/viewOne/{questionTypeId}")
    public ResponseEntity<QuestionTypeDto> getQuestionType(@PathVariable("questionTypeId") Long questionTypeId) {
        QuestionTypeDto questionTypeDTO = questionTypeService.getQuestionType(questionTypeId);
        if (questionTypeDTO != null) {
            return ResponseEntity.ok(questionTypeDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all question types
    @GetMapping("/viewList")
    public ResponseEntity<List<QuestionTypeDto>> getQuestionTypes() {
        List<QuestionTypeDto> questionTypes = questionTypeService.getQuestionTypes();
        return ResponseEntity.ok(questionTypes);
    }

    // Update question type
    @PutMapping("/update")
    public ResponseEntity<QuestionTypeDto> updateQuestionType(@RequestBody QuestionTypeDto questionTypeDTO) {
        QuestionTypeDto updatedQuestionType = questionTypeService.updateQuestionType(questionTypeDTO);
        if (updatedQuestionType != null) {
            return ResponseEntity.ok(updatedQuestionType);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Soft delete question type
    @DeleteMapping("/delete/{questionTypeId}")
    public ResponseEntity<Void> deleteQuestionType(@PathVariable("questionTypeId") Long questionTypeId) {
        questionTypeService.softDeleteQuestionType(questionTypeId);
        return ResponseEntity.noContent().build();
    }

}
