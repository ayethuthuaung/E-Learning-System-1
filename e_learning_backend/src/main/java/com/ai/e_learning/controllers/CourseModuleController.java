package com.ai.e_learning.controllers;

import com.ai.e_learning.dto.CourseModuleDto;
import com.ai.e_learning.dto.LessonDto;
import com.ai.e_learning.service.CourseModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class CourseModuleController {
    private final CourseModuleService courseModuleService;

    @GetMapping("/{id}")
    public ResponseEntity<CourseModuleDto> getModuleById(@PathVariable Long id) {
        CourseModuleDto courseModuleDto = courseModuleService.getModuleById(id);
        return ResponseEntity.ok(courseModuleDto);
    }
}
