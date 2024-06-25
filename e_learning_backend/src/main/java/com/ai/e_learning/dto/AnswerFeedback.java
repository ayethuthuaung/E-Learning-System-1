package com.ai.e_learning.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerFeedback {
    private Long questionId;
    private Long selectedOptionId;
    private Long correctOptionId;
    private boolean isCorrect;
}
