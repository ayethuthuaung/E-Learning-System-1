package com.ai.e_learning.service;

import com.ai.e_learning.model.Notification;
import com.ai.e_learning.model.Role;
import com.ai.e_learning.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
    public List<Notification> getNotificationsByRole(Optional<Role> role) {
        return notificationRepository.findByRole(role);
    }
    public List<Notification> getNotificationsByRoleName(String roleName) {
        return notificationRepository.findByRoleName(roleName);
    }
    public Notification markAsRead(Long id) {
        Optional<Notification> notificationOptional = notificationRepository.findById(id);
        if (notificationOptional.isPresent()) {
            Notification notification = notificationOptional.get();
            notification.setRead(true);
            return notificationRepository.save(notification);
        }
        throw new RuntimeException("Notification not found");
    }

}
