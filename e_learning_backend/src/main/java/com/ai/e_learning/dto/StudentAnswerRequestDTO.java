package com.ai.e_learning.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentAnswerRequestDTO {
    private Long questionId;
    private Long studentOptionId;
}
