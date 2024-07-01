package com.ai.e_learning.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class QuestionDto {
    private Long id, questionTypeId;
    private String content;
    private List<AnswerOptionDto> answerList;
}
