package com.ai.e_learning.service;

import com.ai.e_learning.model.Notification;
import com.ai.e_learning.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification processNotification(Notification notification) {
        // Save the notification to the database
        return notificationRepository.save(notification);
    }
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}
