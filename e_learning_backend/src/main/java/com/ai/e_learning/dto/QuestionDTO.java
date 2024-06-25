package com.ai.e_learning.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class QuestionDTO {
    private Long id, questionTypeId;
    private String content;
    private List<AnswerOptionDTO> answerList;
}
