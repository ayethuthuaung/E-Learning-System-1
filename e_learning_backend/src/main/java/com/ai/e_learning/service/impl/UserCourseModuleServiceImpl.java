package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.UserCourseModuleDto;
import com.ai.e_learning.model.CourseModule;
import com.ai.e_learning.model.User;
import com.ai.e_learning.model.UserCourseModule;
import com.ai.e_learning.repository.CourseModuleRepository;
import com.ai.e_learning.repository.UserCourseModuleRepository;
import com.ai.e_learning.repository.UserRepository;
import com.ai.e_learning.service.UserCourseModuleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UserCourseModuleServiceImpl implements UserCourseModuleService {

  private static final Logger logger = LoggerFactory.getLogger(UserCourseModuleServiceImpl.class);

  private final UserCourseModuleRepository userCourseModuleRepository;
  private final UserRepository userRepository;
  private final CourseModuleRepository courseModuleRepository;

  @Autowired
  public UserCourseModuleServiceImpl(UserCourseModuleRepository userCourseModuleRepository,
                                     UserRepository userRepository,
                                     CourseModuleRepository courseModuleRepository) {
    this.userCourseModuleRepository = userCourseModuleRepository;
    this.userRepository = userRepository;
    this.courseModuleRepository = courseModuleRepository;
  }

  @Override
  public UserCourseModuleDto markModuleAsDone(Long userId, Long moduleId) {
    Optional<UserCourseModule> optionalUserCourseModule = userCourseModuleRepository.findByUserIdAndCourseModuleId(userId, moduleId);

    if (optionalUserCourseModule.isPresent()) {
      UserCourseModule userCourseModule = optionalUserCourseModule.get();
      userCourseModule.setDone(true);
      UserCourseModule updatedUserCourseModule = userCourseModuleRepository.save(userCourseModule);
      return mapToDto(updatedUserCourseModule);
    } else {
      // Create a new UserCourseModule entry if it does not exist
      User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
      CourseModule courseModule = courseModuleRepository.findById(moduleId).orElseThrow(() -> new IllegalArgumentException("CourseModule not found with id: " + moduleId));

      UserCourseModule newUserCourseModule = new UserCourseModule();
      newUserCourseModule.setUser(user);
      newUserCourseModule.setCourseModule(courseModule);
      newUserCourseModule.setDone(true);

      UserCourseModule savedUserCourseModule = userCourseModuleRepository.save(newUserCourseModule);
      return mapToDto(savedUserCourseModule);
    }
  }

  private UserCourseModuleDto mapToDto(UserCourseModule userCourseModule) {
    UserCourseModuleDto dto = new UserCourseModuleDto();
    dto.setId(userCourseModule.getId());
    dto.setUserId(userCourseModule.getUser().getId());
    dto.setModuleId(userCourseModule.getCourseModule().getId());
    dto.setDone(userCourseModule.isDone());
    return dto;
  }
  @Override
  public boolean getModuleCompletionStatus(Long userId, Long moduleId) {
    Optional<UserCourseModule> optionalUserCourseModule = userCourseModuleRepository.findByUserIdAndCourseModuleId(userId, moduleId);
    return optionalUserCourseModule.map(UserCourseModule::isDone).orElse(false);
  }


}
