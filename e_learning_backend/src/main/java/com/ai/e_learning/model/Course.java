package com.ai.e_learning.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter

@Entity

public class Course  {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private  Long id;
  @Column(nullable = false, length = 10)
  private String name;
  @Column(nullable = false, length = 25)
  private  String level;
  @Column(nullable = false, length = 50)
  private String duration;

  @Column(nullable = false, length = 100)
  private String description;
  private Long createdAt;
  @Column(nullable = false, length = 30)
  private String certificate;
  @Column(nullable = false, length = 30)
  private String badge;
  private String photo;
  private boolean isDeleted;

 @ManyToMany(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
  @JoinTable(name = "course_has_category",
    joinColumns = @JoinColumn(name = "course_id"),
    inverseJoinColumns = @JoinColumn(name = "category_id"))
 private Set<Category> categories = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;


  @PrePersist
  protected void onCreate() {
    this.createdAt = System.currentTimeMillis();
  }



}
