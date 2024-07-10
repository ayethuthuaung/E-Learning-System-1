package com.ai.e_learning.repository;

import com.ai.e_learning.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;


public interface ExamRepository extends JpaRepository<Exam,Long> {
    @Query("SELECT e FROM Exam e LEFT JOIN FETCH e.questions WHERE e.id = :examId")
    Optional<Exam> findByIdWithQuestions(@Param("examId") Long examId);
}
