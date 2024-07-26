package com.ai.e_learning.service.impl;

import com.ai.e_learning.model.Notification;
import com.ai.e_learning.model.Role;
import com.ai.e_learning.model.User;
import com.ai.e_learning.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class NotificationServiceImplTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private NotificationServiceImpl notificationServiceImpl;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testProcessNotification() {
        Notification notification = new Notification();
        notification.setCreatedAt(new Date());

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        Notification result = notificationServiceImpl.processNotification(notification);

        assertEquals(notification, result);
    }

    @Test
    public void testGetAllNotifications_AdminRole() {
        String roleName = "Admin";
        Long userId = null;
        List<Notification> notifications = new ArrayList<>();

        when(notificationRepository.findByIsDeletedFalse()).thenReturn(notifications);

        List<Notification> result = notificationServiceImpl.getAllNotifications(roleName, userId);

        assertEquals(notifications, result);
    }

    @Test
    public void testGetAllNotifications_InstructorRole() {
        String roleName = "Instructor";
        Long userId = 1L;
        List<Notification> notifications = new ArrayList<>();

        when(notificationRepository.findByIsDeletedFalseAndUserId(userId)).thenReturn(notifications);

        List<Notification> result = notificationServiceImpl.getAllNotifications(roleName, userId);

        assertEquals(notifications, result);
    }

    @Test
    public void testGetNotificationsByRole() {
        Role role = new Role();
        Optional<Role> roleOptional = Optional.of(role);
        List<Notification> notifications = new ArrayList<>();

        when(notificationRepository.findByRoleAndIsDeletedFalse(roleOptional)).thenReturn(notifications);

        List<Notification> result = notificationServiceImpl.getNotificationsByRole(roleOptional);

        assertEquals(notifications, result);
    }

    @Test
    public void testGetNotificationsForUser() {
        Long userId = 1L;
        List<Notification> notifications = new ArrayList<>();

        when(notificationRepository.findByIsDeletedFalseAndUserId(userId)).thenReturn(notifications);

        List<Notification> result = notificationServiceImpl.getNotificationsForUser(userId);

        assertEquals(notifications, result);
    }

    @Test
    public void testSendNotificationToUser() {
        Notification notification = new Notification();
        User user = new User();
        user.setId(1L);

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        notificationServiceImpl.sendNotificationToUser(notification, user);

        assertEquals(user, notification.getUser());
    }

    @Test
    public void testMarkAsRead_NotificationExists() {
        Long id = 1L;
        Notification notification = new Notification();
        notification.setRead(false);

        when(notificationRepository.findById(id)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(notification)).thenReturn(notification);

        Notification result = notificationServiceImpl.markAsRead(id);

        assertEquals(true, result.isRead());
    }

    @Test
    public void testMarkAsRead_NotificationNotExists() {
        Long id = 1L;

        when(notificationRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> notificationServiceImpl.markAsRead(id));
    }

    @Test
    public void testSoftDeleteNotification_NotificationExists() {
        Long id = 1L;
        Notification notification = new Notification();
        notification.setDeleted(false);

        when(notificationRepository.findById(id)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(notification)).thenReturn(notification);

        Notification result = notificationServiceImpl.softDeleteNotification(id);

        assertEquals(true, result.isDeleted());
    }

    @Test
    public void testSoftDeleteNotification_NotificationNotExists() {
        Long id = 1L;

        when(notificationRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> notificationServiceImpl.softDeleteNotification(id));
    }
}
