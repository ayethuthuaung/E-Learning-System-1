package com.ai.e_learning.repository;

import com.ai.e_learning.model.CourseModule;
import com.ai.e_learning.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseModuleRepository extends JpaRepository<CourseModule, Long> {
  @Query("SELECT COUNT(cm) FROM CourseModule cm " +
    "JOIN UserCourseModule ucm ON cm.id = ucm.courseModule.id " +
    "WHERE ucm.user.id = :userId AND cm.lesson.course.id = :courseId AND ucm.done = true")
  Long countDoneModulesByUserAndCourse(@Param("userId") Long userId, @Param("courseId") Long courseId);

  @Query("SELECT COUNT(cm) FROM CourseModule cm " +
    "JOIN cm.lesson l " +
    "WHERE l.course.id = :courseId")
  Long countTotalModulesByCourse(@Param("courseId") Long courseId);

    List<CourseModule> findByLesson(Lesson lesson);
    //NN
    @Query("SELECT l FROM Lesson l JOIN l.courseModules cm WHERE cm.id = :moduleId")
    List<Lesson> findByCourseModuleId(@Param("moduleId") Long moduleId);

  @Query("SELECT cm FROM CourseModule cm JOIN cm.lesson l WHERE l.course.id = :courseId")
  List<CourseModule> findByCourseId(@Param("courseId") Long courseId);

}
