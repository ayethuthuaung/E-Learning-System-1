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
import com.ai.e_learning.util.Helper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
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
  public List<CourseDto> getAllCourses() {
    List<Course> allCourses = courseRepository.findAll();
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

      Set<Category> categories = new HashSet<>(courseDto.getCategories());
    course.setCategories(categories);
    File tempFile = File.createTempFile(course.getName() + "_" + Helper.getCurrentTimestamp(), null);
    courseDto.getPhotoInput().transferTo(tempFile);
    String imageUrl = helper.uploadImageToDrive(tempFile, "course");
    course.setPhoto(tempFile.getName());
    Course savedCourse = EntityUtil.saveEntity(courseRepository, course, "Course");



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
