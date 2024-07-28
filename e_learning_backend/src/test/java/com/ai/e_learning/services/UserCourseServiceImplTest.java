package com.ai.e_learning.services;

import com.ai.e_learning.controllers.NotificationController;
import com.ai.e_learning.dto.UserCourseDto;
import com.ai.e_learning.model.*;
import com.ai.e_learning.repository.*;
import com.ai.e_learning.service.RoleService;
import com.ai.e_learning.service.impl.UserCourseServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserCourseServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserCourseRepository userCourseRepository;

    @Mock
    private NotificationController notificationController;

    @Mock
    private RoleService roleService;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private UserCourseServiceImpl userCourseService;

    private User user;
    private Course course;
    private UserCourse userCourse;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setName("John Doe");

        course = new Course();
        course.setId(1L);
        course.setName("Test Course");

        userCourse = new UserCourse();
        userCourse.setId(1L);
        userCourse.setUser(user);
        userCourse.setCourse(course);
        userCourse.setCompleted(false);
        userCourse.setProgress(0);
        userCourse.setStatus("Pending");
    }

    @Test
    void testEnrollUserInCourse() {
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(userCourseRepository.existsByUserAndCourse(user, course)).thenReturn(false);
        when(userCourseRepository.save(any(UserCourse.class))).thenReturn(userCourse);
        when(modelMapper.map(any(UserCourse.class), eq(UserCourseDto.class))).thenReturn(new UserCourseDto());

        UserCourseDto result = userCourseService.enrollUserInCourse(user.getId(), course.getId());

        assertNotNull(result);
        verify(userCourseRepository, times(1)).save(any(UserCourse.class));
        verify(notificationController, times(1)).sendNotificationToUser(any(Notification.class), any(User.class));
    }

    @Test
    void testEnrollUserInCourse_UserAlreadyEnrolled() {
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        when(userCourseRepository.existsByUserAndCourse(user, course)).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> userCourseService.enrollUserInCourse(user.getId(), course.getId()));
    }

    @Test
    void testGetAllUserCourses() {
        List<UserCourse> userCourseList = List.of(userCourse);
        when(userCourseRepository.findAll()).thenReturn(userCourseList);
        when(modelMapper.map(any(UserCourse.class), eq(UserCourseDto.class))).thenReturn(new UserCourseDto());

        List<UserCourseDto> result = userCourseService.getAllUserCourses();

        assertNotNull(result);
        assertFalse(result.isEmpty());
    }

    @Test
    void testChangeStatus() {
        when(userCourseRepository.findById(userCourse.getId())).thenReturn(Optional.of(userCourse));
        when(userCourseRepository.save(any(UserCourse.class))).thenReturn(userCourse);

        userCourseService.changeStatus(userCourse.getId(), "Accepted");

        verify(userCourseRepository, times(1)).save(any(UserCourse.class));
        verify(notificationController, times(1)).sendNotificationToUser(any(Notification.class), any(User.class));
        assertEquals("Accepted", userCourse.getStatus());
    }
}
