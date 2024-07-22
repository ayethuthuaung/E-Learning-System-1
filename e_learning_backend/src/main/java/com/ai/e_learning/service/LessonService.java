package com.ai.e_learning.service;

import com.ai.e_learning.dto.LessonDto;
import com.ai.e_learning.model.Lesson;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

public interface LessonService {
    LessonDto createLesson(LessonDto lessonDto) throws IOException, GeneralSecurityException;
    List<LessonDto> getAllLessons() throws GeneralSecurityException, IOException;
    LessonDto getLessonById(Long id);
    LessonDto updateLesson(Long id, LessonDto lessonDto);
    void deleteLesson(Long id);

    List<LessonDto> getLessonsByCourseId(Long courseId,Long userId);



}
