package com.ai.e_learning.controllers;

import com.ai.e_learning.model.Notification;
import com.ai.e_learning.model.Role;
import com.ai.e_learning.model.User;
import com.ai.e_learning.service.NotificationService;
import com.ai.e_learning.service.RoleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class NotificationControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private NotificationService notificationServiceImpl;

    @Mock
    private RoleService roleService;

    @InjectMocks
    private NotificationController notificationController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(notificationController).build();
    }

    @Test
    public void testGetNotifications_ByRoleName() throws Exception {
        String roleName = "Instructor";
        Long userId = 1L;
        Role role = new Role();
        role.setName(roleName);
        Optional<Role> optionalRole = Optional.of(role);
        when(roleService.getRoleByName(roleName)).thenReturn(optionalRole);

        List<Notification> notifications = new ArrayList<>();
        when(notificationServiceImpl.getNotificationsForUser(userId)).thenReturn(notifications);

        mockMvc.perform(get("/api/notifications")
                        .param("roleName", roleName)
                        .param("userId", userId.toString()))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetNotifications_All() throws Exception {
        List<Notification> notifications = new ArrayList<>();
        when(notificationServiceImpl.getAllNotifications(null, null)).thenReturn(notifications);

        mockMvc.perform(get("/api/notifications"))
                .andExpect(status().isOk());
    }

    @Test
    public void testMarkAsRead() throws Exception {
        Long id = 1L;
        Notification notification = new Notification();
        when(notificationServiceImpl.markAsRead(id)).thenReturn(notification);

        mockMvc.perform(post("/api/notifications/read/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    public void testSoftDeleteNotification() throws Exception {
        Long id = 1L;
        Notification notification = new Notification();
        when(notificationServiceImpl.softDeleteNotification(id)).thenReturn(notification);

        mockMvc.perform(delete("/api/notifications/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    public void testSendNotificationToPage() {
        Notification notification = new Notification();
        Notification processedNotification = new Notification();
        when(notificationServiceImpl.processNotification(any(Notification.class))).thenReturn(processedNotification);

        notificationController.sendNotificationToPage(notification);

        // Assuming you have more assertions to verify the behavior
    }

    @Test
    public void testSendNotificationToUser() {
        Notification notification = new Notification();
        User user = new User();

        notificationController.sendNotificationToUser(notification, user);

        // Assuming you have more assertions to verify the behavior
    }
}
