package com.ai.e_learning.repository;

import com.ai.e_learning.dto.LessonDto;
import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.CourseModule;
import com.ai.e_learning.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
  List<Lesson> findByCourseId(Long courseId);

  List<Lesson> findByCourseIdAndDeletedFalse(Long courseId);

  List<Lesson> findByCourse(Course course);

  //NN
  @Query("SELECT l FROM Lesson l JOIN l.courseModules cm WHERE cm.id = :moduleId")
  List<Lesson> findByCourseModuleId(@Param("moduleId") Long moduleId);
}
