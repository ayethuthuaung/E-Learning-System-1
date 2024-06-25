package com.ai.e_learning.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "question_type")
public class QuestionType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private boolean isDeleted;

    @OneToMany(mappedBy = "questionType", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Question> questions = new LinkedHashSet<>();
}
