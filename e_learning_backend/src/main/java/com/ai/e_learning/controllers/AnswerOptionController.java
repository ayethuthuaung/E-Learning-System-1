package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.AnswerOptionDto;
import com.ai.e_learning.service.AnswerOptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/answerOption")
@CrossOrigin("*")
public class AnswerOptionController {

    @Autowired
    private AnswerOptionService answerOptionService;

    // Add answer option
    @PostMapping("/add")
    public ResponseEntity<AnswerOptionDto> addAnswerOption(@RequestBody AnswerOptionDto answerOptionDTO) {
        AnswerOptionDto createdAnswerOption = answerOptionService.addAnswerOption(answerOptionDTO);
        return ResponseEntity.ok(createdAnswerOption);
    }

    // Get answer option
    @GetMapping("/viewOne/{answerOptionId}")
    public ResponseEntity<AnswerOptionDto> getAnswerOption(@PathVariable("answerOptionId") Long answerOptionId) {
        AnswerOptionDto answerOptionDTO = answerOptionService.getAnswerOption(answerOptionId);
        return ResponseEntity.ok(answerOptionDTO);
    }

    // Get all answer options
    @GetMapping("/viewList")
    public ResponseEntity<Set<AnswerOptionDto>> getAnswerOptions() {
        Set<AnswerOptionDto> answerOptionDtos = answerOptionService.getAnswerOptions();
        return ResponseEntity.ok(answerOptionDtos);
    }

    // Update answer option
    @PutMapping("/update")
    public ResponseEntity<AnswerOptionDto> updateAnswerOption(@RequestBody AnswerOptionDto answerOptionDTO) {
        AnswerOptionDto updatedAnswerOption = answerOptionService.updateAnswerOption(answerOptionDTO);
        return ResponseEntity.ok(updatedAnswerOption);
    }

    // Delete answer option
    @DeleteMapping("/delete/{answerOptionId}")
    public ResponseEntity<Void> deleteAnswerOption(@PathVariable("answerOptionId") Long answerOptionId) {
        answerOptionService.deleteAnswerOption(answerOptionId);
        return ResponseEntity.ok().build();
    }
}
