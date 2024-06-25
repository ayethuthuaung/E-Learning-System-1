package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.AnswerOptionDTO;
import com.ai.e_learning.service.AnswerOptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/answerOption")
@CrossOrigin("*")
public class AnswerOptionController {

    @Autowired
    private AnswerOptionService answerOptionService;

    // Add answer option
    @PostMapping("/add")
    public ResponseEntity<AnswerOptionDTO> addAnswerOption(@RequestBody AnswerOptionDTO answerOptionDTO) {
        AnswerOptionDTO createdAnswerOption = answerOptionService.addAnswerOption(answerOptionDTO);
        return ResponseEntity.ok(createdAnswerOption);
    }

    // Get answer option
    @GetMapping("/viewOne/{answerOptionId}")
    public ResponseEntity<AnswerOptionDTO> getAnswerOption(@PathVariable("answerOptionId") Long answerOptionId) {
        AnswerOptionDTO answerOptionDTO = answerOptionService.getAnswerOption(answerOptionId);
        return ResponseEntity.ok(answerOptionDTO);
    }

    // Get all answer options
    @GetMapping("/viewList")
    public ResponseEntity<Set<AnswerOptionDTO>> getAnswerOptions() {
        Set<AnswerOptionDTO> answerOptionDTOs = answerOptionService.getAnswerOptions();
        return ResponseEntity.ok(answerOptionDTOs);
    }

    // Update answer option
    @PutMapping("/update")
    public ResponseEntity<AnswerOptionDTO> updateAnswerOption(@RequestBody AnswerOptionDTO answerOptionDTO) {
        AnswerOptionDTO updatedAnswerOption = answerOptionService.updateAnswerOption(answerOptionDTO);
        return ResponseEntity.ok(updatedAnswerOption);
    }

    // Delete answer option
    @DeleteMapping("/delete/{answerOptionId}")
    public ResponseEntity<Void> deleteAnswerOption(@PathVariable("answerOptionId") Long answerOptionId) {
        answerOptionService.deleteAnswerOption(answerOptionId);
        return ResponseEntity.ok().build();
    }
}
