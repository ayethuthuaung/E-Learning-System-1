package com.ai.e_learning.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class QuestionTypeDto {
    private Long id;
    private String type;
    private Set<QuestionDto> questions;
    private Set<ExamDto> exams;
    private boolean isDeleted;
}
