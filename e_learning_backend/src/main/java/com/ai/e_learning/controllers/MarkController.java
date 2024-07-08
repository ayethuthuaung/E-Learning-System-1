package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.MarksDto;
import com.ai.e_learning.service.MarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@RequiredArgsConstructor
public class MarkController {

    private final MarkService markService;

    @GetMapping("/viewList")
    public ResponseEntity<List<MarksDto>> getAllMarks() {
        List<MarksDto> marksList = markService.getAllMarks();
        return ResponseEntity.ok(marksList);
    }

    @GetMapping("/viewOne/{id}")
    public ResponseEntity<MarksDto> getMarkById(@PathVariable("id") Long id) {
        MarksDto marksDto = markService.getMarkById(id);
        return ResponseEntity.ok(marksDto);
    }

    @PostMapping("/add")
    public ResponseEntity<MarksDto> createMark(@RequestBody MarksDto marksDto) {
        MarksDto createdMark = markService.createMark(marksDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMark);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<MarksDto> updateMark(@PathVariable("id") Long id, @RequestBody MarksDto marksDto) {
        MarksDto updatedMark = markService.updateMark(id, marksDto);
        return ResponseEntity.ok(updatedMark);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteMark(@PathVariable("id") Long id) {
        markService.deleteMark(id);
        return ResponseEntity.noContent().build();
    }
}
