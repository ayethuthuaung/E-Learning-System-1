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
@ToString
public class Course  {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private  Long id;
  @Column(nullable = false, length = 50)
  private String name;
  @Column(nullable = false, length = 25)
  private  String level;
  @Column(nullable = false, length = 50)
  private String duration;

  @Column(nullable = false, length = 500)
  private String description;
  private Long createdAt;
  private String createdDate;
  @Column(nullable = false, length = 30)
  private String certificate;
  @Column(nullable = false, length = 30)
  private String badge;
  private String photo;
  private boolean isDeleted;
  private String status;

 @ManyToMany(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
  @JoinTable(name = "course_has_category",
    joinColumns = @JoinColumn(name = "course_id"),
    inverseJoinColumns = @JoinColumn(name = "category_id"))
 @JsonIgnore
 private Set<Category> categories = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

  @OneToMany(mappedBy = "course", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JsonIgnore
  private Set<UserCourse> userCourses;


  @PrePersist
  protected void onCreate() {
    this.createdAt = System.currentTimeMillis();
  }



}
