package com.ai.e_learning.repository;

import com.ai.e_learning.model.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Question_TypeRepository extends JpaRepository<QuestionType,Long> {
}
