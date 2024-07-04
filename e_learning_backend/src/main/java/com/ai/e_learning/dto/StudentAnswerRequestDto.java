package com.ai.e_learning.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentAnswerRequestDto {
    private Long questionId;
    private Long answerOptionId;
    private Long correctAnswerId; // Include correct answer ID
    private boolean selectedOption;
    private Long studentOptionId;
}
