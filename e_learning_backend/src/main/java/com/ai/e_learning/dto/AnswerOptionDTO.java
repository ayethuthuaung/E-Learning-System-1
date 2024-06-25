package com.ai.e_learning.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AnswerOptionDTO {
    private Long id,questionId;

    private String answer;

    private Boolean isAnswered;

}
