package com.ai.e_learning.repository;

import com.ai.e_learning.model.Notification;
import com.ai.e_learning.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,Long> {
    List<Notification> findByRole(Optional<Role> role);

    List<Notification> findByRoleName(String roleName);

    List<Notification> findByIsDeletedFalse();
    List<Notification> findByRoleAndIsDeletedFalse(Optional<Role> role);
    List<Notification> findByRoleNameAndIsDeletedFalse(String roleName);
}
