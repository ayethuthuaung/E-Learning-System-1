package com.ai.e_learning.repository;

import com.ai.e_learning.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question,Long> {

    List<Question> findByExamId(Long examId);

    List<Question> findByQuestionTypeId(Long questionTypeId);

    List<Question> findAllByExamId(Long examId);
}
