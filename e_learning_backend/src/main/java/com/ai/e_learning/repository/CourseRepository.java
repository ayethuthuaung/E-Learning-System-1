package com.ai.e_learning.repository;

import com.ai.e_learning.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

  List<Course> findByCategories_Id(Long categoryId);

  List<Course> findByIsDeleted(boolean isDeleted);

  @Query("SELECT c FROM Course c JOIN c.categories cat WHERE cat.id = :categoryId")
  List<Course> findByCategoryId(Long categoryId);
}
