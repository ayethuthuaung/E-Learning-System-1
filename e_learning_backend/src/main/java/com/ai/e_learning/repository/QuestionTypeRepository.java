package com.ai.e_learning.repository;

import com.ai.e_learning.model.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionTypeRepository extends JpaRepository<QuestionType,Long> {
  QuestionType findByType(String type);
}
