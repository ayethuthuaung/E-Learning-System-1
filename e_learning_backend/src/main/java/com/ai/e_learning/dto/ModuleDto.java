package com.ai.e_learning.dto;

import com.ai.e_learning.model.Lesson;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;

@Getter
@Setter
@ToString
public class ModuleDto {
    private  Long id;
    private String name;
    private boolean done;
    private Long createdAt;
    private Set<Lesson> lessons;
    private String file;
}
