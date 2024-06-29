package com.ai.e_learning.service;

import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.exception.EntityNotFoundException;
import com.ai.e_learning.model.Category;
import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.User;
import com.ai.e_learning.repository.CategoryRepository;
import com.ai.e_learning.repository.CourseRepository;
import com.ai.e_learning.repository.UserRepository;
import com.ai.e_learning.util.EntityUtil;
import com.ai.e_learning.util.GoogleDriveJSONConnector;
import com.ai.e_learning.util.Helper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

  @Autowired
  private CourseRepository courseRepository;

  @Autowired
  private CategoryRepository categoryRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ModelMapper modelMapper;
  private final Helper helper;


  @Override
  public List<CourseDto> getAllCourses(String status) {


    List<Course> allCourses = courseRepository.findByStatus(status);

    GoogleDriveJSONConnector driveConnector;

      driveConnector = new GoogleDriveJSONConnector();

      for (Course course : allCourses) {
      try {
        String fileId = driveConnector.getFileIdByName(course.getPhoto());
        String thumbnailLink = driveConnector.getFileThumbnailLink(fileId);
        course.setPhoto(thumbnailLink);
      } catch (IOException | GeneralSecurityException e) {
        e.printStackTrace();
      }
    }

    return allCourses.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
  }


  @Override
  public CourseDto saveCourse(CourseDto courseDto) throws IOException, GeneralSecurityException {
    courseDto.setId(null);
    Course course = convertToEntity(courseDto);
    User user = EntityUtil.getEntityById(userRepository,courseDto.getUserId(),"user");
    course.setUser(user);

    File tempFile = File.createTempFile(course.getName() + "_" + Helper.getCurrentTimestamp(), null);
    courseDto.getPhotoInput().transferTo(tempFile);
    String imageUrl = helper.uploadImageToDrive(tempFile, "course");
    course.setPhoto(tempFile.getName());

    Set<Category> mergedCategories = new HashSet<>();
    for (Category category : courseDto.getCategories()) {
      Category managedCategory = categoryRepository.findById(category.getId())
              .map(existingCategory -> {
                existingCategory.setName(category.getName());
                return existingCategory;
              })
              .orElse(category);
      mergedCategories.add(managedCategory);
    }

    course.setCategories(mergedCategories);

    Course savedCourse = EntityUtil.saveEntity( courseRepository, course,"Course");

    return convertToDto(savedCourse);
  }

  @Override
  public void changeStatus(Long id,String status){

      Course course = EntityUtil.getEntityById(courseRepository,id,"Course");
      course.setStatus(status);
      EntityUtil.saveEntity(courseRepository,course,"Course");
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
      return modelMapper.map(dto, Course.class);
  }

  private CourseDto convertToDto(Course course) {
      return modelMapper.map(course, CourseDto.class);
  }
}
