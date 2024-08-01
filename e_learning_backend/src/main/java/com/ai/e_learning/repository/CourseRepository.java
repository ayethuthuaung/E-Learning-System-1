package com.ai.e_learning.repository;

import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.Lesson;
import com.ai.e_learning.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
  List<Course> findByUserIdAndStatus(Long userId, String status);

  List<Course> findByUser(User user);
  List<Course> findByUser_Roles_Id(Long roleId);

  @Query("SELECT c FROM Course c WHERE c.status = 'Accept' ORDER BY c.acceptedAt DESC ")
  List<Course> findLatestAcceptedCourses();

  @Query("SELECT l.course.id FROM Lesson l WHERE l.id = :lessonId")
  Long findCourseIdByLessonId(@Param("lessonId") Long lessonId);

  List<Course> findByUserIdAndIsDeletedFalse(Long userId);

  @Query(value = "SELECT c.* FROM course c JOIN lesson l ON c.id = l.course_id JOIN course_module cm ON l.id = cm.lesson_id WHERE cm.id = :moduleId", nativeQuery = true)
  Course findByModuleId(@Param("moduleId") Long moduleId);

  @Query("SELECT c FROM Course c JOIN Lesson l ON l.course.id = c.id JOIN Exam e ON e.lesson.id = l.id WHERE e.id = :examId")
  Course findCourseByExamId(@Param("examId") Long examId);

  @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END " +
          "FROM course c " +
          "WHERE c.user_id = :userId", nativeQuery = true)
  Boolean findCourseByUserId(@Param("userId") Long userId);

  @Query("SELECT c FROM Course c WHERE c.id IN :ids")
  List<Course> findByIdIn(@Param("ids") List<Long> ids);



}
