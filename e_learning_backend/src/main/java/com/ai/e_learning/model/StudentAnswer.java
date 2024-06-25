package com.ai.e_learning.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "student_answer")
public class StudentAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Keep questionId for direct reference if necessary
    @Column(name = "question_id", insertable = false, updatable = false)
    private Long questionId;

    // Keep answerOptionId for direct reference if necessary
    @Column(name = "answer_option_id", insertable = false, updatable = false)
    private Long answerOptionId;

    private boolean isAnswered;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_option_id")
    private AnswerOption answerOption;
}
