package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.CourseModuleDto;
import com.ai.e_learning.dto.LessonDto;
import com.ai.e_learning.exception.EntityNotFoundException;
import com.ai.e_learning.model.CourseModule;
import com.ai.e_learning.model.Lesson;
import com.ai.e_learning.model.UserCourse;
import com.ai.e_learning.repository.CourseModuleRepository;
import com.ai.e_learning.repository.LessonRepository;
import com.ai.e_learning.repository.UserCourseRepository;
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

  @Autowired
  private UserCourseRepository userCourseRepository;

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
//    System.out.println(existingModule);

    if(courseModuleDto.getFileInput() == null){
      System.out.println("Hi");
      System.out.println(existingModule.getFile());
      courseModuleDto.setFile(existingModule.getFile());
    } else {
      MultipartFile fileInput = courseModuleDto.getFileInput();
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

      courseModuleDto.setFile(fileUrl);

    }
    courseModuleDto.setCreatedAt(existingModule.getCreatedAt());
    courseModuleDto.setLesson(existingModule.getLesson());
    courseModuleDto.setId(id);
//    courseModuleDto.setName(existingModule.getName());
    System.out.println(courseModuleDto.getName() + courseModuleDto.getLesson().getTitle() + courseModuleDto.getFile());
    modelMapper.map(courseModuleDto, existingModule);
    System.out.println(existingModule.getName() + existingModule.getLesson().getTitle() + existingModule.getFile());

    CourseModule updatedModule = EntityUtil.saveEntity(courseModuleRepository, existingModule, "CourseModule");
    return DtoUtil.map(updatedModule, CourseModuleDto.class, modelMapper);
  }

  @Override
  public void deleteModule(Long id) {
    EntityUtil.deleteEntity(courseModuleRepository, id, "CourseModule");
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

  if (totalModules == 0) {
    return 0.0;
  }
    return (doneModules.doubleValue() / totalModules.doubleValue()) * 100;
}


  @Override
  public Map<String, Map<String, Double>> getAllStudentsProgress() {
    List<UserCourse> userCourses = userCourseRepository.findAll();
    Map<String, Map<String, Double>> allStudentsProgress = new HashMap<>();

    for (UserCourse userCourse : userCourses) {
      Long studentId = userCourse.getUser().getId();
      String studentName = userCourse.getUser().getName();  // Assuming 'getName' returns the student's name
      String courseName = userCourse.getCourse().getName();
      Double completionPercentage = calculateCompletionPercentage(studentId, userCourse.getCourse().getId());


      allStudentsProgress
        .computeIfAbsent(studentName, k -> new HashMap<>())
        .put(courseName, completionPercentage);
    }

    return allStudentsProgress;
  }

  @Override
  public Map<String, Map<String, Double>> getAllCoursesProgress() {
    List<UserCourse> userCourses = userCourseRepository.findAll();
    Map<String, Map<String, Double>> allCoursesProgress = new HashMap<>();

    for (UserCourse userCourse : userCourses) {
      Long studentId = userCourse.getUser().getId();
      String studentName = userCourse.getUser().getName();  // Assuming 'getName' returns the student's name
      String courseName = userCourse.getCourse().getName();
      Double completionPercentage = calculateCompletionPercentage(studentId, userCourse.getCourse().getId());

      allCoursesProgress
        .computeIfAbsent(courseName, k -> new HashMap<>())
        .put(studentName, completionPercentage);
    }

    return allCoursesProgress;
  }


  @Override
  public List<CourseModuleDto> getModulesByLessonId(Long lessonId) {
    // Retrieve Lesson entity
    Lesson lesson = EntityUtil.getEntityById(lessonRepository, lessonId, "Lesson");

    // Retrieve CourseModule entities for the lesson
    List<CourseModule> modules = courseModuleRepository.findByLesson(lesson);

    // Convert entities to DTOs
    List<CourseModuleDto> moduleDtos = modules.stream()
      .map(module -> DtoUtil.map(module, CourseModuleDto.class, modelMapper))
      .collect(Collectors.toList());

    return moduleDtos;
  }

  //NN(module and lesson in stu profile)
  public List<LessonDto> getLessonsByModuleId(Long moduleId) {
    CourseModule module = courseModuleRepository.findById(moduleId)
      .orElseThrow(() -> new EntityNotFoundException("CourseModule not found"));

    List<Lesson> lessons = lessonRepository.findByCourseModuleId(moduleId);
    return lessons.stream()
      .map(this::convertToDto)
      .collect(Collectors.toList());
  }
  private LessonDto convertToDto(Lesson lesson) {
    LessonDto dto = new LessonDto();
    dto.setId(lesson.getId());
    dto.setTitle(lesson.getTitle());
    dto.setCourseId(lesson.getCourse().getId());
    return dto;
  }

  @Override
  public List<CourseModuleDto> getModulesByCourseId(Long courseId) {
    List<CourseModule> modules = courseModuleRepository.findByCourseId(courseId);
    return modules.stream()
      .map(module -> DtoUtil.map(module, CourseModuleDto.class, modelMapper))
      .collect(Collectors.toList());
  }

}
