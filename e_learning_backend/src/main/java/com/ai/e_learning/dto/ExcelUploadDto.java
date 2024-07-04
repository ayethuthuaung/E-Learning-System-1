package com.ai.e_learning.dto;

import com.ai.e_learning.model.User;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ExcelUploadDto {
    private List<User> userList;
    private List<String> roles;
}
