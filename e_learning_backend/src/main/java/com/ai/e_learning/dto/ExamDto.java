package com.ai.e_learning.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class ExamDto {
    private Long id;
    private String title;
    private String description;
    private Set<QuestionDto> questions;
    private Set<QuestionTypeDto> questionTypes;
    private boolean isDeleted;
}
