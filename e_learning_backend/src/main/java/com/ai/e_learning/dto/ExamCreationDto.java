package com.ai.e_learning.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class ExamCreationDto {
    private String title;
    private String description;
    private List<QuestionDto> questionList;
}
