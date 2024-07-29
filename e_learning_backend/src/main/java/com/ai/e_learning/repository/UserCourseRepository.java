package com.ai.e_learning.repository;

import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.User;
import com.ai.e_learning.model.UserCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCourseRepository extends JpaRepository<UserCourse, Long> {
  List<UserCourse> findByUserId(Long userId);
  List<UserCourse> findByCourseId(Long courseId);
  boolean existsByUserAndCourse(User user, Course course);

  @Query("SELECT uc FROM UserCourse uc WHERE uc.user.id = :userId AND uc.course.id = :courseId ORDER BY uc.createdAt DESC")
  Optional<UserCourse> findLatestByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);  List<UserCourse> findByUserIdAndStatus(Long userId, String status);

  List<UserCourse> findByUserIdAndCourseId(Long userId, Long courseId);

  List<UserCourse> findByStatus(String status); //PK
  @Query("SELECT uc.course FROM UserCourse uc WHERE uc.status = 'Accept' GROUP BY uc.course ORDER BY COUNT(uc.id) DESC")
  List<Course> findTopTrendingCourses();

  @Query("SELECT COUNT(DISTINCT uc.user) FROM UserCourse uc WHERE uc.course = :course AND uc.status = :status")
  Long countDistinctUsersByCourseAndStatus(@Param("course") Course course, @Param("status") String status);

  Long countByCourseId(Long courseId);
  Long countByCourseIdAndStatus(Long courseId, String status);


}

