package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.NotificationDto;
import com.ai.e_learning.model.Notification;
import com.ai.e_learning.model.Role;
import com.ai.e_learning.model.User;
import com.ai.e_learning.repository.NotificationRepository;
import com.ai.e_learning.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationServiceImpl implements NotificationService {

  @Autowired
  private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public Notification processNotification(Notification notification) {
        notification.setCreatedAt(new Date());
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications(String roleName, Long userId) {
        List<Notification> notificationList;
        if ("Admin".equals(roleName)) {
            notificationList = notificationRepository.findByIsDeletedFalse();
        } else if ("Instructor".equals(roleName) && userId != null) {
            notificationList = notificationRepository.findByIsDeletedFalseAndUserId(userId);
        }else if ("Student".equals(roleName) && userId != null) {
            notificationList = notificationRepository.findByIsDeletedFalseAndUserId(userId);
        }
        else {
            notificationList = new ArrayList<>();

        }

        List<Notification> formattedNotifications = new ArrayList<>();
        for (Notification notification : notificationList) {
            System.out.println(notification);
            String formattedMessage = formatNotificationMessage(notification, roleName);
            notification.setMessage(formattedMessage);
            formattedNotifications.add(notification);
        }

        return formattedNotifications;
    }


    private String formatNotificationMessage(Notification notification, String roleName) {
        if ("Admin".equals(roleName)) {
            return notification.getMessage(); // Assuming message is already formatted for Admin
        } else if ("Instructor".equals(roleName)) {
            // Reformat message for Instructor
            return notification.getMessage().replaceFirst("new course added:", "course has been");
        }
        return notification.getMessage(); // Default message if role is not matched
    }


    public List<Notification> getNotificationsByRole(Optional<Role> role) {
        return notificationRepository.findByRoleAndIsDeletedFalse(role);
    }
    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByIsDeletedFalseAndUserId(userId);
    }

    public void sendNotificationToUser(Notification notification, User user) {
        notification.setUser(user);
        processNotification(notification);

    }
    public Notification markAsRead(Long id) {
        Optional<Notification> notificationOptional = notificationRepository.findById(id);
        if (notificationOptional.isPresent()) {
            Notification notification = notificationOptional.get();
            notification.setRead(true); // update the isRead state
            return notificationRepository.save(notification);
        }
        throw new RuntimeException("Notification not found");
    }

    public Notification softDeleteNotification(Long id) {
        Optional<Notification> notificationOptional = notificationRepository.findById(id);
        if (notificationOptional.isPresent()) {
            Notification notification = notificationOptional.get();
            notification.setDeleted(true);
            return notificationRepository.save(notification);
        }
        throw new RuntimeException("Notification not found");
    }
    @Override
    public long getUnreadCount(String roleName, Long userId) {
        if ("Admin".equals(roleName)) {
            return notificationRepository.countByIsDeletedFalseAndIsReadFalse();
        } else if ("Instructor".equals(roleName) && userId != null) {
            return notificationRepository.countByIsDeletedFalseAndIsReadFalseAndUserId(userId);
        }
        else if ("Student".equals(roleName) && userId != null) {
            return notificationRepository.countByIsDeletedFalseAndIsReadFalseAndUserId(userId);
        }
        return 0;
    }
}
