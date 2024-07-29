package com.ai.e_learning.dto;

import com.ai.e_learning.model.Course;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jdk.jfr.Category;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class CategoryDto {
  private Long id;
  private String name;
  private boolean isDeleted;

  private Set<Course> courses = new HashSet<>();
}
