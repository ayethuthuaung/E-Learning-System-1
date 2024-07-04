package com.ai.e_learning.dto;

import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.Module;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@ToString
public class LessonDto {
    private  Long id, courseId;
    private String title;
    private Course course;
    private List<ModuleDto> modules;

}
