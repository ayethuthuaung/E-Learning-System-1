package com.ai.e_learning.repository;

import com.ai.e_learning.model.AnswerOption;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface AnswerOptionRepository extends JpaRepository<AnswerOption,Long> {

    List<AnswerOption> findByQuestionId(Long questionId);

    List<AnswerOption> findByQuestionIdAndIsAnsweredTrue(Long questionId);


}
