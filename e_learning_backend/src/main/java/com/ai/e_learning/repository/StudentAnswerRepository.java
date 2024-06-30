package com.ai.e_learning.repository;

import com.ai.e_learning.model.AnswerOption;
import com.ai.e_learning.model.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
    List<AnswerOption> findByQuestionId(Long questionId);
}
