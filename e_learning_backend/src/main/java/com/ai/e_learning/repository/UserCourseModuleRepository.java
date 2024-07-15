package com.ai.e_learning.repository;

import com.ai.e_learning.dto.UserCourseModuleDto;
import com.ai.e_learning.model.UserCourseModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCourseModuleRepository extends JpaRepository<UserCourseModule, Long> {
  Optional<UserCourseModule> findByUserIdAndCourseModuleId(Long userId, Long moduleId);}
