package com.ai.e_learning.repository;

import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.Lesson;
import com.ai.e_learning.model.User;
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

  @Query("SELECT COUNT(c) > 0 FROM Course c WHERE c.name = :name")
  boolean existsByName(String name);

  @Query("SELECT c FROM Course c JOIN FETCH c.categories")
  List<Course> findAllWithCategories();

  List<Course> findByStatus(String status);

  List<Course> findByStatusIn(List<String> statusList);

  List<Course> findByUserId(Long userId);

  List<Course> findByUser(User user);
  List<Course> findByUser_Roles_Id(Long roleId);

  @Query("SELECT c FROM Course c WHERE c.status = 'Accept' ORDER BY c.acceptedAt DESC ")
  List<Course> findLatestAcceptedCourses();

}
