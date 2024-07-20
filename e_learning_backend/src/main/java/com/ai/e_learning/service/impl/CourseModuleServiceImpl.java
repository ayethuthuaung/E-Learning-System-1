package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.CourseModuleDto;
import com.ai.e_learning.model.CourseModule;
import com.ai.e_learning.model.Lesson;
import com.ai.e_learning.repository.CourseModuleRepository;
import com.ai.e_learning.repository.LessonRepository;
import com.ai.e_learning.service.CourseModuleService;
import com.ai.e_learning.util.CloudinaryService;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import com.ai.e_learning.util.GoogleDriveJSONConnector;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CourseModuleServiceImpl implements CourseModuleService {

  private final CourseModuleRepository courseModuleRepository;
  private final LessonRepository lessonRepository;

  @Autowired
  private CloudinaryService cloudinaryService;

  private final ModelMapper modelMapper;

  @Override
  public CourseModuleDto getModuleById(Long id) {
    CourseModule courseModule = EntityUtil.getEntityById(courseModuleRepository, id, "CourseModule");
    CourseModuleDto courseModuleDto = DtoUtil.map(courseModule, CourseModuleDto.class, modelMapper);
    courseModuleDto.setFile(courseModule.getFile());
    return courseModuleDto;
  }

  public void createModules(List<CourseModuleDto> courseModuleDtos, List<MultipartFile> fileInputs) throws IOException, GeneralSecurityException {
    for (int i = 0; i < courseModuleDtos.size(); i++) {
      CourseModuleDto courseModuleDto = courseModuleDtos.get(i);
      MultipartFile fileInput = fileInputs.get(i);

      // Get the lesson entity
      Lesson lesson = EntityUtil.getEntityById(lessonRepository, courseModuleDto.getLessonId(), "Lesson");

      // Create a new CourseModule entity
      CourseModule courseModule = new CourseModule();
      courseModule.setName(courseModuleDto.getName());
      courseModule.setLesson(lesson);

      String fileType = fileInput.getContentType();
      String fileId = null;
      String fileUrl = null;

      if (!"video/mp4".equals(fileType)) {
        GoogleDriveJSONConnector driveConnector = new GoogleDriveJSONConnector();
        try {
          fileId = driveConnector.uploadImageToDrive2(fileInput, "Module");
          fileUrl = "https://drive.google.com/file/d/" + fileId + "/view";
        } catch (IOException | GeneralSecurityException e) {
          throw new RuntimeException("Failed to upload file to Google Drive", e);
        }
      } else {
        try {
          fileUrl = cloudinaryService.uploadVideo(fileInput);
        } catch (IOException e) {
          throw new RuntimeException("Fail to upload file to Cloudinary", e);
        }
      }

      courseModule.setFile(fileUrl);

      // Save the course module
      courseModuleRepository.save(courseModule);
    }
  }

  @Override
  public CourseModuleDto updateModule(Long id, CourseModuleDto courseModuleDto) {
    CourseModule existingModule = EntityUtil.getEntityById(courseModuleRepository, id, "CourseModule");
//        modelMapper.map(courseModuleDto, existingModule);
    CourseModule updatedModule = EntityUtil.saveEntity(courseModuleRepository, existingModule, "CourseModule");
    return DtoUtil.map(updatedModule, CourseModuleDto.class, modelMapper);
  }

  @Override
  public void deleteModule(Long id) {
    courseModuleRepository.deleteById(id);
  }

  @Override
  public List<CourseModuleDto> getAllModules() {
    List<CourseModule> modules = courseModuleRepository.findAll();
    return modules.stream()
      .map(module -> DtoUtil.map(module, CourseModuleDto.class, modelMapper))
      .collect(Collectors.toList());
  }
  @Override
  public Long countDoneModulesByUserAndCourse(Long userId, Long courseId) {
    return courseModuleRepository.countDoneModulesByUserAndCourse(userId, courseId);
  }

  @Override
  public Long countTotalModulesByCourse(Long courseId) {
    return courseModuleRepository.countTotalModulesByCourse(courseId);
  }

//  @Override
//  public Double calculateCompletionPercentage(Long userId, Long courseId) {
//    Long doneModules = countDoneModulesByUserAndCourse(userId, courseId);
//    Long totalModules = countTotalModulesByCourse(courseId);
//
//    if (totalModules == 0) {
//      return 0.0;
//    }
//
//    return (doneModules.doubleValue() / totalModules.doubleValue()) * 100;
//  }
@Override
public Double calculateCompletionPercentage(Long userId, Long courseId) {
  Long doneModules = courseModuleRepository.countDoneModulesByUserAndCourse(userId, courseId);
  Long totalModules = courseModuleRepository.countTotalModulesByCourse(courseId);

  System.out.println("User ID: " + userId);
  System.out.println("Course ID: " + courseId);
  System.out.println("Done Modules: " + doneModules);
  System.out.println("Total Modules: " + totalModules);

  if (totalModules == 0) {
    return 0.0;
  }

  Double completionPercentage = (doneModules.doubleValue() / totalModules.doubleValue()) * 100;
  System.out.println("Completion Percentage: " + completionPercentage);

  return completionPercentage;
}
}
