package com.ai.e_learning.repository;

import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.User;
import com.ai.e_learning.model.UserCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCourseRepository extends JpaRepository<UserCourse, Long> {
  List<UserCourse> findByUserId(Long userId);
  List<UserCourse> findByCourseId(Long courseId);
  boolean existsByUserAndCourse(User user, Course course);
  Optional<UserCourse> findByUserIdAndCourseId(Long userId, Long courseId);
  List<UserCourse> findByUserIdAndStatus(Long userId, String status);
  List<UserCourse> findByStatus(String status); //PK
  @Query("SELECT uc.course FROM UserCourse uc WHERE uc.status = 'Accept' GROUP BY uc.course ORDER BY COUNT(uc.id) DESC")
  List<Course> findTopTrendingCourses();
  Long countByCourseId(Long courseId);
  Long countByCourseIdAndStatus(Long courseId, String status);

}

