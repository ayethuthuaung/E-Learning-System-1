package com.ai.e_learning.service;

import com.ai.e_learning.dto.CourseModuleDto;
import com.ai.e_learning.dto.UserCourseModuleDto;
import com.ai.e_learning.dto.UserDto;

import java.util.List;

public interface UserCourseModuleService {
  UserCourseModuleDto markModuleAsDone(Long userId, Long moduleId);



}
