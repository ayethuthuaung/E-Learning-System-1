package com.ai.e_learning.dto;

import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCourseDto {
    private Long id;
    private User user;
    private Course course;
    private boolean completed;
    private int progress;
    private String status;
    private Long createdAt;
}
