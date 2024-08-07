package com.ai.e_learning.dto;

import com.ai.e_learning.model.Course;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class LessonDto {
    private  Long id, courseId;
    private String title;

    private Course course;
    private boolean userComplete;
    private List<CourseModuleDto> modules;
    private List<ExamListDto> examListDto;
}
