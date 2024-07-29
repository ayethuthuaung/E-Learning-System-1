package com.ai.e_learning.services;

import com.ai.e_learning.dto.UserCourseModuleDto;
import com.ai.e_learning.model.*;
import com.ai.e_learning.repository.*;
import com.ai.e_learning.service.CourseModuleService;
import com.ai.e_learning.service.impl.UserCourseModuleServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserCourseModuleServiceImplTest {

    @Mock
    private UserCourseModuleRepository userCourseModuleRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseModuleRepository courseModuleRepository;

    @Mock
    private CourseModuleService courseModuleService;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserCourseRepository userCourseRepository;

    @InjectMocks
    private UserCourseModuleServiceImpl userCourseModuleService;

    private User user;
    private CourseModule courseModule;
    private UserCourseModule userCourseModule;
    private Course course;
    private UserCourse userCourse;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        courseModule = new CourseModule();
        courseModule.setId(1L);

        userCourseModule = new UserCourseModule();
        userCourseModule.setId(1L);
        userCourseModule.setUser(user);
        userCourseModule.setCourseModule(courseModule);
        userCourseModule.setDone(false);

        course = new Course();
        course.setId(1L);
        course.setName("Test Course");

        userCourse = new UserCourse();
        userCourse.setId(1L);
        userCourse.setUser(user);
        userCourse.setCourse(course);
    }

    @Test
    void testMarkModuleAsDone_WhenUserCourseModuleExists() {
        when(userCourseModuleRepository.findByUserIdAndCourseModuleId(any(Long.class), any(Long.class)))
                .thenReturn(Optional.of(userCourseModule));
        when(userCourseModuleRepository.save(any(UserCourseModule.class))).thenReturn(userCourseModule);

        UserCourseModuleDto result = userCourseModuleService.markModuleAsDone(1L, 1L);

        assertNotNull(result);
        assertEquals(1L, result.getUserId());
        assertEquals(1L, result.getModuleId());
        assertTrue(result.isDone());

        verify(userCourseModuleRepository, times(1)).save(any(UserCourseModule.class));
    }

    @Test
    void testMarkModuleAsDone_WhenUserCourseModuleDoesNotExist() {
        when(userCourseModuleRepository.findByUserIdAndCourseModuleId(any(Long.class), any(Long.class)))
                .thenReturn(Optional.empty());
        when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(user));
        when(courseModuleRepository.findById(any(Long.class))).thenReturn(Optional.of(courseModule));
        when(courseRepository.findByModuleId(any(Long.class))).thenReturn(course);
        when(userCourseRepository.findByUserIdAndCourseId(any(Long.class), any(Long.class)))
                .thenReturn(Optional.of(userCourse));
        when(courseModuleService.calculateCompletionPercentage(any(Long.class), any(Long.class))).thenReturn(100.0);
        when(userCourseModuleRepository.save(any(UserCourseModule.class))).thenReturn(userCourseModule);
        when(userCourseRepository.save(any(UserCourse.class))).thenReturn(userCourse);

        UserCourseModuleDto result = userCourseModuleService.markModuleAsDone(1L, 1L);

        assertNotNull(result);
        assertEquals(1L, result.getUserId());
        assertEquals(1L, result.getModuleId());
        assertTrue(result.isDone());

        verify(userCourseModuleRepository, times(1)).save(any(UserCourseModule.class));
        verify(userCourseRepository, times(1)).save(any(UserCourse.class));
    }

    @Test
    void testGetModuleCompletionStatus_WhenModuleIsCompleted() {
        when(userCourseModuleRepository.findByUserIdAndCourseModuleId(any(Long.class), any(Long.class)))
                .thenReturn(Optional.of(userCourseModule));

        boolean result = userCourseModuleService.getModuleCompletionStatus(1L, 1L);

        assertTrue(result);
    }

    @Test
    void testGetModuleCompletionStatus_WhenModuleIsNotCompleted() {
        userCourseModule.setDone(false);
        when(userCourseModuleRepository.findByUserIdAndCourseModuleId(any(Long.class), any(Long.class)))
                .thenReturn(Optional.of(userCourseModule));

        boolean result = userCourseModuleService.getModuleCompletionStatus(1L, 1L);

        assertFalse(result);
    }

    @Test
    void testGetModuleCompletionStatus_WhenModuleDoesNotExist() {
        when(userCourseModuleRepository.findByUserIdAndCourseModuleId(any(Long.class), any(Long.class)))
                .thenReturn(Optional.empty());

        boolean result = userCourseModuleService.getModuleCompletionStatus(1L, 1L);

        assertFalse(result);
    }
}
