package com.ai.e_learning.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@AllArgsConstructor
@RequiredArgsConstructor
@Table(name = "student_answer")
public class StudentAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "selected_option_id")
    private Long selectedOptionId;  // Use Long to store ID of selected answer option

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_option_id")
    private AnswerOption answerOption;


    public StudentAnswer(Question question, AnswerOption selectedAnswerOption) {
        this.question=question;
        this.answerOption=selectedAnswerOption;
    }
}
