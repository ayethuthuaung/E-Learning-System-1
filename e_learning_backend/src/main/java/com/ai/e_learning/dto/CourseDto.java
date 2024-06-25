package com.ai.e_learning.dto;


import com.ai.e_learning.model.Category;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@ToString
public class CourseDto {
  private Long id, userId;
  private String name;
  private  String level;
  private String duration;
  private String description;
  private String createdAt;
  private String certificate;
  private String badge;
  private Set<Category> categories = new HashSet<>();
  private List<Long> categorylist;
  private boolean isDeleted;
  private String photo;
  private MultipartFile photoInput;

}
