package com.ai.e_learning.service;

import com.ai.e_learning.dto.NotificationDto;
import com.ai.e_learning.model.Notification;
import com.ai.e_learning.model.Role;
import com.ai.e_learning.model.User;

import java.util.List;
import java.util.Optional;

public interface NotificationService {
    Notification processNotification(Notification notification);
    List<Notification> getAllNotifications(String roleName, Long userId);
    List<Notification> getNotificationsByRole(Optional<Role> role);
    Notification markAsRead(Long id);
    Notification softDeleteNotification(Long id);
    void sendNotificationToUser(Notification notification, User user);
    List<Notification> getNotificationsForUser(Long userId);
    long getUnreadCount(String roleName, Long userId);
}
