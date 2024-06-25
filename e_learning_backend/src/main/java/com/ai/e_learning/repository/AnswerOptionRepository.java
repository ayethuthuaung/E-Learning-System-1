package com.ai.e_learning.repository;

import com.ai.e_learning.model.AnswerOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerOptionRepository extends JpaRepository<AnswerOption,Long> {

    List<AnswerOption> findByQuestionId(Long id);
}
