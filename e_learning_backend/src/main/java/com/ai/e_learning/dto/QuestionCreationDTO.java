package com.ai.e_learning.dto;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class QuestionCreationDTO {
    private Long examId;
    private List<QuestionDTO> questionList;
}
