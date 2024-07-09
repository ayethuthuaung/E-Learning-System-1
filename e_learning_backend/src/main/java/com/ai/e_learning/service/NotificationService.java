package com.ai.e_learning.service;

import com.ai.e_learning.dto.NotificationDto;
import com.ai.e_learning.model.Notification;
import com.ai.e_learning.model.Role;

import java.util.List;
import java.util.Optional;

public interface NotificationService {
    Notification processNotification(Notification notification);
    List<Notification> getAllNotifications();
    List<Notification> getNotificationsByRole(Optional<Role> role);
    Notification markAsRead(Long id);
    Notification softDeleteNotification(Long id);
}
