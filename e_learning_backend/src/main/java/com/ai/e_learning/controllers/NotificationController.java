package com.ai.e_learning.controllers;

import com.ai.e_learning.model.Notification;
import com.ai.e_learning.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationService notificationService;

    public void sendNotificationToPage(Notification notification) {
        Notification processedNotification = notificationService.processNotification(notification);
        messagingTemplate.convertAndSend("/topic/notifications", processedNotification);
    }
    @GetMapping
    public List<Notification> getNotifications() {
        return notificationService.getAllNotifications();
    }
}
