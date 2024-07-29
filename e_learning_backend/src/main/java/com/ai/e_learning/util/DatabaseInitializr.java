
package com.ai.e_learning.util;


import com.ai.e_learning.service.QuestionService;
import com.ai.e_learning.service.RoleService;
import com.ai.e_learning.service.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class DatabaseInitializr {

    private final UserService userService;
    private final RoleService roleService;
    private final QuestionService questionService;

    @PostConstruct
    public void init() {
        roleService.addRoles();
        userService.addAdmin();
        questionService.addQuestionType();

    }

}
