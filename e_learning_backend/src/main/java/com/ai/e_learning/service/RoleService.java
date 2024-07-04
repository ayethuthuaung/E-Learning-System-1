package com.ai.e_learning.service;

import com.ai.e_learning.model.Role;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface RoleService {
    void addRoles();
    Optional<Role> getRoleByName(String name);
}
