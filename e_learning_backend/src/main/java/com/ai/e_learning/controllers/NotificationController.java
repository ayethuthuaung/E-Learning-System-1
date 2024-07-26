package com.ai.e_learning.controllers;

import com.ai.e_learning.model.Notification;
import com.ai.e_learning.model.Role;
import com.ai.e_learning.model.User;
import com.ai.e_learning.service.NotificationService;
import com.ai.e_learning.service.impl.NotificationServiceImpl;
import com.ai.e_learning.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationService notificationServiceImpl;

    @Autowired
    private RoleService roleService;

    public void sendNotificationToPage(Notification notification) {
        Notification processedNotification = notificationServiceImpl.processNotification(notification);
        messagingTemplate.convertAndSend("/topic/notifications", processedNotification);
    }
    public void sendNotificationToUser(Notification notification, User user) {
        notificationServiceImpl.sendNotificationToUser(notification, user);
    }
    @GetMapping
    public List<Notification> getNotifications(
            @RequestParam(required = false) String roleName,
            @RequestParam(required = false) Long userId) {
        if (roleName != null) {
            Optional<Role> role = roleService.getRoleByName(roleName);
            if (role.isPresent()) {
                if ("Instructor".equals(roleName) && userId != null) {
                    return notificationServiceImpl.getNotificationsForUser(userId); // Only fetch for the instructor
                }
                return notificationServiceImpl.getNotificationsByRole(role);
            }
        }
        return notificationServiceImpl.getAllNotifications(roleName, userId);
    }


    @PostMapping("/read/{id}")
    public Notification markAsRead(@PathVariable Long id) {
        return notificationServiceImpl.markAsRead(id);
    }

    @DeleteMapping("/{id}")
    public Notification softDeleteNotification(@PathVariable Long id) {
        return notificationServiceImpl.softDeleteNotification(id);
    }
    @GetMapping("/unread-count")
    public long getUnreadCount(
            @RequestParam String roleName,
            @RequestParam Long userId) {
        return notificationServiceImpl.getUnreadCount(roleName, userId);
    }
}
