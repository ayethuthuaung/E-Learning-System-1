package com.ai.e_learning.service.impl;

import com.ai.e_learning.controllers.NotificationController;
import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.dto.UserDto;
import com.ai.e_learning.model.*;

import com.ai.e_learning.model.Category;
import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.User;
import com.ai.e_learning.repository.CategoryRepository;
import com.ai.e_learning.repository.CourseRepository;
import com.ai.e_learning.repository.UserCourseRepository;
import com.ai.e_learning.repository.UserRepository;
import com.ai.e_learning.service.CourseService;
import com.ai.e_learning.service.RoleService;
import com.ai.e_learning.util.*;
import jakarta.persistence.Column;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.util.*;
import java.util.stream.Collectors;

import static com.ai.e_learning.util.Helper.convertLongToLocalDate;


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
  private UserCourseRepository userCourseRepository;

  @Autowired
  private ModelMapper modelMapper;
  private final Helper helper;


  @Autowired
  private RoleService roleService;

  @Autowired
  private CloudinaryService cloudinaryService;

  @Autowired
  private NotificationController notificationController;


  @Override
  public List<CourseDto> getAllCourses(String status) {

    if ("all".equalsIgnoreCase(status)) {
      return getAllCourseList();
    }

    //Change List
    List<String> statusList = Arrays.asList(status.split(","));
    List<Course> allCourses = courseRepository.findByStatusIn(statusList);


//      try {
//        GoogleDriveJSONConnector driveConnector = new GoogleDriveJSONConnector();
//        String fileId = driveConnector.getFileIdByName(course.getPhoto());
//        String thumbnailLink = driveConnector.getFileThumbnailLink(fileId);
//        course.setPhoto(thumbnailLink);
//      } catch (IOException | GeneralSecurityException e) {
//        e.printStackTrace();
//      }
        // Convert createdAt to createdDate in CourseDto


    return DtoUtil.mapList(allCourses,CourseDto.class,modelMapper);
  }

  //AT
  @Override
  public List<CourseDto> getAllCourses(){
    List<Course> courseList = EntityUtil.getAllEntities(courseRepository);
    if(courseList==null)
      return null;
    return DtoUtil.mapList(courseList, CourseDto.class, modelMapper);
  }
  //AT

  //PK
  @Override
  public List<CourseDto> getAllCourseList() {
    List<Course> courses = courseRepository.findAll();
    return courses.stream()
      .map(this::convertToDto)
      .collect(Collectors.toList());
  }

  @Override
  public CourseDto saveCourse(CourseDto courseDto) throws IOException, GeneralSecurityException {
    courseDto.setId(null);
    Course course = convertToEntity(courseDto);
    User user = EntityUtil.getEntityById(userRepository,courseDto.getUserId(),"user");
    course.setUser(user);
//    boolean isAdmin = user.getRoles().stream()
//      .anyMatch(role -> role.getName().equals("Admin"));
//    if (isAdmin) {
      course.setStatus("In Progress");


    //Google Drive
//    String imageUrl;
//    GoogleDriveJSONConnector driveConnector = new GoogleDriveJSONConnector();
//
//    try {
//      imageUrl = driveConnector.uploadImageToDrive2( courseDto.getPhotoInput(), "Course");
//    } catch (IOException | GeneralSecurityException e) {
//      throw new RuntimeException("Failed to upload file to Google Drive", e);
//    }
//    course.setPhoto("https://lh3.google.com/u/0/d/"+imageUrl);

    //Cloudinary
    MultipartFile photofile = courseDto.getPhotoInput();
    String fileUrl = cloudinaryService.uploadFile(photofile);
    course.setPhoto(fileUrl);
    course.setPhotoName(photofile.getOriginalFilename());


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
    // Send notifications

  //  sendAdminNotifications(savedCourse);
    return convertToDto(savedCourse);
  }


  private void sendAdminNotifications(Course course) {
    Optional<Role> adminRoleOptional = roleService.getRoleByName("Admin");
    if (adminRoleOptional.isPresent()) {
      Role adminRole = adminRoleOptional.get();
      Notification adminNotification = new Notification();
      String username = course.getUser().getName();
      adminNotification.setMessage(username+" :   new course added:   " + course.getName());
      adminNotification.setRole(adminRole);
      notificationController.sendNotificationToPage(adminNotification);
    } else {
      // Handle the case where the admin role is not found
      System.out.println("Admin role not found");
    }
  }

  @Override
  public void changeStatus(Long id,String status){
    Course course = EntityUtil.getEntityById(courseRepository,id,"Course");
    course.setStatus(status);
    if("Pending".equals(status)) {
      course.setRequestedAt(System.currentTimeMillis());
      sendAdminNotifications(course);
    }else {
      course.setAcceptedAt(System.currentTimeMillis());
      sendInstructorNotification(course, status);
    }
    Course updatedCourse = EntityUtil.saveEntity(courseRepository, course, "Course");

    Hibernate.initialize(updatedCourse.getUser());
    // Send notifications

//    sendInstructorNotification(updatedCourse, status);
  }

  private void sendInstructorNotification(Course course, String action) {
    Optional<Role> instructorRoleOptional = roleService.getRoleByName("Instructor");
    if (instructorRoleOptional.isPresent()) {
      Role instructorRole = instructorRoleOptional.get();
      Notification instructorNotification = new Notification();
      instructorNotification.setMessage("Admin course " + course.getName() + " has been " + action);
      instructorNotification.setRole(instructorRole);
      notificationController.sendNotificationToUser(instructorNotification, course.getUser());
    } else {
      System.out.println("Instructor role not found");
    }
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

              if (courseDto.getPhotoInput() == null || courseDto.getPhotoInput().isEmpty()) {
                courseDto.setPhoto(existingCourse.getPhoto());
              } else {
//                String imageUrl;
//                GoogleDriveJSONConnector driveConnector = new GoogleDriveJSONConnector();
//
//                try {
//                  imageUrl = driveConnector.uploadImageToDrive2(courseDto.getPhotoInput(), "Course");
//                } catch (IOException | GeneralSecurityException e) {
//                  throw new RuntimeException("Failed to upload file to Google Drive", e);
//                }
//                courseDto.setPhoto("https://lh3.google.com/u/0/d/" + imageUrl);
                //Cloudinary
                MultipartFile photofile = courseDto.getPhotoInput();
                  String fileUrl = null;
                  try {
                      fileUrl = cloudinaryService.uploadFile(photofile);
                  } catch (IOException e) {
                      throw new RuntimeException(e);
                  }
                  courseDto.setPhoto(fileUrl);
                courseDto.setPhotoName(photofile.getOriginalFilename());
              }
              List<Long> categoryIdList = new ArrayList<>();
              for(Category category : courseDto.getCategories()){
                Long categoryId = category.getId();
                System.out.println(categoryId);
                categoryIdList.add(categoryId);
              }
              Set<Category> updatedCategories = new HashSet<>(categoryRepository.findAllById(categoryIdList));
              courseDto.setCategories(updatedCategories);

              // Map other fields
              modelMapper.map(courseDto, existingCourse);

              Course updatedCourse = courseRepository.saveAndFlush(existingCourse); // Save to ensure changes are persisted
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
  @Override
  public List<CourseDto> getAcceptCoursesByUserId(Long userId) {
    List<Course> courses = courseRepository.findByUserIdAndIsDeletedFalseAndStatusAccepted(userId);
    List<CourseDto> courseDtos = DtoUtil.mapList(courses, CourseDto.class, modelMapper);
    for (CourseDto courseDto : courseDtos) {
      List<UserCourse> userCourses = userCourseRepository.findByCourseId(courseDto.getId());
      courseDto.setStudentCount(userCourses.size());
    }
    return courseDtos;
  }
  @Override
  public List<CourseDto> getCoursesByUserId(Long userId) {
    List<Course> courses = courseRepository.findByUserIdAndIsDeletedFalse(userId);
    List<CourseDto> courseDtos = DtoUtil.mapList(courses,CourseDto.class,modelMapper);
    for(CourseDto courseDto : courseDtos){
      List<UserCourse> userCourses = userCourseRepository.findByCourseId(courseDto.getId());
      courseDto.setStudentCount(userCourses.size());
    }
    return courseDtos;
  }

  private Course convertToEntity(CourseDto dto) {
    return modelMapper.map(dto, Course.class);
  }

  private CourseDto convertToDto(Course course) {
    return modelMapper.map(course, CourseDto.class);
  }

  @Override
  public List<CourseDto> getLatestAcceptedCourses() {
    List<Course> courses = courseRepository.findLatestAcceptedCourses();
    return courses.stream()
      .map(course -> modelMapper.map(course, CourseDto.class))
      .limit(3) // Limit to latest 5 courses
      .collect(Collectors.toList());
  }

  @Override
  public List<CourseDto> getCoursesByInstructorId(Long instructorId) {
    List<Course> courses = courseRepository.findByUserId(instructorId);
    List<Course> acceptedCourses = courses.stream()
      .filter(course -> "Accept".equalsIgnoreCase(course.getStatus()))
      .collect(Collectors.toList());
    return acceptedCourses.stream()
      .map(this::convertToDto)
      .collect(Collectors.toList());
  }

  @Override
  public Long getCourseId(Long lessonId) {
    return courseRepository.findCourseIdByLessonId(lessonId);
  }

  @Override
  public Long getCourseIdByExamId(Long examId) {
    Course course = courseRepository.findCourseByExamId(examId);
    return course.getId();
  }


}

