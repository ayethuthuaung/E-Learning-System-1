package com.ai.e_learning.service;

import com.ai.e_learning.controllers.NotificationController;
import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.exception.EntityNotFoundException;
import com.ai.e_learning.model.Category;
import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.Notification;
import com.ai.e_learning.repository.CategoryRepository;
import com.ai.e_learning.repository.CourseRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

  @Autowired
  private CourseRepository courseRepository;

  @Autowired
  private CategoryRepository categoryRepository;

  @Autowired
  private ModelMapper modelMapper;

  @Autowired
  private NotificationService notificationService;

  @Autowired
  private NotificationController notificationController;

  @Override
  public List<CourseDto> getAllCourses() {
    List<Course> allCourses = courseRepository.findAll();
    return allCourses.stream()
      .map(this::convertToDto)
      .collect(Collectors.toList());
  }

  @Override
  public CourseDto saveCourse(CourseDto courseDto) {
    courseDto.setId(null);
    Course course = convertToEntity(courseDto);

    Set<Category> categories = new HashSet<>();
    for (Category category : courseDto.getCategories()) {
      Category category1 = categoryRepository.findById(category.getId()).orElseThrow(() ->
        new EntityNotFoundException("Category not found"));
      categories.add(category1);
    }
    course.setCategories(categories);

    Course savedCourse = courseRepository.save(course);
    // Send notification via WebSocket
    Notification notification = new Notification();
    notification.setMessage("New course added: " + savedCourse.getName());
    System.out.println(notification);
    notificationController.sendNotificationToPage(notification);

    // Handle photo conversion
//    if (courseDto.getPhoto() != null) {
//      byte[] photoBytes = ProfileImageService.convertStringToByteArray(courseDto.getPhoto());
//     savedCourse.setPhoto(photoBytes);
//    }

    return convertToDto(savedCourse);
  }

  @Override
  public CourseDto getCourseById(Long id) {
    return courseRepository.findById(id)
      .map(this::convertToDto)
      .orElse(null);
  }

  @Override
  public CourseDto updateCourse(Long id, CourseDto courseDto) {
    return courseRepository.findById(id)
      .map(existingCourse -> {
        courseDto.setId(existingCourse.getId());
        modelMapper.map(courseDto, existingCourse);

        // Handle photo conversion
//        if (courseDto.getPhoto() != null) {
//          byte[] photoBytes = ProfileImageService.convertStringToByteArray(courseDto.getPhoto());
//          existingCourse.setPhoto(photoBytes);
//        }

        Course updatedCourse = courseRepository.save(existingCourse);
        return convertToDto(updatedCourse);
      })
      .orElse(null);
  }

  @Override
  public void softDeleteCourse(Long id) {
    courseRepository.findById(id)
      .ifPresent(course -> {
        course.setDeleted(true);
        courseRepository.save(course);
      });
  }

  @Override
  public List<CourseDto> getCoursesByCategory(Long categoryId) {
    return courseRepository.findByCategories_Id(categoryId).stream()
      .map(this::convertToDto)
      .collect(Collectors.toList());
  }

  @Override
  public void addCategoryToCourse(Long courseId, Long categoryId) {
    Optional<Course> courseOpt = courseRepository.findById(courseId);
    Optional<Category> categoryOpt = categoryRepository.findById(categoryId);

    if (courseOpt.isPresent() && categoryOpt.isPresent()) {
      Course course = courseOpt.get();
      Category category = categoryOpt.get();
      course.getCategories().add(category);
      category.getCourses().add(course);
      courseRepository.save(course);
    }
  }

  @Override
  public boolean isCourseNameAlreadyExists(String name) {
    return courseRepository.existsByName(name);
  }

  private Course convertToEntity(CourseDto dto) {
    Course course = modelMapper.map(dto, Course.class);

    // Handle photo conversion
//    if (dto.getPhoto() != null) {
//      byte[] photoBytes = ProfileImageService.convertStringToByteArray(dto.getPhoto());
//      course.setPhoto(photoBytes);
//    }

    return course;
  }

  private CourseDto convertToDto(Course course) {
    CourseDto courseDto = modelMapper.map(course, CourseDto.class);

    // Handle photo conversion
//    if (course.getPhoto() != null) {
//      String base64Photo = ProfileImageService.generateStringOfImage(course.getPhoto());
//      courseDto.setPhoto(base64Photo);
//    }

    return courseDto;
  }
}
