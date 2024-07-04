package com.ai.e_learning.dto;

import com.ai.e_learning.model.CourseModule;
import com.ai.e_learning.model.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCourseModuleDto {

    private Long id,userId, moduleId;
    private User user;
    private CourseModule courseModule;
    private boolean done;
}
