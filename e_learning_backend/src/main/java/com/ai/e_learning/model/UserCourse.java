package com.ai.e_learning.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class UserCourse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    // Additional attributes related to the relationship can be added here
    @Column(nullable = false)
    private boolean completed;

    @Column(nullable = false)
    private int progress;

    private Long createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = System.currentTimeMillis();
    }

}
