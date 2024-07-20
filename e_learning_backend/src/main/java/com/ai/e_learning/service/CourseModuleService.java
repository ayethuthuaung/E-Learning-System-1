package com.ai.e_learning.service;

import com.ai.e_learning.dto.CourseModuleDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.Map;

public interface CourseModuleService {
    CourseModuleDto getModuleById(Long id);
    void createModules(List<CourseModuleDto> courseModuleDtos, List<MultipartFile> fileInputs) throws IOException, GeneralSecurityException;
    CourseModuleDto updateModule(Long id, CourseModuleDto courseModuleDto);
    void deleteModule(Long id);
    List<CourseModuleDto> getAllModules();
  Long countDoneModulesByUserAndCourse(Long userId, Long courseId);

  Long countTotalModulesByCourse(Long courseId);

  Double calculateCompletionPercentage(Long userId, Long courseId);

    Map<String, Map<String, Double>> getAllStudentsProgress();
    Map<String, Map<String, Double>> getAllCoursesProgress();

    List<CourseModuleDto> getModulesByLessonId(Long lessonId);

}
