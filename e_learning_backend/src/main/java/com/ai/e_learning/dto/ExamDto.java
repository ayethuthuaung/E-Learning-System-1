package com.ai.e_learning.dto;

import com.ai.e_learning.model.Course;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ExamDto {
    private Long id, courseId;
    private String title;
    private String description,duration;
    private Set<QuestionDto> questions;
    private Set<QuestionTypeDto> questionTypes;
    private boolean isDeleted;
    private Course course;
}
