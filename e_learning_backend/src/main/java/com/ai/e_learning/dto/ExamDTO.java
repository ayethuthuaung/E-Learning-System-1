package com.ai.e_learning.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class ExamDTO {
    private Long id;
    private String title;
    private String description;
    private Set<QuestionDTO> questions;
    private Set<QuestionTypeDTO> questionTypes;
    private boolean isDeleted;
}
