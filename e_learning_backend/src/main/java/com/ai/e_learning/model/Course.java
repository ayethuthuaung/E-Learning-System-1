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
  @Column(nullable = false, length = 10)
  private  String level;
  @Column(nullable = false, length = 10)
  private String duration;
  @Column(nullable = false, length = 10)
  private String description;
  private String createdAt;
  @Column(nullable = false, length = 10)
  private String certificate;
  @Column(nullable = false, length = 10)
  private String badge;

  private boolean isDeleted;

 @ManyToMany(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
  @JoinTable(name = "course_has_category",
    joinColumns = @JoinColumn(name = "course_id"),
    inverseJoinColumns = @JoinColumn(name = "category_id"))

 private Set<Category> categories = new HashSet<>();
  /*@OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<Material> materials = new HashSet<>();*/


}
