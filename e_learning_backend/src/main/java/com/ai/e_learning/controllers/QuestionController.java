package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.QuestionCreationDTO;
import com.ai.e_learning.dto.QuestionDTO;
import com.ai.e_learning.dto.StudentAnswerRequestDTO;
import com.ai.e_learning.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/question")
@CrossOrigin(origins = "http://localhost:4200")

public class QuestionController {

    @Autowired
    private QuestionService questionService;

    // Add question
//    @PostMapping("/add")
//    public ResponseEntity<QuestionDTO> addQuestion(@RequestBody QuestionDTO questionDTO) {
//        QuestionDTO createdQuestion = this.questionService.addQuestion(questionDTO);
//        return ResponseEntity.ok(createdQuestion);
//    }
    @PostMapping("/add")
    public ResponseEntity<?> createQuestion(@RequestBody List<QuestionCreationDTO> questionCreationDTOList){
        for(QuestionCreationDTO questionCreationDTO : questionCreationDTOList){
            System.out.println(questionCreationDTO.toString());
        }
        boolean isCreated = questionService.createQuestion(questionCreationDTOList);

        return ResponseEntity.ok(isCreated);
    }

    // Get question
    @GetMapping("/viewOne/{questionId}")
    public ResponseEntity<QuestionDTO> getQuestion(@PathVariable("questionId") Long questionId) {
        QuestionDTO questionDTO = this.questionService.getQuestion(questionId);
        return ResponseEntity.ok(questionDTO);
    }


    // Get all questions
    @GetMapping("/viewList")
    public ResponseEntity<Set<QuestionDTO>> getQuestions() {
        Set<QuestionDTO> questions = this.questionService.getQuestions();
        return ResponseEntity.ok(questions);
    }

    // Update question
    @PutMapping("/update")
    public ResponseEntity<QuestionDTO> updateQuestion(@RequestBody QuestionDTO questionDTO) {
        QuestionDTO updatedQuestion = this.questionService.updateQuestion(questionDTO);
        return ResponseEntity.ok(updatedQuestion);
    }

    // Delete question
    @DeleteMapping("/delete/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable("questionId") Long questionId) {
        this.questionService.deleteQuestion(questionId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/byQuestionType/{questionTypeId}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByQuestionType(@PathVariable("questionTypeId") Long questionTypeId) {
        List<QuestionDTO> questions = questionService.getQuestionsByQuestionType(questionTypeId);
        return ResponseEntity.ok(questions);
    }

    // Get specific question details by ID
    @GetMapping("/view/{questionId}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable("questionId") Long questionId) {
        QuestionDTO question = questionService.getQuestion(questionId);
        return ResponseEntity.ok(question);
    }
//    @PostMapping("/submitAnswers")
//    public ResponseEntity<?> submitAnswers(@RequestBody List<StudentAnswerRequestDTO> studentAnswerRequestDTOList) {
//        questionService.saveStudentAnswers(studentAnswerRequestDTOList);
//        return ResponseEntity.ok(Collections.singletonMap("message", "Answers submitted successfully"));
//
//    }
@PostMapping("/submitAnswers")
public ResponseEntity<?> submitAnswers(@RequestBody List<StudentAnswerRequestDTO> studentAnswerRequestDTOList) {
    List<Map<String, Object>> result = questionService.saveStudentAnswers(studentAnswerRequestDTOList);
    return ResponseEntity.ok(result);
}



}

