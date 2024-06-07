package com.ai.e_learning.util;

import com.ai.e_learning.model.Role;
import com.ai.e_learning.model.User;
import com.ai.e_learning.repository.RoleRepository;
import com.ai.e_learning.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DatabaseInitializr {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @PostConstruct
    public void init() {
        addAdmin();
    }

    public void addAdmin() {
        Optional<Role> adminRoleOpt = roleRepository.findByName("ADMIN");
        Role adminRole;

        if (adminRoleOpt.isEmpty()) {
            adminRole = new Role();
            adminRole.setName("ADMIN");
            roleRepository.save(adminRole);
        } else {
            adminRole = adminRoleOpt.get();
        }

        User user = new User(
                1L,
                "11-11111",
                "Admin",
                "admin@gmail.com",
                "11111",
                "Admin",
                "HR",
                "Admin/HR",
                "Active",
                "default_user.png",
                passwordEncoder.encode("11111"),
                System.currentTimeMillis(),
                new HashSet<>(Collections.singletonList(adminRole)),
                true
        );

        userRepository.save(user);
    }
}
