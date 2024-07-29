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

  @Column(nullable = false)
  private boolean completed;

  @Column(nullable = false)
  private double progress;

  @Column(nullable = false)
  private String status;

  private Long createdAt;

  @Column
  private Long statusChangeTimestamp;

  @PrePersist
  protected void onCreate() {
    this.createdAt = System.currentTimeMillis();
  }

  public void setStatus(String status) {
    this.status = status;
    this.statusChangeTimestamp = System.currentTimeMillis();
  }
}
