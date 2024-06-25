package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.QuestionTypeDTO;
import com.ai.e_learning.service.Question_TypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questionType")
@CrossOrigin("*")
public class Question_TypeController {

    @Autowired
    private Question_TypeService questionTypeService;

    // Add question type
    @PostMapping("/add")
    public ResponseEntity<QuestionTypeDTO> addQuestionType(@RequestBody QuestionTypeDTO questionTypeDTO) {
        QuestionTypeDTO savedQuestionType = questionTypeService.addQuestionType(questionTypeDTO);
        return ResponseEntity.ok(savedQuestionType);
    }

    // Get question type by ID
    @GetMapping("/viewOne/{questionTypeId}")
    public ResponseEntity<QuestionTypeDTO> getQuestionType(@PathVariable("questionTypeId") Long questionTypeId) {
        QuestionTypeDTO questionTypeDTO = questionTypeService.getQuestionType(questionTypeId);
        if (questionTypeDTO != null) {
            return ResponseEntity.ok(questionTypeDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all question types
    @GetMapping("/viewList")
    public ResponseEntity<List<QuestionTypeDTO>> getQuestionTypes() {
        List<QuestionTypeDTO> questionTypes = questionTypeService.getQuestionTypes();
        return ResponseEntity.ok(questionTypes);
    }

    // Update question type
    @PutMapping("/update")
    public ResponseEntity<QuestionTypeDTO> updateQuestionType(@RequestBody QuestionTypeDTO questionTypeDTO) {
        QuestionTypeDTO updatedQuestionType = questionTypeService.updateQuestionType(questionTypeDTO);
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
