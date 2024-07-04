package com.ai.e_learning.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarksDto {
    private Long id;
    private int mark;
    private Long questionId;
}
