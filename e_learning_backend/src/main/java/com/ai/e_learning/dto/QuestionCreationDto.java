package com.ai.e_learning.dto;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class QuestionCreationDto {
    private Long examId;
    private List<QuestionDto> questionList;
}
