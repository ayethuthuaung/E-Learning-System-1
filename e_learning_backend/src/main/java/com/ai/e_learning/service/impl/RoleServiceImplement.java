package com.ai.e_learning.service.impl;

import com.ai.e_learning.model.Role;
import com.ai.e_learning.repository.RoleRepository;
import com.ai.e_learning.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleServiceImplement implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public void addRoles() {
        String[] roleNames = {"Student", "Admin", "Instructor"};

        for (String roleName : roleNames) {
            roleRepository.findByName(roleName).orElseGet(() -> {
                Role role = new Role();
                role.setName(roleName);
                return roleRepository.save(role);
            });
        }
    }
}
