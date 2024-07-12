package com.ai.e_learning.controllers;

import com.ai.e_learning.model.Notification;
import com.ai.e_learning.model.Role;
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
    private NotificationServiceImpl notificationServiceImpl;

    @Autowired
    private RoleService roleService;

    public void sendNotificationToPage(Notification notification) {
        Notification processedNotification = notificationServiceImpl.processNotification(notification);
        messagingTemplate.convertAndSend("/topic/notifications", processedNotification);
    }

    @GetMapping
    public List<Notification> getNotifications(@RequestParam(required = false) String roleName) {
        if (roleName != null) {
            Optional<Role> role = roleService.getRoleByName(roleName);
            return notificationServiceImpl.getNotificationsByRole(role);
        }
        return notificationServiceImpl.getAllNotifications();
    }

    @PostMapping("/read/{id}")
    public Notification markAsRead(@PathVariable Long id) {
        return notificationServiceImpl.markAsRead(id);
    }

    @DeleteMapping("/{id}")
    public Notification softDeleteNotification(@PathVariable Long id) {
        return notificationServiceImpl.softDeleteNotification(id);
    }
}
