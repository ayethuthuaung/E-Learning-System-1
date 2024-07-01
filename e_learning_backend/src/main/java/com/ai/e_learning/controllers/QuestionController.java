package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.AnswerFeedback;
import com.ai.e_learning.dto.QuestionCreationDto;
import com.ai.e_learning.dto.QuestionDto;
import com.ai.e_learning.model.StudentAnswer;
import com.ai.e_learning.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/question")
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
    public ResponseEntity<?> createQuestion(@RequestBody List<QuestionCreationDto> questionCreationDtoList){
        for(QuestionCreationDto questionCreationDTO : questionCreationDtoList){
            System.out.println(questionCreationDTO.toString());
        }
        boolean isCreated = questionService.createQuestion(questionCreationDtoList);

        return ResponseEntity.ok(isCreated);
    }

    // Get question
    @GetMapping("/viewOne/{questionId}")
    public ResponseEntity<QuestionDto> getQuestion(@PathVariable("questionId") Long questionId) {
        QuestionDto questionDTO = this.questionService.getQuestion(questionId);
        return ResponseEntity.ok(questionDTO);
    }


    // Get all questions
    @GetMapping("/viewList")
    public ResponseEntity<Set<QuestionDto>> getQuestions() {
        Set<QuestionDto> questions = this.questionService.getQuestions();
        return ResponseEntity.ok(questions);
    }

    // Update question
    @PutMapping("/update")
    public ResponseEntity<QuestionDto> updateQuestion(@RequestBody QuestionDto questionDTO) {
        QuestionDto updatedQuestion = this.questionService.updateQuestion(questionDTO);
        return ResponseEntity.ok(updatedQuestion);
    }

    // Delete question
    @DeleteMapping("/delete/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable("questionId") Long questionId) {
        this.questionService.deleteQuestion(questionId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/byQuestionType/{questionTypeId}")
    public ResponseEntity<List<QuestionDto>> getQuestionsByQuestionType(@PathVariable("questionTypeId") Long questionTypeId) {
        List<QuestionDto> questions = questionService.getQuestionsByQuestionType(questionTypeId);
        return ResponseEntity.ok(questions);
    }

    // Get specific question details by ID
    @GetMapping("/view/{questionId}")
    public ResponseEntity<QuestionDto> getQuestionById(@PathVariable("questionId") Long questionId) {
        QuestionDto question = questionService.getQuestion(questionId);
        return ResponseEntity.ok(question);
    }
    @PostMapping("/submitAnswers")
    public ResponseEntity<List<AnswerFeedback>> submitStudentAnswers(@RequestBody List<StudentAnswer> studentAnswers) {
        List<AnswerFeedback> feedbackList = questionService.submitStudentAnswers(studentAnswers);
        return ResponseEntity.ok(feedbackList);
    }
//    @GetMapping("/exam/{examId}/questionsWithAnswers")
//    public ResponseEntity<List<QuestionDTO>> getQuestionsWithAnswers(@PathVariable Long examId) {
//        List<QuestionDTO> questionsWithAnswers = questionService.getQuestionsWithAnswers(examId);
//        return ResponseEntity.ok(questionsWithAnswers);
//    }
}
