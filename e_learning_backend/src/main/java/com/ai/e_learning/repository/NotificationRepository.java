package com.ai.e_learning.repository;

import com.ai.e_learning.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification,Long> {

}
