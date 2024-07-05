package com.ai.e_learning.service.impl;

import com.ai.e_learning.dto.NotificationDto;
import com.ai.e_learning.model.Notification;
import com.ai.e_learning.model.Role;
import com.ai.e_learning.repository.NotificationRepository;
import com.ai.e_learning.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationServiceImpl implements NotificationService {

  @Autowired
  private NotificationRepository notificationRepository;

    public Notification processNotification(Notification notification) {
        notification.setCreatedAt(new Date());
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        List<Notification> notificationList=notificationRepository.findByIsDeletedFalse();
        for(Notification notification:notificationList){
            System.out.println(notification);
        }
        return notificationRepository.findByIsDeletedFalse();
    }

    public List<Notification> getNotificationsByRole(Optional<Role> role) {
        return notificationRepository.findByRoleAndIsDeletedFalse(role);
    }

//    public List<Notification> getNotificationsByRoleName(String roleName) {
//        return notificationRepository.findByRoleNameAndIsDeletedFalse(roleName);
//    }

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
}
