package com.ai.e_learning.repository;

import com.ai.e_learning.model.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

  Optional<Category> findById(Long id);

  List<Category> findByNameContainingIgnoreCase(String name);

  @Query("SELECT c FROM Category c JOIN c.courses cr WHERE cr.id = :courseId")
  List<Category> findAllByCourseId(@Param("courseId") Long courseId);


  @Query("SELECT c FROM Category c WHERE SIZE(c.courses) > :numberOfCourses")
  List<Category> findAllWithMoreThanNumberOfCourses(@Param("numberOfCourses") int numberOfCourses);


  @Query("SELECT c FROM Category c WHERE c.courses IS EMPTY")
  List<Category> findAllWithoutCourses();
}
