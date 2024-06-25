package com.ai.e_learning.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class QuestionTypeDTO {
    private Long id;
    private String type;
    private Set<QuestionDTO> questions;
    private Set<ExamDTO> exams;
    private boolean isDeleted;
}
