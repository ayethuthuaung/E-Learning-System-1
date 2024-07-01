package com.ai.e_learning.service;

import com.ai.e_learning.dto.LessonDto;
import com.ai.e_learning.model.Lesson;

import java.util.List;

public interface LessonService {
    Lesson createLesson(LessonDto lessonDto);
    List<Lesson> getAllLessons();
    Lesson getLessonById(Long id);
    Lesson updateLesson(Long id, LessonDto lessonDto);
    void deleteLesson(Long id);
}
