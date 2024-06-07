package com.ai.e_learning.repository;

import com.ai.e_learning.model.Role;
import com.ai.e_learning.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository  extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}
