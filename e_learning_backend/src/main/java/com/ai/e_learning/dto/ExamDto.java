package com.ai.e_learning.dto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ExamDto {
    private Long id;
    private String title;
    private String description;
    private Set<QuestionDto> questions;
    private Set<QuestionTypeDto> questionTypes;
    private boolean isDeleted;
}