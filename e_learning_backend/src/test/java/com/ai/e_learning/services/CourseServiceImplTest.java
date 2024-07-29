package com.ai.e_learning.services;

import com.ai.e_learning.controllers.NotificationController;
import com.ai.e_learning.dto.CourseDto;
import com.ai.e_learning.model.Category;
import com.ai.e_learning.model.Course;
import com.ai.e_learning.model.Role;
import com.ai.e_learning.model.User;
import com.ai.e_learning.repository.CategoryRepository;
import com.ai.e_learning.repository.CourseRepository;
import com.ai.e_learning.repository.UserRepository;
import com.ai.e_learning.service.RoleService;
import com.ai.e_learning.service.impl.CourseServiceImpl;
import com.ai.e_learning.util.CloudinaryService;
import com.ai.e_learning.util.DtoUtil;
import com.ai.e_learning.util.EntityUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CourseServiceImplTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private RoleService roleService;

    @Mock
    private CloudinaryService cloudinaryService;

    @Mock
    private NotificationController notificationController;

    @InjectMocks
    private CourseServiceImpl courseService;

    private Course course;
    private CourseDto courseDto;
    private User user;
    private Category category;

    @BeforeEach
    void setUp() {
        // Initialize test objects
        user = new User();
        user.setId(1L);
        user.setName("Test User");

        category = new Category();
        category.setId(1L);
        category.setName("Test Category");

        course = new Course();
        course.setId(1L);
        course.setName("Test Course");
        course.setUser(user);
        course.setCategories(new HashSet<>(Collections.singletonList(category)));

        courseDto = new CourseDto();
        courseDto.setId(1L);
        courseDto.setName("Test Course");
        courseDto.setUserId(1L);
        courseDto.setCategories(new HashSet<>(Collections.singletonList(category)));

        // Mock model mapper
        when(modelMapper.map(any(CourseDto.class), any())).thenReturn(course);
        when(modelMapper.map(any(Course.class), any())).thenReturn(courseDto);
    }

    @Test
    void testGetAllCourses() {
        when(courseRepository.findAll()).thenReturn(Collections.singletonList(course));

        List<CourseDto> result = courseService.getAllCourses();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Course", result.get(0).getName());
        verify(courseRepository, times(1)).findAll();
    }

    @Test
    void testSaveCourse() throws IOException, GeneralSecurityException {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        when(courseRepository.save(any(Course.class))).thenReturn(course);
        when(categoryRepository.findById(anyLong())).thenReturn(Optional.of(category));
        when(cloudinaryService.uploadFile(any(MultipartFile.class))).thenReturn("http://test.com/photo.jpg");

        CourseDto savedCourseDto = courseService.saveCourse(courseDto);

        assertNotNull(savedCourseDto);
        assertEquals("Test Course", savedCourseDto.getName());
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    void testChangeStatus() {
        when(courseRepository.findById(anyLong())).thenReturn(Optional.of(course));
        when(courseRepository.save(any(Course.class))).thenReturn(course);
        when(roleService.getRoleByName(anyString())).thenReturn(Optional.of(new Role()));

        courseService.changeStatus(1L, "Accepted");

        assertEquals("Accepted", course.getStatus());
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    void testSoftDeleteCourse() {
        when(courseRepository.findById(anyLong())).thenReturn(Optional.of(course));

        courseService.softDeleteCourse(1L);

        assertTrue(course.isDeleted());
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    void testGetCourseById() {
        when(courseRepository.findById(anyLong())).thenReturn(Optional.of(course));

        CourseDto result = courseService.getCourseById(1L);

        assertNotNull(result);
        assertEquals("Test Course", result.getName());
        verify(courseRepository, times(1)).findById(1L);
    }
}
