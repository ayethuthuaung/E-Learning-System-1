package com.ai.e_learning.repository;

import com.ai.e_learning.model.Notification;
import com.ai.e_learning.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification,Long> {
    List<Notification> findByRole(Optional<Role> role);

    List<Notification> findByRoleName(String roleName);

    List<Notification> findByIsDeletedFalse();
}
