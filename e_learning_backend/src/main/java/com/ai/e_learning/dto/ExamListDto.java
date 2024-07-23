package com.ai.e_learning.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExamListDto {
    private Long id;
    private String title;
    private boolean finalExam;
}
