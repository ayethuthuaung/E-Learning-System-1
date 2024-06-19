package com.ai.e_learning.dto;

import com.ai.e_learning.model.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
public class UserDto {
    private Long id;
    private String staffId;
    private String name;
    private String email;

    private Long doorLogNo;

    private String team;

    private String department;

    private String division;

    private String status;

    private String photo;

    private String password;

    private Long createdAt;
    private LocalDate createdDate;

    private Set<Role> roles;


}
