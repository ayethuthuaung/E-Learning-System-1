package com.ai.e_learning.service;

import com.ai.e_learning.model.Notification;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    public Notification processNotification(Notification notification) {
        // Here you can add any business logic if needed
        return notification;
    }
}
