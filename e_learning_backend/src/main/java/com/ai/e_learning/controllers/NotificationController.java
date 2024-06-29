package com.ai.e_learning.controllers;

import com.ai.e_learning.model.Notification;
import com.ai.e_learning.model.Role;
import com.ai.e_learning.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private RoleService roleService;

    public void sendNotificationToPage(Notification notification) {
        Notification processedNotification = notificationService.processNotification(notification);
        messagingTemplate.convertAndSend("/topic/notifications", processedNotification);
    }
    @GetMapping
    public List<Notification> getNotifications(@RequestParam(required = false) String roleName) {
        if (roleName != null) {
            Optional<Role> role = roleService.getRoleByName(roleName);
            return notificationService.getNotificationsByRole(role);
        }
        return notificationService.getAllNotifications();
    }
    @PostMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }
}
