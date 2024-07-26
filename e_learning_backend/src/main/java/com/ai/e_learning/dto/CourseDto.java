package com.ai.e_learning.dto;


import com.ai.e_learning.model.Category;
import com.ai.e_learning.model.User;
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
  private String createdDate;
  private Long createdAt;
  private Long acceptedAt;
  private String certificate;
  private String badge;
  private Set<Category> categories = new HashSet<>();
  private List<Long> categorylist;
  private boolean isDeleted;
  private String photo;
  private String photoName;
  private MultipartFile photoInput;
  private User user;
  private String status;

}
